import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated collapsible component that matches dashboard layout NavLink design.
 * @param {string} label - The label for the collapsible trigger.
 * @param {React.ReactNode} icon - Icon component to display (should be same as NavLink icons).
 * @param {React.ReactNode} children - The content to show/hide.
 * @param {string} className - Additional class names for the root.
 */
export default function Collapsible({ label, icon, children, className = "" }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        className={cn(
          open
            ? "bg-indigo-50 text-indigo-600"
            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
          "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold w-full items-center justify-between transition-colors"
        )}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-x-3 flex-1 text-left">
          {icon && icon}
          {label}
        </span>
        <svg
          className={`size-5 text-gray-400 group-hover:text-indigo-600 transform transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: open ? contentRef.current?.scrollHeight : 0,
        }}
        className={`overflow-hidden transition-all duration-300 ${open ? "mt-1" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
