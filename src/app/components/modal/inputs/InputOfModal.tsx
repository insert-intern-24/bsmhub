"use client"

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Title } from '@components/system/text'
import LabelOfInputs from './LabelOfInputs'
import InputListProvider from './InputListProvider'
import SkillTagProvider from './SkillTagProvider'
import Checkbox from './Checkbox'
import Buttons from './Buttons'
import PictureUpload from './PictureUpload'
import { FormConfig } from './types/inputTypes'
import { MultiInputItem } from '@utils/hook/useInputList'

interface InputOfModalProps {
  title?: string;
  config: FormConfig;
  onSubmit?: (data: Record<string, MultiInputItem[][] | string[] | boolean | File | null>) => void;
  submitButtonText?: string;
}

const InputOfModal = ({ title = '제목', config, onSubmit, submitButtonText = '제출하기' }: InputOfModalProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: config.fields.reduce((acc: Record<string, MultiInputItem[][] | string[] | boolean | File | null>, field) => {
      if (field.type === 'checkbox') {
        acc[field.fieldName] = false;
      } else if (field.type === 'picture') {
        acc[field.fieldName] = null;
      } else {
        acc[field.fieldName] = [];
      }
      return acc;
    }, {} as Record<string, MultiInputItem[][] | string[] | boolean | File | null>)
  });

  const onFormSubmit = (data: Record<string, MultiInputItem[][] | string[] | boolean | File | null>) => {
    onSubmit?.(data);
  };

  return (
    <form 
      className="flex-col items-start w-[64rem] p-[4rem] gap-6 bg-white rounded-[0.5rem]"
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
                      onTagsChange={(tags: string[]) => onChange(tags.map(tag => [{ value: tag }]))}
                      white={field.white}
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
                      onlyOne={field.inputConfig.onlyOne}
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

      <div className="w-full mt-4">
        <Buttons 
          color="black"
          text={submitButtonText}
          onClick={handleSubmit(onFormSubmit)}
        />
      </div>
    </form>
  )
}

export default InputOfModal
