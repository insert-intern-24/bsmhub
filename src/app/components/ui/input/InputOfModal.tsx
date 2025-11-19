'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Title } from '@/app/components/ui/text/text';
import LabelOfInputs from './LabelOfInputs';
import InputListProvider from '@/app/components/modal/inputs/InputListProvider';
import SkillTagProvider from '@/app/components/ui/tag/SkillTagProvider';
import Checkbox from './Checkbox';
import Button from '@/app/components/ui/button/Button';
import PictureUpload from './PictureUpload';
import DeleteConfirmModal from '@/app/components/modal/DeleteConfirmModal';
import { FormConfig } from './types/inputTypes';
import { MultiInputItem } from '@/utils/hook/useInputList';
import { useModal } from '@/app/components/modal';
import { useToast } from '@/app/components/toast';

interface InputOfModalProps {
  config: FormConfig;
  title?: string;
  initialValues?: Record<string, MultiInputItem[][] | number[] | string[] | boolean | File | null>;
  submitButtonText?: string;
  onSubmit?: (data: Record<string, MultiInputItem[][] | number[] | string[] | boolean | File | null>) => void;
  onDelete?: () => void;
  mode?: 'create' | 'update';
}

const InputOfModal = ({
  title = '제목',
  config,
  onSubmit,
  onDelete,
  submitButtonText = '제출하기',
  initialValues,
  mode,
}: InputOfModalProps) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: config.fields.reduce((acc: Record<string, MultiInputItem[][] | number[] | string[] | boolean | File | null>, field) => {
      // 초기값이 제공된 경우 사용, 그렇지 않으면 기본값 사용
      if (initialValues && initialValues[field.fieldName] !== undefined) {
        acc[field.fieldName] = initialValues[field.fieldName];
      } else if (field.type === 'checkbox') {
        acc[field.fieldName] = false;
      } else if (field.type === 'picture') {
        acc[field.fieldName] = null;
      } else {
        acc[field.fieldName] = [];
      }
      return acc;
    }, {} as Record<string, MultiInputItem[][] | string[] | boolean | File | null>)
  });

  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // initialValues가 변경될 때마다 폼을 리셋
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onFormSubmit = (data: Record<string, MultiInputItem[][] | number[] | string[] | boolean | File | null>) => {
    try {
      onSubmit?.(data);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '제출 중 오류가 발생했습니다.',
        'error',
        3000,
        '오류'
      );
    }
  };

  const handleDeleteClick = () => {
    openModal(
      <DeleteConfirmModal
        title="정말 삭제하시겠습니까?"
        message="이 작업은 되돌릴 수 없습니다. 삭제를 진행하려면 아래 체크박스를 선택해주세요."
        onConfirm={async () => {
          closeModal();
          if (onDelete) {
            try {
              setIsDeleting(true);
              await Promise.resolve(onDelete());
            } catch (error) {
              // 삭제 실패 시 상태 복구
              setIsDeleting(false);
              showToast(
                error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.',
                'error',
                3000,
                '오류'
              );
            }
          }
        }}
        onCancel={closeModal}
      />
    );
  };

  const showDeleteButton = config.deleteable && mode === 'update' && !isDeleting;

  return (
    <form 
      className="flex-col items-start w-[64rem] p-[4rem] gap-6 bg-white border-0 outline-none"
      onSubmit={handleSubmit(onFormSubmit)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      }}
    >
      <Title className='mb-3'>{title}</Title>

      {config.fields.map((field) => {
        return (
          <div key={field.fieldName} className="w-full flex-col gap-2">
            <LabelOfInputs 
              label={field.label}
              required={field.required}
            />
            
            <Controller
              name={field.fieldName}
              control={control}
              rules={{ 
                validate: (value) => {
                  if (!field.required) return true;
                  
                  // Checkbox 타입 검증
                  if (field.type === 'checkbox' && !value) {
                    return `${field.label}에 동의해주세요.`;
                  }
                  
                  // 배열 타입 검증 (InputList, SkillTag, Picture)
                  if (Array.isArray(value) && value.length === 0) {
                    return `${field.label}은(는) 필수 항목입니다.`;
                  }
                  
                  return true;
                }
              }}
              render={({ field: { onChange, value } }) => {
                // SkillTag 컴포넌트
                if (field.type === 'skillTag') {
                  return (
                    <SkillTagProvider
                      onTagsChange={(tags: number[]) => onChange(tags)}
                      white={field.white}
                      initialTags={value as number[]}
                    />
                  );
                }
                
                // Checkbox 컴포넌트
                if (field.type === 'checkbox') {
                  return (
                    <Checkbox
                      checked={!!value}
                      onChange={(checked: boolean) => onChange(checked)}
                      label={field.checkboxLabel}
                    />
                  );
                }
                
                // Picture 컴포넌트
                if (field.type === 'picture') {
                  return (
                    <PictureUpload
                      aspectRatio={field.aspectRatio}
                      onFileChange={onChange}
                    />
                  );
                }
                
                // InputList 타입
                if (field.type === 'inputList') {
                  return (
                    <InputListProvider
                      config={field.inputConfig}
                      onInputsChange={onChange}
                      initialValue={value as MultiInputItem[][] | undefined}
                      onlyOne={field.inputConfig.onlyOne}
                      required={field.required}
                    />
                  );
                }
                if(field.type === 'dropdownInputList'){
                  return (
                    <InputListProvider
                      config={field.inputConfig}
                      dropdownInputConfig={field.dropdownInputConfig}
                      onInputsChange={onChange}
                      initialValue={value as MultiInputItem[][] | undefined}
                      onlyOne={field.inputConfig.onlyOne}
                      required={field.required}
                    />
                  );
                }
                
                // Always return a React element
                return <></>;
              }}
            />
            
            {errors[field.fieldName] && (
              <span className="text-red-500 text-sm">
                {errors[field.fieldName]?.message as string}
              </span>
            )}
          </div>
        );
      })}

      <div className="w-full mt-4 flex gap-3">
        {showDeleteButton && (
          <div className="flex-1">
            <Button
              color="gray"
              text="삭제하기"
              onClick={handleDeleteClick}
            />
          </div>
        )}
        <div className={showDeleteButton ? 'flex-1' : 'w-full'}>
          <Button
            color="black"
            text={submitButtonText}
            onClick={handleSubmit(onFormSubmit)}
          />
        </div>
      </div>
    </form>
  );
};

export default InputOfModal;
