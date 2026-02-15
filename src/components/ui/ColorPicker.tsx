import React, { useState, useCallback, useRef, useEffect } from "react";

interface ColorPalette {
  name: string;
  colors: string[];
}

const COLOR_PALETTES: ColorPalette[] = [
  {
    name: "Corporate",
    colors: ["#1E293B", "#334155", "#475569", "#64748B", "#94A3B8", "#CBD5E1"],
  },
  {
    name: "Indigo",
    colors: ["#312E81", "#3730A3", "#4338CA", "#4F46E5", "#6366F1", "#818CF8"],
  },
  {
    name: "Ocean",
    colors: ["#164E63", "#155E75", "#0E7490", "#0891B2", "#06B6D4", "#22D3EE"],
  },
  {
    name: "Emerald",
    colors: ["#064E3B", "#065F46", "#047857", "#059669", "#10B981", "#34D399"],
  },
  {
    name: "Sunset",
    colors: ["#7C2D12", "#9A3412", "#C2410C", "#EA580C", "#F97316", "#FB923C"],
  },
  {
    name: "Rose",
    colors: ["#881337", "#9F1239", "#BE123C", "#E11D48", "#F43F5E", "#FB7185"],
  },
  {
    name: "Violet",
    colors: ["#4C1D95", "#5B21B6", "#6D28D9", "#7C3AED", "#8B5CF6", "#A78BFA"],
  },
  {
    name: "Amber",
    colors: ["#78350F", "#92400E", "#B45309", "#D97706", "#F59E0B", "#FBBF24"],
  },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function clampChannel(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  compact?: boolean;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  compact = false,
  className = "",
}) => {
  const [hexInput, setHexInput] = useState(value);
  const [rgbValues, setRgbValues] = useState(() => hexToRgb(value));
  const [activePalette, setActivePalette] = useState(0);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (!isInternalUpdate.current) {
      setHexInput(value);
      setRgbValues(hexToRgb(value));
    }
    isInternalUpdate.current = false;
  }, [value]);

  const updateColor = useCallback(
    (hex: string) => {
      isInternalUpdate.current = true;
      setHexInput(hex);
      setRgbValues(hexToRgb(hex));
      onChange(hex);
    },
    [onChange],
  );

  const handleHexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setHexInput(raw);
      if (/^#[0-9A-Fa-f]{6}$/.test(raw)) {
        isInternalUpdate.current = true;
        setRgbValues(hexToRgb(raw));
        onChange(raw);
      }
    },
    [onChange],
  );

  const handleRgbChange = useCallback(
    (channel: "r" | "g" | "b", val: string) => {
      const num = clampChannel(parseInt(val) || 0);
      const next = { ...rgbValues, [channel]: num };
      setRgbValues(next);
      const hex = rgbToHex(next.r, next.g, next.b);
      isInternalUpdate.current = true;
      setHexInput(hex);
      onChange(hex);
    },
    [rgbValues, onChange],
  );

  const palette = COLOR_PALETTES[activePalette];
  const swatchSize = compact ? "w-5 h-5" : "w-7 h-7";
  const swatchGap = compact ? "gap-1" : "gap-1.5";

  return (
    <div className={`flex flex-col gap-2 sm:gap-2.5 ${className}`}>
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
        {COLOR_PALETTES.map((p, i) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setActivePalette(i)}
            className={`
              shrink-0 px-2 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer
              ${
                i === activePalette
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              }
            `}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className={`flex flex-wrap ${swatchGap}`}>
        {palette.colors.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => updateColor(c)}
            className={`${swatchSize} rounded-lg border-2 transition-all cursor-pointer ${
              value.toLowerCase() === c.toLowerCase()
                ? "border-primary-500 scale-110 shadow-sm"
                : "border-transparent hover:border-slate-300"
            }`}
            style={{ backgroundColor: c }}
            aria-label={`Select color ${c}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => updateColor(e.target.value)}
          className={`${compact ? "w-7 h-7" : "w-9 h-9"} rounded border-0 cursor-pointer bg-transparent`}
          aria-label="Custom color picker"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1 bg-slate-50 rounded-md border border-border px-2 py-1">
            <span className="text-[10px] text-slate-400 font-medium">HEX</span>
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              maxLength={7}
              className="w-full bg-transparent text-xs font-mono text-slate-700 outline-none uppercase"
              aria-label="Hex color value"
            />
          </div>
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-3 gap-1.5">
          {(["r", "g", "b"] as const).map((ch) => (
            <div key={ch} className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-medium mb-0.5 text-center">
                {ch}
              </span>
              <input
                type="number"
                min={0}
                max={255}
                value={rgbValues[ch]}
                onChange={(e) => handleRgbChange(ch, e.target.value)}
                className="w-full text-center text-xs font-mono text-slate-700 bg-slate-50 rounded border border-border px-1 py-1 outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400"
                aria-label={`${ch.toUpperCase()} channel`}
              />
            </div>
          ))}
        </div>
      )}

      {!compact && (
        <div className="flex items-center gap-2">
          <div
            className={`${compact ? "w-6 h-6" : "w-8 h-8"} rounded-lg border border-border shadow-inner`}
            style={{ backgroundColor: value }}
          />
          <span className="text-[10px] text-slate-400">Preview</span>
        </div>
      )}
    </div>
  );
};
