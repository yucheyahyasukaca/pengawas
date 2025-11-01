"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Button } from "./button";

type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
};

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Tulis konten di sini...",
  className,
  minHeight = "200px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return placeholder;
          }
          return placeholder;
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[200px] focus:outline-none",
          "[&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:my-2",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:my-4",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:my-3",
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:my-2",
          "[&_strong]:font-semibold [&_strong]:text-slate-900",
          "[&_em]:italic",
          "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 [&_ul]:text-slate-700",
          "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2 [&_ol]:text-slate-700",
          "[&_li]:my-1",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-rose-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-3",
          "[&_code]:text-rose-600 [&_code]:bg-rose-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm",
          "[&_.is-empty::before]:content-[attr(data-placeholder)] [&_.is-empty::before]:text-slate-400 [&_.is-empty::before]:float-left [&_.is-empty::before]:pointer-events-none [&_.is-empty::before]:h-0",
          className,
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/50 p-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 rounded-lg p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition",
            editor.isActive("bold") && "bg-rose-100 text-rose-700 hover:bg-rose-200",
          )}
          title="Bold"
        >
          <Bold className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 rounded-lg p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition",
            editor.isActive("italic") && "bg-rose-100 text-rose-700 hover:bg-rose-200",
          )}
          title="Italic"
        >
          <Italic className="size-4" />
        </Button>

        <div className="h-6 w-px bg-slate-300" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "h-8 w-8 rounded-lg p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition",
            editor.isActive("heading", { level: 1 }) && "bg-rose-100 text-rose-700 hover:bg-rose-200",
          )}
          title="Heading 1"
        >
          <Heading1 className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-8 w-8 rounded-lg p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition",
            editor.isActive("heading", { level: 2 }) && "bg-rose-100 text-rose-700 hover:bg-rose-200",
          )}
          title="Heading 2"
        >
          <Heading2 className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "h-8 w-8 rounded-lg p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition",
            editor.isActive("heading", { level: 3 }) && "bg-rose-100 text-rose-700 hover:bg-rose-200",
          )}
          title="Heading 3"
        >
          <Heading3 className="size-4" />
        </Button>

        <div className="h-6 w-px bg-slate-300" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 rounded-lg p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition",
            editor.isActive("bulletList") && "bg-rose-100 text-rose-700 hover:bg-rose-200",
          )}
          title="Bullet List"
        >
          <List className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 rounded-lg p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition",
            editor.isActive("orderedList") && "bg-rose-100 text-rose-700 hover:bg-rose-200",
          )}
          title="Numbered List"
        >
          <ListOrdered className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "h-8 w-8 rounded-lg p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition",
            editor.isActive("blockquote") && "bg-rose-100 text-rose-700 hover:bg-rose-200",
          )}
          title="Quote"
        >
          <Quote className="size-4" />
        </Button>

        <div className="h-6 w-px bg-slate-300" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="h-8 w-8 rounded-lg p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition disabled:text-slate-400 disabled:hover:bg-transparent"
          title="Undo"
        >
          <Undo className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="h-8 w-8 rounded-lg p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition disabled:text-slate-400 disabled:hover:bg-transparent"
          title="Redo"
        >
          <Redo className="size-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div
        className="overflow-y-auto p-4"
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

