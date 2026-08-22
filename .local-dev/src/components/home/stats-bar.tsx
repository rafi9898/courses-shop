import { GraduationCap, Star, Globe } from "lucide-react";
import { type Dictionary } from "@/lib/i18n/dictionaries";

function renderStatParts(text: string) {
  // Regex to split on formatted numbers (e.g. "70 000+", "70,000+", "70.000+", "70", "3") without grabbing trailing spaces
  const parts = text.split(/(\d+(?:[\s,.]\d+)*\+?)/);
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, idx) => {
      if (/\d/.test(part)) {
        return (
          <span key={idx} className="font-bold text-slate-800 tracking-tight shrink-0">
            {part}
          </span>
        );
      }
      return (
        <span key={idx} className="text-slate-600 font-medium tracking-tight shrink-0">
          {part}
        </span>
      );
    });
}

export function StatsBar({ dictionary }: { dictionary: Dictionary }) {
  return (
    <div className="w-full border-b border-[#6366f1]/[0.12] bg-gradient-to-r from-[#FAF8FF] via-[#FDFBFF] to-[#FAF8FF] py-3.5 sm:py-4 animate-fade-in shadow-[0_1px_8px_-2px_rgba(99,102,241,0.06)] relative">
      <div className="container-shell flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 text-xs sm:text-sm sm:gap-x-16 md:gap-x-24">
        <div className="flex items-center gap-1.5 group select-none">
          <Star 
            className="h-4 w-4 text-primary opacity-75 group-hover:opacity-100 transition-opacity duration-200 shrink-0" 
            strokeWidth={2}
            aria-hidden="true" 
          />
          {renderStatParts(dictionary.statsBar.students)}
        </div>
        <div className="flex items-center gap-1.5 group select-none">
          <GraduationCap 
            className="h-4 w-4 text-primary opacity-75 group-hover:opacity-100 transition-opacity duration-200 shrink-0" 
            strokeWidth={2}
            aria-hidden="true" 
          />
          {renderStatParts(dictionary.statsBar.courses)}
        </div>
        <div className="flex items-center gap-1.5 group select-none">
          <Globe 
            className="h-4 w-4 text-primary opacity-75 group-hover:opacity-100 transition-opacity duration-200 shrink-0" 
            strokeWidth={2}
            aria-hidden="true" 
          />
          {renderStatParts(dictionary.statsBar.languages)}
        </div>
      </div>
    </div>
  );
}
