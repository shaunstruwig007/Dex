/**
 * Strip inline styles, fonts, colours, classes and Office/Google-Docs markup
 * from pasted HTML before TipTap/ProseMirror parses it. This keeps the body
 * conformant to the R18 minimum toolbar (tech-stack.md § 3.4) — no fonts,
 * no colours, no rogue classes.
 */
export function sanitisePastedHtml(html: string): string {
  if (typeof window === "undefined" || !html) return html;
  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(html, "text/html");
  } catch {
    return html;
  }

  const forbiddenTags = new Set([
    "SCRIPT",
    "STYLE",
    "LINK",
    "META",
    "O:P",
    "FONT",
  ]);
  const forbiddenAttrs = ["style", "class", "face", "color", "bgcolor"];

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  const toRemove: Element[] = [];
  let node = walker.nextNode();
  while (node) {
    const el = node as Element;
    if (forbiddenTags.has(el.tagName)) {
      toRemove.push(el);
    } else {
      for (const attr of forbiddenAttrs) {
        if (el.hasAttribute(attr)) el.removeAttribute(attr);
      }
      // Google Docs wraps paragraphs in <b style="font-weight:normal"> — unwrap.
      if (
        el.tagName === "B" &&
        el.getAttribute("id")?.startsWith("docs-internal-guid")
      ) {
        el.replaceWith(...Array.from(el.childNodes));
      }
    }
    node = walker.nextNode();
  }
  for (const el of toRemove) el.remove();
  return doc.body.innerHTML;
}
