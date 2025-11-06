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
  graphqlData: Record<string, unknown>,
  formConfig: FormConfig,
): Record<string, MultiInputItem[][] | string[] | boolean | File | null> {
  const formData: Record<
    string,
    MultiInputItem[][] | string[] | boolean | File | null
  > = {};

  // GraphQL 응답에서 edges.node 추출
  const mainData =
    (graphqlData as { edges?: Array<{ node: Record<string, unknown> }> })
      .edges?.[0]?.node || graphqlData;
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
      const pic = (mainData as Record<string, unknown>)[column];
      formData[field.fieldName] = (pic as File) ?? null;
      return;
    }

    // Checkbox 타입 처리
    if (field.type === 'checkbox') {
      const val = (mainData as Record<string, unknown>)[column];
      formData[field.fieldName] = Boolean(val);
      return;
    }

    // SkillTag 타입 처리
    if (field.type === 'skillTag') {
      const collection = (mainData as Record<string, unknown>)[
        `${table}Collection`
      ] as { edges?: Array<{ node: Record<string, unknown> }> } | undefined;
      const relationTableData = collection?.edges || [];

      // valuePath를 사용하여 중첩된 값 추출
      const valuePath = field.valuePath || column;
      const skillNames: string[] = relationTableData
        .map((edge: { node: Record<string, unknown> }) => {
          const node = edge.node;

          // valuePath를 따라 중첩된 객체 탐색 (예: 'skill.skill_name')
          const pathParts = valuePath.split('.');
          let value: unknown = node;
          for (const part of pathParts) {
            value = (value as Record<string, unknown> | undefined)?.[part];
            if (value === undefined || value === null) break;
          }

          return String(value ?? '');
        })
        .filter((v) => v.trim() !== '');

      formData[field.fieldName] = skillNames;
      return;
    }

    // InputList 타입 처리
    if (field.type === 'inputList' || field.type === 'dropdownInputList') {
      const { inputConfig } = field;

      // 관계 테이블인 경우
      if (isRelationshipTable(table)) {
        const collection = (mainData as Record<string, unknown>)[
          `${table}Collection`
        ] as { edges?: Array<{ node: Record<string, unknown> }> } | undefined;
        const relationData = collection?.edges || [];

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
                let value: unknown = firstItem;
                for (const part of nameParts) {
                  value = (value as Record<string, unknown> | undefined)?.[part];
                }
                console.log(
                  `Field ${field.fieldName}, input ${input.name}, extracted value:`,
                  value,
                );
                return { value: String(value ?? '') };
              },
            );
            formData[field.fieldName] = [multiInputItems];
          } else {
            formData[field.fieldName] = [];
          }
        } else {
          // 여러 아이템
          const items: MultiInputItem[][] = relationData.map((edge: { node: Record<string, unknown> }) => {
            const node = edge.node;
            return inputConfig.inputs.map((input) => {
              if (!input.name) {
                return { value: '' };
              }
              const nameParts = input.name.split('.');
              let value: unknown = node;
              for (const part of nameParts) {
                value = (value as Record<string, unknown> | undefined)?.[part];
              }
              console.log(
                `Field ${field.fieldName}, input ${input.name}, extracted value from node:`,
                value,
              );
              return { value: String(value ?? '') };
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
              value: String(value ?? ''),
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
  formData: Record<string, MultiInputItem[][] | string[] | boolean | File | number[] | null | string>,
  formConfig: FormConfig,
): {
  mainTableData: Record<string, unknown>;
  relationTableData: Map<string, Record<string, unknown>[]>;
} {
  const mainTableData: Record<string, unknown> = {};
  const relationTableData = new Map<string, Record<string, unknown>[]>();

  console.log('formDataToGraphQL - Input:', JSON.stringify(formData, null, 2));

  formConfig.fields.forEach((field) => {
    if (!field.columnInfo) return;

    const { table, column } = field.columnInfo;
    const fieldValue = formData[field.fieldName];

    // Picture 타입 처리
    if (field.type === 'picture') {
      if (fieldValue) {
        mainTableData[column] = fieldValue;
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
      const skillIds = fieldValue as number[];
      if (skillIds && skillIds.length > 0) {
        // relationTableData에 skill_ids를 저장 (나중에 skill_name으로 변환)
        // table이 관계 테이블이면 relationTableData에, 메인 테이블 필드면 별도 처리
        if (isRelationshipTable(table)) {
          const skillData = skillIds.map((skillId) => ({
            skill_id: skillId,
          }));
          relationTableData.set(table, skillData);
        } else {
          // 메인 테이블 필드인 경우 (예: projects.skills)
          // skill_id 배열을 저장해두고 나중에 변환
          relationTableData.set(`__skills_${table}_${column}`, skillIds as unknown as Record<string, unknown>[]);
        }
      }
      return;
    }

    // InputList 타입 처리
    if (field.type === 'inputList' || field.type === 'dropdownInputList') {
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
              if(field.type === 'dropdownInputList') console.log("dropdownInputList item:", item);
              const obj: Record<string, unknown> = {};
              item.forEach((input, index) => {
                const inputDef = inputConfig.inputs[index];
                if (field.type === 'dropdownInputList') console.log("dropdownInputList inputDef:", inputDef, input);
                if (inputDef && inputDef.name && input.value) {
                  // "certificates.certificate_name" 같은 형식 처리
                  const nameParts = inputDef.name.split('.');
                  if (nameParts.length > 1) {
                    // nested 객체 생성
                    let current = obj as Record<string, unknown>;
                    for (let i = 0; i < nameParts.length - 1; i++) {
                      const key = nameParts[i];
                      if (!current[key]) {
                        current[key] = {} as Record<string, unknown>;
                      }
                      current = current[key] as Record<string, unknown>;
                    }
                    current[nameParts[nameParts.length - 1]] = input.value as unknown;
                    if(field.type === 'dropdownInputList') console.log("dropdownInputList current:", current);
                  } else {
                    obj[inputDef.name] = input.value;
                    if(field.type === 'dropdownInputList') console.log("dropdownInputList obj:", obj);
                  }
                }
              });
              return obj;
            });

          if (relationItems.length > 0) {
            relationTableData.set(table, relationItems);
          }
        } else {
          // 빈 배열일 때도 relationTableData에 빈 배열 설정 (삭제 처리용)
          relationTableData.set(table, []);
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
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * 두 객체를 비교하여 변경된 필드만 추출
 */
export function getChangedFields(
  oldData: Record<string, unknown>,
  newData: Record<string, unknown>,
): Record<string, unknown> {
  const changes: Record<string, unknown> = {};

  Object.keys(newData).forEach((key) => {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      changes[key] = newData[key];
    }
  });

  return changes;
}
