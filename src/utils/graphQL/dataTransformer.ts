import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { MultiInputItem } from '@/utils/hook/useInputList';
import { isRelationshipTable } from './metadataExtractor';

/**
 * GraphQL 응답을 React Hook Form 형식으로 변환
 * @param graphqlData - GraphQL 쿼리 응답 데이터
 * @param formConfig - 폼 설정 객체
 * @returns React Hook Form이 사용할 수 있는 형식의 데이터
 */
export function graphqlToFormData(
  graphqlData: any,
  formConfig: FormConfig,
): Record<string, MultiInputItem[][] | string[] | boolean | File | null> {
  const formData: Record<
    string,
    MultiInputItem[][] | string[] | boolean | File | null
  > = {};

  // GraphQL 응답에서 edges.node 추출
  const mainData = graphqlData?.edges?.[0]?.node || graphqlData;
  console.log(
    'graphqlToFormData - mainData:',
    JSON.stringify(mainData, null, 2),
  );

  formConfig.fields.forEach((field) => {
    if (!field.columnInfo) {
      // columnInfo가 없는 필드는 기본값 설정
      if (field.type === 'checkbox') {
        formData[field.fieldName] = false;
      } else if (field.type === 'picture') {
        formData[field.fieldName] = null;
      } else {
        formData[field.fieldName] = [];
      }
      return;
    }

    const { table, column } = field.columnInfo;

    // Picture 타입 처리
    if (field.type === 'picture') {
      formData[field.fieldName] = mainData?.[column] || null;
      return;
    }

    // Checkbox 타입 처리
    if (field.type === 'checkbox') {
      formData[field.fieldName] = mainData?.[column] || false;
      return;
    }

    // SkillTag 타입 처리
    if (field.type === 'skillTag') {
      const relationTableData = mainData?.[`${table}Collection`]?.edges || [];

      // valuePath를 사용하여 중첩된 값 추출
      const valuePath = field.valuePath || column;
      const skillNames: string[] = relationTableData
        .map((edge: any) => {
          const node = edge.node;

          // valuePath를 따라 중첩된 객체 탐색 (예: 'skill.skill_name')
          const pathParts = valuePath.split('.');
          let value = node;
          for (const part of pathParts) {
            value = value?.[part];
            if (value === undefined || value === null) break;
          }

          return value || '';
        })
        .filter(Boolean);

      formData[field.fieldName] = skillNames;
      return;
    }

    // InputList 타입 처리
    if (field.type === 'inputList') {
      const { inputConfig } = field;

      // 관계 테이블인 경우
      if (isRelationshipTable(table)) {
        const relationData = mainData?.[`${table}Collection`]?.edges || [];

        console.log(`Processing InputList for ${table}:`, {
          tableName: table,
          collectionKey: `${table}Collection`,
          relationDataExists: !!mainData?.[`${table}Collection`],
          edgesLength: relationData.length,
          firstNode: relationData[0]?.node,
        });

        if (inputConfig.onlyOne) {
          // onlyOne인 경우 단일 아이템
          const firstItem = relationData[0]?.node;
          if (firstItem) {
            const multiInputItems: MultiInputItem[] = inputConfig.inputs.map(
              (input) => {
                // input.name이 "certificates.certificate_name" 같은 형식일 수 있음
                if (!input.name) {
                  return { value: '' };
                }
                const nameParts = input.name.split('.');
                let value = firstItem;
                for (const part of nameParts) {
                  value = value?.[part];
                }
                console.log(
                  `Field ${field.fieldName}, input ${input.name}, extracted value:`,
                  value,
                );
                return { value: value || '' };
              },
            );
            formData[field.fieldName] = [multiInputItems];
          } else {
            formData[field.fieldName] = [];
          }
        } else {
          // 여러 아이템
          const items: MultiInputItem[][] = relationData.map((edge: any) => {
            const node = edge.node;
            return inputConfig.inputs.map((input) => {
              if (!input.name) {
                return { value: '' };
              }
              const nameParts = input.name.split('.');
              let value = node;
              for (const part of nameParts) {
                value = value?.[part];
              }
              console.log(
                `Field ${field.fieldName}, input ${input.name}, extracted value from node:`,
                value,
              );
              return { value: value || '' };
            });
          });
          formData[field.fieldName] = items;
          console.log(`Field ${field.fieldName} final items:`, items);
        }
      } else {
        // 메인 테이블의 컬럼인 경우 (onlyOne)
        if (inputConfig.onlyOne) {
          const value = mainData?.[column];
          const multiInputItems: MultiInputItem[] = inputConfig.inputs.map(
            () => ({
              value: value || '',
            }),
          );
          formData[field.fieldName] = [multiInputItems];
        } else {
          formData[field.fieldName] = [];
        }
      }
    }
  });

  return formData;
}

