"use client";

import { Bold, Italic, LinkIcon, List, ListOrdered, Underline } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const toolbarActions = [
  { command: "bold", label: "Pogrubienie", icon: Bold },
  { command: "italic", label: "Kursywa", icon: Italic },
  { command: "underline", label: "Podkreślenie", icon: Underline },
  { command: "insertUnorderedList", label: "Lista punktowana", icon: List },
  { command: "insertOrderedList", label: "Lista numerowana", icon: ListOrdered }
] as const;

type ToolbarCommand = (typeof toolbarActions)[number]["command"];

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

    if (command === "bold") {
      wrapSelection("strong");
    } else if (command === "italic") {
      wrapSelection("em");
    } else if (command === "underline") {
      wrapSelection("u");
    } else if (command === "insertUnorderedList") {
      insertList("ul");
    } else if (command === "insertOrderedList") {
      insertList("ol");
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

  function insertList(listType: "ul" | "ol") {
    const range = getEditorRange();
    if (!range) return;

    const selectedText = range.toString().trim();
    const list = document.createElement(listType);
    const items = selectedText ? selectedText.split(/\n+/).map((item) => item.trim()).filter(Boolean) : ["Nowy punkt"];

    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      list.appendChild(listItem);
    });

    range.deleteContents();
    range.insertNode(list);
    selectNodeContents(list);
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

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap gap-1 border-b border-border bg-slate-50 p-2">
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
        className={cn(
          "focus-ring prose-reset w-full px-3 py-3 text-sm font-semibold leading-7 outline-none",
          minHeight
        )}
      />
    </div>
  );
}
