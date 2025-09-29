/*"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

interface Props {
  value?: string; // initial HTML
  onChange: (html: string, json?: any) => void;
  placeholder?: string;
  className?: string;
}

export default function TiptapEditor({
  value = "",
  onChange,
  placeholder = "Enter description...",
  className = "",
}: Props) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  const editor = useEditor({
    editable: true,
    extensions: [
      StarterKit.configure({
        heading: false, // we'll use Heading extension instead
      }),
      Heading.configure({ levels: [1, 2, 3, 4] }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image,
      TextStyle,
      Color,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      onChange(html, json);
    },
  });

  useEffect(() => {
    // sync incoming value -> editor
    if (!editor) return;
    if (value && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const setHeading = (level: number | "paragraph") => {
    if (level === "paragraph") editor.commands.setParagraph();
    else editor.commands.toggleHeading({ level });
  };

  const insertLink = async () => {
    const url = window.prompt("Enter URL", "https://");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertImageByUrl = async () => {
    const url = window.prompt("Enter image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const pickColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className={`rounded-xl border p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          U
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bulleted list"
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          1.
        </button>

        <button
          type="button"
          onClick={insertLink}
          title="Insert link"
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          title="Remove link"
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          Unlink
        </button>

        <button
          type="button"
          onClick={insertImageByUrl}
          title="Insert image"
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          Image
        </button>

        <select
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
              ? "h3"
              : editor.isActive("heading", { level: 4 })
              ? "h4"
              : "p"
          }
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") setHeading("paragraph");
            else setHeading(Number(v.replace("h", "")));
          }}
          className="border rounded px-2 py-1 bg-white"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>

        <input
          type="color"
          onChange={(e) => pickColor(e.target.value)}
          className="ml-2 w-8 h-8 p-0 border rounded"
        />

        <button
          type="button"
          onClick={() => setIsHtmlMode((s) => !s)}
          className="ml-auto px-2 py-1 rounded bg-gray-50 hover:bg-gray-100"
        >
          {isHtmlMode ? "Visual" : "HTML"}
        </button>
      </div>

      {!isHtmlMode ? (
        <EditorContent editor={editor} className="min-h-[140px] outline-none" />
      ) : (
        <textarea
          value={editor.getHTML()}
          onChange={(e) => {
            editor.commands.setContent(e.target.value);
            onChange(editor.getHTML(), editor.getJSON());
          }}
          className="w-full min-h-[140px] p-2 border rounded font-mono text-sm"
        />
      )}
    </div>
  );
}
*/