/**
 * React Hook Form 데이터를 GraphQL Insert/Update 형식으로 변환
 * @param formData - React Hook Form 데이터
 * @param formConfig - 폼 설정 객체
 * @returns GraphQL mutation에 사용할 수 있는 형식의 데이터
 */
export function formDataToGraphQL(
  formData: Record<string, any>,
  formConfig: FormConfig,
): {
  mainTableData: Record<string, any>;
  relationTableData: Map<string, any[]>;
} {
  const mainTableData: Record<string, any> = {};
  const relationTableData = new Map<string, any[]>();

  console.log('formDataToGraphQL - Input:', JSON.stringify(formData, null, 2));

  formConfig.fields.forEach((field) => {
    if (!field.columnInfo) return;

    const { table, column } = field.columnInfo;
    const fieldValue = formData[field.fieldName];

    // Picture 타입 처리
    if (field.type === 'picture') {
      if (fieldValue) {
        mainTableData[column] = fieldValue.name;
      }
      return;
    }

    // Checkbox 타입 처리
    if (field.type === 'checkbox') {
      mainTableData[column] = !!fieldValue;
      return;
    }

    // SkillTag 타입 처리
    if (field.type === 'skillTag') {
      const skillNames = fieldValue as string[];
      if (skillNames && skillNames.length > 0) {
        // skill_name을 저장 (나중에 graphqlDataService에서 Supabase REST API로 처리)
        const skillData = skillNames.map((skillName) => ({
          skill_name: skillName,
        }));
        relationTableData.set(table, skillData);
      }
      return;
    }

    // InputList 타입 처리
    if (field.type === 'inputList') {
      const { inputConfig } = field;
      const items = fieldValue as MultiInputItem[][];

      // 관계 테이블인 경우
      if (isRelationshipTable(table)) {
        if (items && items.length > 0) {
          const relationItems = items
            .filter((item) => {
              // 빈 항목 제외
              return item.some(
                (input) => input.value && String(input.value).trim() !== '',
              );
            })
            .map((item) => {
              const obj: Record<string, any> = {};
              item.forEach((input, index) => {
                const inputDef = inputConfig.inputs[index];
                if (inputDef && inputDef.name && input.value) {
                  // "certificates.certificate_name" 같은 형식 처리
                  const nameParts = inputDef.name.split('.');
                  if (nameParts.length > 1) {
                    // nested 객체 생성
                    let current = obj;
                    for (let i = 0; i < nameParts.length - 1; i++) {
                      if (!current[nameParts[i]]) {
                        current[nameParts[i]] = {};
                      }
                      current = current[nameParts[i]];
                    }
                    current[nameParts[nameParts.length - 1]] = input.value;
                  } else {
                    obj[inputDef.name] = input.value;
                  }
                }
              });
              return obj;
            });

          if (relationItems.length > 0) {
            relationTableData.set(table, relationItems);
          }
        }
      } else {
        // 메인 테이블의 컬럼인 경우 (onlyOne)
        if (inputConfig.onlyOne && items && items.length > 0) {
          const firstItem = items[0];
          if (firstItem && firstItem.length > 0) {
            mainTableData[column] = firstItem[0].value;
          }
        }
      }
    }
  });

  console.log('formDataToGraphQL - Output:', {
    mainTableData,
    relationTableData: Array.from(relationTableData.entries()).map(
      ([key, value]) => ({ [key]: value }),
    ),
  });

  return { mainTableData, relationTableData };
}

/**
 * 빈 값인지 확인
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * 두 객체를 비교하여 변경된 필드만 추출
 */
export function getChangedFields(
  oldData: Record<string, any>,
  newData: Record<string, any>,
): Record<string, any> {
  const changes: Record<string, any> = {};

  Object.keys(newData).forEach((key) => {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      changes[key] = newData[key];
    }
  });

  return changes;
}
