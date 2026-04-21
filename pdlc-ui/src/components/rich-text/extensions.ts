import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

/**
 * Shared TipTap extension set used by both the editable editor and the
 * read-only renderer. Keeping a single list avoids "editor allows X but the
 * renderer drops it" drift.
 *
 * Matches the R18 minimum toolbar (tech-stack.md § 3.4):
 * Bold, Italic, Underline, H2/H3, bulleted + numbered lists, link, inline code,
 * clear formatting.
 */
export const richTextExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    horizontalRule: false,
    blockquote: false,
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
    HTMLAttributes: {
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
];

/**
 * WYSIWYG typography for the ProseMirror contenteditable node.
 *
 * Applied to BOTH the editor and the read-only renderer so what the user sees
 * while typing matches what the card renders after save. Tailwind's Preflight
 * strips default heading/list styles, so without these rules `<h2>` inside the
 * editor would look identical to `<p>` — structure is right, visuals aren't.
 *
 * Kept as a single constant (not duplicated) so the two surfaces never drift
 * (same invariant as `richTextExtensions` above).
 */
export const proseMirrorTypography = [
  "[&_.ProseMirror]:outline-none",
  "[&_.ProseMirror_p]:my-2",
  "[&_.ProseMirror_h2]:mt-4 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold",
  "[&_.ProseMirror_h3]:mt-3 [&_.ProseMirror_h3]:mb-1.5 [&_.ProseMirror_h3]:font-semibold",
  "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6",
  "[&_.ProseMirror_li]:my-1",
  "[&_.ProseMirror_strong]:font-semibold [&_.ProseMirror_em]:italic",
  "[&_.ProseMirror_u]:underline",
  "[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline",
  "[&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-sm",
].join(" ");
