"use client";

import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { Upload, Link, X } from "lucide-react";

interface Props {
  value?: string; // HTML string
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Enter description...",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [html, setHtml] = useState(value);
  const [blockType, setBlockType] = useState("P");

  // sanitize helper: include tags commonly produced by execCommand (font)
  const sanitize = (rawHtml: string) => {
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        "a",
        "b",
        "i",
        "u",
        "strong",
        "em",
        "p",
        "br",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "img",
        "span",
        "div",
        "font",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "style", "class", "color"],
    });
  };

  useEffect(() => {
    const clean = sanitize(value || "");
    setHtml(clean);
    if (ref.current && ref.current.innerHTML !== clean) {
      ref.current.innerHTML = clean;
    }
  }, [value]);

  const exec = (cmd: string, val?: string) => {
    // Some browsers prefer tag names in uppercase or with angle brackets for formatBlock
    if (cmd === "formatBlock" && val) {
      document.execCommand(cmd, false, val.startsWith("<") ? val : `<${val}>`);
    } else {
      document.execCommand(cmd, false, val || null);
    }
    // update state after exec
    requestAnimationFrame(handleInput);
  };

  const handleInput = () => {
    if (!ref.current) return;
    const raw = ref.current.innerHTML;
    const clean = sanitize(raw);
    // keep DOM in sync
    if (ref.current.innerHTML !== clean) {
      requestAnimationFrame(() => {
        if (ref.current) ref.current.innerHTML = clean;
      });
    }
    setHtml(clean);
    onChange(clean);
    updateBlockType();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // let paste happen then sanitize
    setTimeout(handleInput, 0);
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL", "https://");
    if (url) exec("createLink", url);
  };

  const insertImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) exec("insertImage", url);
  };

  const toggleHtmlMode = () => {
    if (!isHtmlMode) {
      setIsHtmlMode(true);
    } else {
      // apply sanitized html back to visual editor
      if (ref.current) ref.current.innerHTML = sanitize(html);
      setIsHtmlMode(false);
    }
  };

  const updateBlockType = () => {
    // Try document.queryCommandValue
    let block = document.queryCommandValue("formatBlock") || "";
    if (typeof block === "string") block = block.replace(/\[|\]|\"/g, "");

    // If that fails, walk up from selection anchor
    if (!block && window.getSelection) {
      const sel = window.getSelection();
      const node = sel?.anchorNode as Node | null;
      let el =
        node && node.nodeType === 3
          ? node.parentElement
          : (node as HTMLElement | null);
      while (el && el !== ref.current) {
        const tag = el.tagName;
        if (/H[1-6]|P|LI/.test(tag)) {
          block = tag;
          break;
        }
        el = el.parentElement;
      }
    }

    if (!block) block = "P";
    setBlockType(block.toUpperCase());
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateBlockType);
    return () =>
      document.removeEventListener("selectionchange", updateBlockType);
  }, []);

  return (
    <div className={`rounded-xl border p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex flex-wrap gap-1 items-center">
          <button
            type="button"
            onClick={() => exec("bold")}
            title="Bold"
            className="px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => exec("italic")}
            title="Italic"
            className="px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => exec("underline")}
            title="Underline"
            className="px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <span className="underline">U</span>
          </button>

          <button
            type="button"
            onClick={() => exec("insertUnorderedList")}
            title="Bulleted list"
            className="px-2 py-1 rounded-md hover:bg-gray-100"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => exec("insertOrderedList")}
            title="Numbered list"
            className="px-2 py-1 rounded-md hover:bg-gray-100"
          >
            1.
          </button>

          <button
            type="button"
            onClick={insertLink}
            title="Insert link"
            className="px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <Link className="inline-block w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec("unlink")}
            title="Remove link"
            className="px-2 py-1 rounded-md hover:bg-gray-100"
          >
            Unlink
          </button>

          <button
            type="button"
            onClick={insertImage}
            title="Insert image by URL"
            className="px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <Upload className="inline-block w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => exec("removeFormat")}
            title="Clear format"
            className="px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <X className="inline-block w-4 h-4" />
          </button>

          {/* Heading select */}
          <select
            value={blockType}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "P") exec("formatBlock", "p");
              else exec("formatBlock", val.toLowerCase());
              updateBlockType();
            }}
            className="ml-2 border rounded px-2 py-1 bg-white"
            title="Paragraph / Headings"
          >
            <option value="P">Paragraph</option>
            <option value="H1">Heading 1</option>
            <option value="H2">Heading 2</option>
            <option value="H3">Heading 3</option>
            <option value="H4">Heading 4</option>
          </select>

          {/* Color picker for text color */}
          <input
            type="color"
            title="Text color"
            className="ml-2 w-9 h-9 p-0 border rounded"
            onChange={(e) => exec("foreColor", e.target.value)}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleHtmlMode}
            className="px-2 py-1 text-sm rounded-md bg-gray-50 hover:bg-gray-100"
          >
            {isHtmlMode ? "Visual" : "HTML"}
          </button>
        </div>
      </div>

      {/* editor area or HTML textarea */}
      {!isHtmlMode ? (
        <div
          ref={ref}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          className="min-h-[120px] outline-none"
          data-placeholder={placeholder}
          style={{ whiteSpace: "normal" }}
        />
      ) : (
        <textarea
          value={html}
          onChange={(e) => {
            const clean = sanitize(e.target.value);
            setHtml(clean);
            onChange(clean);
          }}
          className="w-full min-h-[120px] p-2 border rounded-md font-mono text-sm"
        />
      )}
    </div>
  );
}
