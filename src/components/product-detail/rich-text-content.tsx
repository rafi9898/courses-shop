"use client";

import { useEffect, useRef } from "react";
import { Check, Copy } from "lucide-react";
import { createRoot } from "react-dom/client";
import { useState } from "react";

export function RichTextContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const preElements = containerRef.current.querySelectorAll("pre");

    preElements.forEach((pre) => {
      // Avoid double enhancement
      if (pre.dataset.enhanced === "true") return;
      pre.dataset.enhanced = "true";

      const code = pre.querySelector("code");
      const text = code ? code.innerText : pre.innerText;

      // Wrap pre content in a div for relative positioning
      const wrapper = document.createElement("div");
      wrapper.className = "relative group code-block-wrapper";
      
      // Move pre into wrapper, and wrapper into pre's old place
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // Create Copy Button Container
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity";
      wrapper.appendChild(buttonContainer);

      const root = createRoot(buttonContainer);
      root.render(<CopyButton text={text} />);

      // Add line numbers if there's code
      if (code) {
        enhanceWithLineNumbers(pre, code);
      }
    });
  }, [html]);

  if (!html) return null;

  return (
    <div
      ref={containerRef}
      className="rich-text-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function enhanceWithLineNumbers(pre: HTMLPreElement, code: HTMLElement) {
  const lines = code.innerText.split("\n");
  // Remove last empty line if it exists
  if (lines[lines.length - 1] === "") lines.pop();

  const lineNumbersWrapper = document.createElement("span");
  lineNumbersWrapper.className = "absolute left-0 top-0 bottom-0 flex flex-col items-end pr-4 text-slate-500 select-none text-right border-r border-slate-700/50 bg-slate-900/50";
  lineNumbersWrapper.style.width = "3.5rem";
  lineNumbersWrapper.style.paddingTop = "1rem"; // Match pre padding
  lineNumbersWrapper.style.paddingBottom = "1rem";

  lines.forEach((_, i) => {
    const lineNum = document.createElement("span");
    lineNum.innerText = String(i + 1);
    lineNum.className = "px-2 leading-[1.7]"; // Match pre line-height
    lineNumbersWrapper.appendChild(lineNum);
  });

  pre.style.paddingLeft = "4.5rem"; // Offset for line numbers
  pre.style.position = "relative";
  pre.appendChild(lineNumbersWrapper);
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      title="Copy code"
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
