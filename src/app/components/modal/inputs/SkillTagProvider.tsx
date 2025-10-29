'use client';

import React from 'react';
import { useInputList } from '@utils/hook/useInputList';
import SkillTag from './SkillTag';
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/utils/supabase/database.types';
import { getOrCreateSkillId } from '@/utils/graphQL/relationTableHelper';

interface SkillTagProviderProps {
  white?: boolean;
  className?: string;
  onTagsChange?: (tags: number[]) => void;
  readOnly?: boolean;
  initialTags?: number[];
}

const SkillTagProvider = ({
  white = false,
  className = '',
  onTagsChange,
  readOnly = false,
  initialTags = [],
}: SkillTagProviderProps) => {
  const [{ inputs, activeIndex }, dispatch] = useInputList(
    initialTags.length > 0
      ? initialTags.map((id) => [{ value: id }])
      : [{ value: undefined }],
  );

  const [skills, setSkills] = React.useState<Tables<'skills'>[] | null>(null);
  const [suggestions, setSuggestions] = React.useState<Tables<'skills'>[]>([]);
  const [editValue, setEditValue] = React.useState('');

  const supabase = createClient();

  React.useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching skills:', error);
        } else {
          setSkills(data as unknown as Tables<'skills'>[]);
        }
      });
  }, []);

  const skillMap = React.useMemo(() => {
    if (!skills) return new Map<number, string>();
    return new Map(skills.map((s) => [Number(s.skill_id), s.skill_name]));
  }, [skills]);

  React.useEffect(() => {
    if (activeIndex !== null) {
      const skillId = inputs[activeIndex]?.[0]?.value;
      setEditValue(skillId != null ? skillMap.get(Number(skillId)) || '' : '');
    } else {
      setEditValue('');
    }
  }, [activeIndex, inputs, skillMap]);

  const inputsString = JSON.stringify(inputs);
  React.useEffect(() => {
    if (onTagsChange) {
      const tags = inputs
        .map((input) => input[0].value)
        .filter((v): v is number => v != null);
      onTagsChange(tags);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputsString]);

  const handleEditChange = (value: string) => {
    setEditValue(value);
    if (value.trim() && skills) {
      const lowerCaseValue = value.toLowerCase();
      const filtered = skills.filter((skill) =>
        skill.skill_name.toLowerCase().includes(lowerCaseValue),
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const commitChange = async (value: string, callback?: () => void) => {
    if (activeIndex === null) return;

    const trimmedValue = value.trim();
    setSuggestions([]);

    if (!trimmedValue) {
      dispatch({ type: 'SET_ACTIVE', index: null });
      return;
    }

    try {
      const skillId = await getOrCreateSkillId(trimmedValue);
      if (inputs.some((input) => Number(input[0].value) === skillId)) {
        dispatch({ type: 'SET_ACTIVE', index: null });
        return;
      }

      dispatch({
        type: 'UPDATE_VALUE',
        index: activeIndex,
        subIndex: 0,
        value: skillId,
      });
      dispatch({ type: 'SET_ACTIVE', index: null });
      if (callback) callback();
    } catch (error) {
      console.error('Failed to commit skill change', error);
    }
  };

  const addInput = () =>
    dispatch({ type: 'ADD_INPUT', multiInputConfig: [{ value: undefined }] });

  const deleteTag = (index: number) => {
    dispatch({ type: 'UPDATE_VALUE', index, subIndex: 0, value: undefined });
  };

  const renderTag = (index: number) => {
    const skillId = inputs[index]?.[0]?.value;
    const isActive = activeIndex === index;

    if (skillId == null && !isActive) return null;

    // Render a placeholder if the skill map is not ready for a given ID
    if (skillId != null && skills === null) {
      return (
        <div
          key={index}
          className="px-3 py-1 rounded-full text-label bg-light-gray-input animate-pulse"
        >
          ...
        </div>
      );
    }

    const skillName = skillId != null ? skillMap.get(Number(skillId)) : '';

    if (readOnly) {
      if (!skillName) return null;
      return (
        <SkillTag key={index} mode="read" value={skillName} white={white} />
      );
    }

    if (isActive) {
      return (
        <div className="relative" key={index}>
          <SkillTag
            mode="write"
            value={editValue}
            onChange={handleEditChange}
            onAdd={() => commitChange(editValue, addInput)}
            // onCommit={() => commitChange(editValue)}
            white={white}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto min-w-64">
              {suggestions.map((skill) => (
                <li
                  key={skill.skill_id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commitChange(skill.skill_name);
                  }}
                >
                  {skill.skill_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    return (
      <div
        key={index}
        onClick={() => dispatch({ type: 'SET_ACTIVE', index })}
        className="cursor-pointer"
      >
        <SkillTag
          mode="edit"
          value={skillName!}
          onDelete={() => deleteTag(index)}
          white={white}
        />
      </div>
    );
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {inputs.map((_, index) => renderTag(index)).filter((tag) => tag !== null)}
      {!readOnly && (
        <button
          type="button"
          onClick={addInput}
          className={`px-3 py-1 rounded-full text-label text-placeholder-gray ${
            white ? 'bg-white' : 'bg-light-gray-input'
          } hover:opacity-70`}
        >
          + 추가하기
        </button>
      )}
    </div>
  );
};

export default SkillTagProvider;
