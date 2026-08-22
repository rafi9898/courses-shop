"use client";

import { Bold, Code2, Italic, LinkIcon, List, ListOrdered, Underline } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const toolbarActions = [
  { command: "bold", label: "Pogrubienie", icon: Bold },
  { command: "italic", label: "Kursywa", icon: Italic },
  { command: "underline", label: "Podkreślenie", icon: Underline },
  { command: "insertUnorderedList", label: "Lista punktowana", icon: List },
  { command: "insertOrderedList", label: "Lista numerowana", icon: ListOrdered },
  { command: "insertCodeBlock", label: "Blok kodu", icon: Code2 }
] as const;

type ToolbarCommand = (typeof toolbarActions)[number]["command"];
type BlockFormat = "p" | "h1" | "h2" | "h3" | "h4" | "h5";

const blockFormats: Array<{ value: BlockFormat; label: string }> = [
  { value: "p", label: "Akapit" },
  { value: "h1", label: "H1" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" }
];

export function RichTextEditor({
  name,
  defaultValue,
  minHeight = "min-h-44"
}: {
  name: string;
  defaultValue: string;
  minHeight?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.innerHTML = defaultValue;
    setValue(defaultValue);
  }, [defaultValue]);

  function syncValue() {
    setValue(editorRef.current?.innerHTML ?? "");
  }

  function saveSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

    selectionRef.current = range.cloneRange();
  }

  function restoreSelection() {
    if (!selectionRef.current) return;

    const selection = window.getSelection();
    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  }

  function runCommand(command: ToolbarCommand) {
    restoreSelection();
    editorRef.current?.focus();

    if (command === "insertCodeBlock") {
      insertCodeBlock();
    } else {
      document.execCommand(command, false);
    }

    syncValue();
    saveSelection();
  }

  function addLink() {
    saveSelection();
    const href = window.prompt("Wklej URL linku");
    if (!href) return;

    restoreSelection();
    editorRef.current?.focus();
    wrapSelection("a", href);
    syncValue();
    saveSelection();
  }

  function handleToolbarMouseDown(event: React.MouseEvent<HTMLButtonElement>, command: ToolbarCommand) {
    event.preventDefault();
    runCommand(command);
  }

  function handleLinkMouseDown(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    addLink();
  }

  function handleBlockFormatChange(event: React.ChangeEvent<HTMLSelectElement>) {
    restoreSelection();
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, event.target.value);
    syncValue();
    saveSelection();
    event.currentTarget.value = "p";
  }

  function getEditorRange() {
    restoreSelection();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) return null;

    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return null;

    return range;
  }

  function wrapSelection(tagName: "strong" | "em" | "u" | "a", href?: string) {
    const range = getEditorRange();
    if (!range) return;

    const wrapper = document.createElement(tagName);

    if (tagName === "a" && href) {
      wrapper.setAttribute("href", href);
      wrapper.setAttribute("target", "_blank");
      wrapper.setAttribute("rel", "noreferrer");
    }

    if (range.collapsed) {
      wrapper.textContent = tagName === "a" ? "link" : "tekst";
      range.insertNode(wrapper);
    } else {
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }

    selectNodeContents(wrapper);
  }

  function insertCodeBlock() {
    const range = getEditorRange();
    if (!range) return;

    const selectedText = range.toString();
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = selectedText || "const example = \"Wklej tutaj kod\";";
    pre.appendChild(code);
    range.deleteContents();
    range.insertNode(pre);
    selectNodeContents(code);
  }

  function selectNodeContents(node: Node) {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    selectionRef.current = range.cloneRange();
  }

  function insertPastedHtml(html: string) {
    const range = getEditorRange();
    if (!range) return;

    const template = document.createElement("template");
    template.innerHTML = html;
    const fragment = document.createDocumentFragment();

    Array.from(template.content.childNodes).forEach((node) => {
      fragment.appendChild(normalizePastedNode(node));
    });

    range.deleteContents();
    range.insertNode(fragment);
  }

  function normalizePastedNode(node: Node): Node {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent ?? "");
    }

    if (!(node instanceof HTMLElement)) {
      return document.createTextNode(node.textContent ?? "");
    }

    const tagName = node.tagName.toLowerCase();
    const normalizedTag = getNormalizedTagName(node);
    const element = document.createElement(normalizedTag);

    if (normalizedTag === "a") {
      const href = node.getAttribute("href") ?? "";
      if (href && !href.trim().toLowerCase().startsWith("javascript:")) {
        element.setAttribute("href", href);
        element.setAttribute("target", "_blank");
        element.setAttribute("rel", "noreferrer");
      }
    }

    if (tagName === "br") return document.createElement("br");
    if (tagName === "hr") return document.createElement("hr");

    Array.from(node.childNodes).forEach((child) => {
      element.appendChild(normalizePastedNode(child));
    });

    return wrapStyledElement(node, element);
  }

  function getNormalizedTagName(node: HTMLElement) {
    const tagName = node.tagName.toLowerCase();
    if (["p", "strong", "b", "em", "i", "u", "ul", "ol", "li", "a", "blockquote", "h1", "h2", "h3", "h4", "h5", "pre", "code"].includes(tagName)) return tagName;
    if (tagName === "div" || tagName === "section" || tagName === "article") return "p";
    return "span";
  }

  function wrapStyledElement(source: HTMLElement, node: Node) {
    let current = node;
    const fontWeight = source.style.fontWeight;
    const isBold = source.style.fontWeight === "bold" || (Number.isFinite(Number(fontWeight)) && Number(fontWeight) >= 600);
    const isItalic = source.style.fontStyle === "italic";
    const isUnderline = source.style.textDecoration.includes("underline");

    if (isUnderline) current = wrapNode("u", current);
    if (isItalic) current = wrapNode("em", current);
    if (isBold) current = wrapNode("strong", current);

    return current;
  }

  function wrapNode(tagName: "strong" | "em" | "u", node: Node) {
    const element = document.createElement(tagName);
    element.appendChild(node);
    return element;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap gap-1 border-b border-border bg-slate-50 p-2">
        <select
          defaultValue="p"
          onMouseDown={saveSelection}
          onChange={handleBlockFormatChange}
          className="focus-ring h-9 rounded-md border border-border bg-white px-2 text-xs font-black text-slate-700 outline-none"
          aria-label="Nagłówek"
          title="Nagłówek"
        >
          {blockFormats.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
        {toolbarActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.command}
              type="button"
              onMouseDown={(event) => handleToolbarMouseDown(event, action.command)}
              className="focus-ring grid h-9 w-9 place-items-center rounded-md border border-transparent text-slate-600 transition hover:border-primary/30 hover:bg-white hover:text-primary"
              title={action.label}
              aria-label={action.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
        <button
          type="button"
          onMouseDown={handleLinkMouseDown}
          className="focus-ring grid h-9 w-9 place-items-center rounded-md border border-transparent text-slate-600 transition hover:border-primary/30 hover:bg-white hover:text-primary"
          title="Link"
          aria-label="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncValue}
        onBlur={() => {
          saveSelection();
          syncValue();
        }}
        onFocus={saveSelection}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onPaste={(event) => {
          const html = event.clipboardData.getData("text/html");
          if (!html) return;

          event.preventDefault();
          insertPastedHtml(html);
          syncValue();
          saveSelection();
        }}
        className={cn(
          "focus-ring prose-reset w-full px-3 py-3 text-sm font-semibold leading-7 outline-none",
          minHeight
        )}
      />
    </div>
  );
}
