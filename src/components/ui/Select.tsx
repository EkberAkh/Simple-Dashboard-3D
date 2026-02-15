import React, { useState, useRef, useEffect, useCallback, useId } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  name?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder = "Select…",
  value,
  onChange,
  onBlur,
  disabled = false,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const uid = useId();
  const selectId = name || uid;

  const selectedOption = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onBlur]);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listboxRef.current) return;
    const item = listboxRef.current.children[highlightedIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, isOpen]);

  const handleSelect = useCallback(
    (optValue: string) => {
      onChange?.(optValue);
      setIsOpen(false);
      onBlur?.();
    },
    [onChange, onBlur],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            handleSelect(options[highlightedIndex].value);
          } else {
            setIsOpen(true);
            setHighlightedIndex(options.findIndex((o) => o.value === value));
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(options.findIndex((o) => o.value === value));
          } else {
            setHighlightedIndex((i) => (i < options.length - 1 ? i + 1 : 0));
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex((i) => (i > 0 ? i - 1 : options.length - 1));
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          onBlur?.();
          break;
        case "Tab":
          setIsOpen(false);
          onBlur?.();
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, options, value, handleSelect, onBlur],
  );

  const toggle = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      if (!prev) {
        setHighlightedIndex(options.findIndex((o) => o.value === value));
      }
      return !prev;
    });
  };

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label
          id={`${selectId}-label`}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <input type="hidden" name={name} value={value ?? ""} />

      <div className="relative">
        <button
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${selectId}-listbox`}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full flex items-center justify-between rounded-lg border px-3 py-2 text-sm text-left
            bg-white transition-all duration-150 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${isOpen ? "ring-2 ring-primary-500/20 border-primary-500" : ""}
            ${error ? "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500" : "border-border hover:border-slate-400"}
          `}
        >
          <span
            className={selectedOption ? "text-slate-900" : "text-slate-400"}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <ul
            ref={listboxRef}
            id={`${selectId}-listbox`}
            role="listbox"
            aria-labelledby={label ? `${selectId}-label` : undefined}
            className="absolute z-50 mt-1.5 w-full max-h-56 overflow-auto rounded-xl border border-border bg-white shadow-lg shadow-black/8 py-1 animate-dropdown-in"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2 text-sm text-slate-400 text-center">
                No options
              </li>
            ) : (
              options.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightedIndex;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`
                      flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors duration-100
                      ${isHighlighted ? "bg-primary-50 text-primary-700" : "text-slate-700"}
                      ${isSelected && !isHighlighted ? "bg-slate-50 font-medium" : ""}
                    `}
                  >
                    <span className="flex-1 truncate">{opt.label}</span>
                    {isSelected && (
                      <Check size={14} className="text-primary-600 shrink-0" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>

      {error && (
        <p
          id={`${selectId}-error`}
          className="text-xs text-danger-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

Select.displayName = "Select";
