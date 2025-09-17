// src/components/dashboard/employer/form-fields/SkillsInput.tsx
"use client";

import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SkillsInputProps {
  // FIX: Make the 'value' prop optional to correctly handle the
  // initial `undefined` state from react-hook-form's Controller.
  value?: string[]; 
  onChange: (skills: string[]) => void;
  placeholder?: string;
}

export default function SkillsInput({ value = [], onChange, placeholder }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const newSkill = inputValue.trim();
    if (newSkill && !value.includes(newSkill) && value.length < 5) {
      onChange([...value, newSkill]);
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter(skill => skill !== skillToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((skill, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {skill}
            <button
              type="button"
              className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder || "Add a skill and press Enter..."}
        disabled={value.length >= 5}
      />
      {value.length >= 5 && (
        <p className="text-xs text-muted-foreground mt-1">
          You have reached the maximum of 5 skills.
        </p>
      )}
    </div>
  );
}
