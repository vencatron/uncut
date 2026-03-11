import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window as unknown as Window & typeof globalThis);

// Configure: allow basic formatting, lists, links — block scripts, iframes, forms
purify.setConfig({
  ALLOWED_TAGS: [
    "p", "br", "b", "strong", "i", "em", "u", "s", "strike",
    "ul", "ol", "li",
    "h1", "h2", "h3", "h4",
    "a", "img",
    "table", "thead", "tbody", "tr", "th", "td",
    "div", "span",
    "blockquote", "hr",
  ],
  ALLOWED_ATTR: [
    "href", "target", "rel",
    "src", "alt", "width", "height",
    "class", "style",
  ],
  ALLOW_DATA_ATTR: false,
  FORCE_BODY: true,
});

// Force safe link attributes
purify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

export function sanitizeHtml(dirty: string): string {
  return purify.sanitize(dirty);
}
