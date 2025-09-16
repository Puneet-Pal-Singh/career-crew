// src/components/shared/MarkdownEditor.tsx
"use client";

import React, { useMemo } from 'react';
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css"; // Import the CSS

interface MarkdownEditorProps {
  // FIX #2: Make the 'value' prop optional to handle undefined from react-hook-form.
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const options = useMemo(() => {
    return {
      autofocus: false,
      spellChecker: false,
      placeholder: placeholder || "",
      // FIX #1: Use 'as const' to give the array a more specific, readonly type.
      toolbar: [
        "bold", "italic", "heading-2", "|",
        "unordered-list", "ordered-list", "|",
        "link", "quote", "|",
        "preview", "guide"
      ] as const, // <-- This is the fix for the toolbar error
      minHeight: "150px", 
      status: false,
    };
  }, [placeholder]);

  return (
    <div className="markdown-editor-container">
      {/* The component itself can handle a null or undefined value gracefully */}
      <SimpleMdeReact options={options} value={value} onChange={onChange} />
    </div>
  );
}