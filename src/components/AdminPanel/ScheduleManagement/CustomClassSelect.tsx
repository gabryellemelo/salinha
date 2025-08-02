import React, { useState, useEffect } from "react";
import * as S from "./styles";

interface Class {
  id: number;
  name: string;
  min_age: number;
  max_age: number;
}

interface CustomClassSelectProps {
  value: string;
  onChange: (value: string) => void;
  classes: Class[];
}

const CustomClassSelect = ({ value, onChange, classes }: CustomClassSelectProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.custom-select-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedClass = classes.find(c => c.id.toString() === value);

  return (
    <>
      <S.Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >

        {classes.map((classItem) => (
          <option key={classItem.id} value={classItem.id}>
            {classItem.name} ({classItem.min_age}-{classItem.max_age} anos)
          </option>
        ))}
      </S.Select>
      
      <S.CustomSelectContainer className="custom-select-container">
        <S.CustomSelectButton
          type="button"
          isOpen={showDropdown}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedClass ? `${selectedClass.name} (${selectedClass.min_age}-${selectedClass.max_age} anos)` : "Escolha uma turma"}
          <span style={{ color: '#666', fontSize: '12px' }}>▼</span>
        </S.CustomSelectButton>
        
        {showDropdown && (
          <S.CustomDropdown>

            {classes.map((classItem) => (
              <S.CustomOption
                key={classItem.id}
                className={value === classItem.id.toString() ? 'selected' : ''}
                onClick={() => {
                  onChange(classItem.id.toString());
                  setShowDropdown(false);
                }}
              >
                {classItem.name} ({classItem.min_age}-{classItem.max_age} anos)
              </S.CustomOption>
            ))}
          </S.CustomDropdown>
        )}
      </S.CustomSelectContainer>
    </>
  );
};

export default CustomClassSelect; 