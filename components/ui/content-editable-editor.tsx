"use client";

import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";

interface Props {
  value?: string; // HTML string (from DB)
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ContentEditableEditor({
  value = "",
  onChange,
  placeholder = "Enter description...",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  // helper: normalize incoming HTML
  const normalizeHtml = (html: string) => {
    if (!html) return "";
    // 1) convert React/JSX className => class
    let normalized = html.replace(/\bclassName=/g, "class=");

    // 2) remove indentation/newlines between tags so they don't create gaps
    //    e.g. turns `> \n   <` into `><`
    normalized = normalized.replace(/>\s+</g, "><");

    // 3) optionally collapse repeated blank lines (if you want to preserve some newlines)
    // normalized = normalized.replace(/\n{2,}/g, '\n');

    // 4) sanitize
    const clean = DOMPurify.sanitize(normalized, {
      ALLOWED_ATTR: ["class", "href", "src", "alt", "title", "style"],
    });
    return clean;
  };

  // Sync incoming value -> DOM (when value changes externally)
  useEffect(() => {
    if (!ref.current) return;
    const sanitized = normalizeHtml(value || "");
    if (ref.current.innerHTML !== sanitized) {
      ref.current.innerHTML = sanitized;
    }
    setIsEmpty(!sanitized);
  }, [value]);

  const handleInput = () => {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    const clean = normalizeHtml(html);
    // Keep DOM in sync with sanitized HTML (optional, avoids bad nodes)
    if (ref.current.innerHTML !== clean) {
      // use requestAnimationFrame to avoid disrupting caret immediately
      requestAnimationFrame(() => {
        if (ref.current) ref.current.innerHTML = clean;
      });
    }
    onChange(clean);
    setIsEmpty(
      ref.current.textContent?.trim().length === 0 &&
        !ref.current.querySelector("img")
    );
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // allow paste then sanitize
    setTimeout(handleInput, 0);
  };

  return (
    <div
      ref={ref}
      contentEditable
      onInput={handleInput}
      onPaste={handlePaste}
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      className={`min-h-[120px] rounded-xl border p-3 outline-none ${className}`}
      data-placeholder={placeholder}
      // IMPORTANT: do NOT use pre-wrap; let the browser layout normally
      style={{ whiteSpace: "normal" }}
    />
  );
}
