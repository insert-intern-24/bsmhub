"use client"

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Title } from '@components/system/text'
import LabelOfInputs from './LabelOfInputs'
import InputListProvider from './InputListProvider'
import Buttons from './Buttons'
import { FormConfig } from './types/inputTypes'
import { MultiInputItem } from '@utils/hook/useInputList'

interface InputOfModalProps {
  title?: string;
  config: FormConfig;
  onSubmit?: (data: Record<string, MultiInputItem[][]>) => void;
  submitButtonText?: string;
}

const InputOfModal = ({ title = '제목', config, onSubmit, submitButtonText = '제출하기' }: InputOfModalProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: config.fields.reduce((acc, field) => {
      acc[field.fieldName] = [];
      return acc;
    }, {} as Record<string, MultiInputItem[][]>)
  });

  const onFormSubmit = (data: Record<string, MultiInputItem[][]>) => {
    console.log('Form submitted:', data);
    onSubmit?.(data);
  };

  return (
    <form 
      className="flex flex-col items-start w-[64rem] p-[4rem] gap-6"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <Title className='mb-3'>{title}</Title>

      {config.fields.map((field) => (
        <div key={field.fieldName} className="w-full flex flex-col gap-2">
          <LabelOfInputs 
            label={field.label}
            required={field.required}
          />
          
          <Controller
            name={field.fieldName}
            control={control}
            rules={{ 
              validate: (value) => {
                if (field.required && (!value || value.length === 0)) {
                  return `${field.label}은(는) 필수 항목입니다.`;
                }
                return true;
              }
            }}
            render={({ field: { onChange } }) => (
              <InputListProvider
                config={field.inputConfig}
                onInputsChange={onChange}
                onlyOne={field.inputConfig.onlyOne}
              />
            )}
          />
          
          {errors[field.fieldName] && (
            <span className="text-red-500 text-sm">
              {errors[field.fieldName]?.message as string}
            </span>
          )}
        </div>
      ))}

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
