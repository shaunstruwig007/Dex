"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { proseMirrorTypography, richTextExtensions } from "./extensions";

/**
 * Renders initiative body content through the same TipTap extension set the
 * editor uses — R18 forbids raw markdown on card/list surfaces, and we don't
 * want the "editor allows X but renderer drops X" drift.
 *
 * The body is stored as HTML (see docs/adr/0001-stack-and-persistence.md).
 */
export function RichTextRenderer({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const editor = useEditor({
    extensions: richTextExtensions,
    content: html,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // TipTap keeps role="textbox" on the ProseMirror root; axe requires a
        // name for ARIA inputs even when contenteditable=false (card previews).
        "aria-label": "Initiative notes preview",
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== html) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
  }, [editor, html]);

  if (!editor) return null;
  return (
    <EditorContent
      editor={editor}
      className={cn(proseMirrorTypography, className)}
    />
  );
}
