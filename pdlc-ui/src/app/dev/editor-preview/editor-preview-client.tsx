"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

const content =
  "<h2>Read-only preview</h2><p>This validates <strong>TipTap</strong> in the build. The rich-text <em>body</em> field is <strong>Sprint 1</strong>; the brief wizard is <strong>Sprint 3</strong>.</p><ul><li>Item one</li><li>Item two</li></ul>";

export function EditorPreview() {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
    content,
    editable: false,
    immediatelyRender: false,
  });

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <p className="mb-4 text-muted-foreground text-sm">
        Dev-only route — not linked from the shell.
      </p>
      <div className="max-w-3xl rounded-lg border border-border bg-card p-6 shadow-sm">
        <EditorContent
          editor={editor}
          className="[&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:outline-none"
        />
      </div>
    </div>
  );
}
