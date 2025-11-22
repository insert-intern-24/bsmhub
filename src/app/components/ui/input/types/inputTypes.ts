import { ChangeEvent } from 'react';
import { DropdownInputConfig, InputConfig } from '@/app/components/modal/inputs/InputListProvider';

// GraphQL 쿼리 생성을 위한 컬럼 정보
export interface ColumnInfo {
  table: string;
  column: string;
}

// 실제 input HTML type
export type InputHTMLType =
  | 'text'
  | 'date'
  | 'number'
  | 'email'
  | 'password'
  | 'tel'
  | 'url';

// 컴포넌트 타입 (FormFieldConfig에서 사용)
export type InputType =
  | 'text'
  | 'date'
  | 'edit'
  | 'search'
  | 'picture'
  | 'checkbox'
  | 'skillTag';

// Input 모드 (SkillTag처럼 write/edit/read)
export type InputMode = 'write' | 'edit' | 'read';

// 기본 Input Props (picture 제외)
export interface BaseInputPropsCommon {
  mode?: InputMode;
  type?: InputHTMLType;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
  required?: boolean;
  id?: string;
  icon?: 'check' | 'search' | 'calendar';
  textarea?: boolean;
}

// picture 타입일 때
export interface PictureInputProps
  extends Omit<BaseInputPropsCommon, 'type' | 'icon'> {
  componentType: 'picture';
  aspectRatio?: string;
}

// 다른 타입일 때
export interface StandardInputProps extends BaseInputPropsCommon {
  componentType?: 'input';
  aspectRatio?: never;
}

// Union 타입으로 결합
export type BaseInputProps = PictureInputProps | StandardInputProps;

export type LabelInputsProps = BaseInputProps & {
  label?: string;
};

// FormField 타입별 설정
interface BaseFieldConfig {
  label: string;
  required?: boolean;
  fieldName: string; // "테이블명.속성" 형식으로 데이터베이스 컬럼 매핑
  columnInfo?: ColumnInfo; // GraphQL 쿼리 생성을 위한 컬럼 정보
  relationHandler?: {
    type: 'rest' | 'graphql';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler?: (...args: any[]) => any; // 핸들러 함수 자체
    identifierIsStudentId?: boolean; // ID 조회/생성이 필요한지 여부
    dataTransformer?: (data: unknown[]) => unknown[]; // 데이터 변환 함수
    deleteFilterGenerator?: (
      item: Record<string, unknown>,
      identifier: string | number, // 메인 엔티티의 ID (profileId, projectId 등)
      identifierField?: string, // 외래키 필드명 (기본값: 'profile_id')
    ) => Record<string, unknown>; // 삭제 필터 생성 함수
    changeCalculator?: (
      newData: unknown[],
      existingData: Record<string, unknown>[],
    ) => {
      toDelete: Record<string, unknown>[];
      toInsert: Record<string, unknown>[];
    }; // 변경사항 계산 함수
  };
}

// InputList 타입
interface InputListFieldConfig extends BaseFieldConfig {
  type: 'inputList';
  inputConfig: InputConfig;
}

interface DropdownInputListFieldConfig extends BaseFieldConfig {
  type: 'dropdownInputList';
  inputConfig: InputConfig;
  dropdownInputConfig: DropdownInputConfig;
}

// SkillTag 타입
interface SkillTagFieldConfig extends BaseFieldConfig {
  type: 'skillTag';
  white?: boolean;
  valuePath?: string; // GraphQL 응답에서 값을 추출할 경로 (예: 'skill.skill_name')
}

// Checkbox 타입
interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
  label: string;
  checkboxLabel?: string;
}

// Picture 타입
interface PictureFieldConfig extends BaseFieldConfig {
  type: 'picture';
  aspectRatio?: string;
  multiple?: boolean; // 여러 이미지 업로드 가능 여부
  bucket: string;
}

export type FormFieldConfig =
  | InputListFieldConfig
  | SkillTagFieldConfig
  | CheckboxFieldConfig
  | PictureFieldConfig
  | DropdownInputListFieldConfig;

// 전체 폼 설정
export interface FormConfig {
  fields: FormFieldConfig[];
  // GraphQL 쿼리 (필수: 사용자가 직접 작성)
  graphql: {
    read: string; // 조회 쿼리
    insert: string; // 삽입 mutation
    update: string; // 업데이트 mutation
    delete?: string; // 삭제 mutation (선택사항)
  };
  // 메인 테이블 정보 (선택사항, relation table 처리에 사용)
  mainTable?: string; // 메인 테이블 이름 (예: 'projects', 'profile')
  idField?: string; // 메인 테이블의 ID 필드명 (예: 'project_id', 'profile_id')
  deleteable?: boolean; // 삭제 가능 여부 (기본값: false)

  /**
   * 관계 테이블 처리 콜백 (선택사항)
   * 각 FormConfig에서 자체적으로 관계 테이블 업데이트 로직을 구현할 수 있음
   * @param recordId - 업데이트된 레코드의 ID (profile_id, project_id 등)
   * @param relationTableData - 관계 테이블 데이터 (Map<tableName, data[]>)
   * @param response - GraphQL mutation 응답
   * @param variables - 추가 변수들
   * @param originalRelationData - 기존 관계 테이블 데이터 (변경사항 계산용)
   */
  afterSave?: (params: {
    recordId: string | number;
    relationTableData: Map<string, unknown[]>;
    response: unknown;
    variables?: Record<string, unknown>;
    originalRelationData: Map<string, unknown[]>;
  }) => Promise<void>;
}
