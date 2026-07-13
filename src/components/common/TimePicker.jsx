import { useState } from "react";
import { ChevronDown, Clock, Settings } from "lucide-react";

export default function TimePicker({ onTimeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [from, setFrom] = useState("2026-07-13 19:31:41");
  const [to, setTo] = useState("2026-07-13 20:31:41");
  const [timezone, setTimezone] = useState("Browser Time");

  const quickRanges = [
    "Last 5 minutes",
    "Last 15 minutes",
    "Last 30 minutes",
    "Last 1 hour",
    "Last 3 hours",
    "Last 6 hours",
    "Last 12 hours",
    "Last 24 hours",
    "Last 2 days",
  ];

  const timezones = ["Browser Time", "IST", "UTC+05:30"];

  const handleApply = () => {
    if (onTimeChange) {
      onTimeChange({ from, to });
    }
    setIsOpen(false);
  };

  const handleQuickRange = (range) => {
    if (onTimeChange) {
      onTimeChange({ range });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] hover:bg-[var(--color-panel-alt)] transition text-sm"
      >
        <Clock size={14} />
        <span>Absolute time range</span>
        <ChevronDown size={12} className={isOpen ? "rotate-180" : ""} />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 w-[480px] bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl shadow-2xl p-4 space-y-3">
            {/* Absolute time range */}
            <div>
              <div className="text-sm font-medium text-[var(--color-text)] mb-2">Absolute time range</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[var(--color-muted)] block mb-1">From</label>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--color-muted)] block mb-1">To</label>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={handleApply}
                className="mt-2 px-4 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition text-sm"
              >
                Apply time range
              </button>
            </div>

            {/* Recently used placeholder */}
            <div className="text-xs text-[var(--color-muted)] border-t border-[var(--color-border)] pt-2">
              It looks like you haven't used this time picker before. As soon as you enter some time intervals, recently used intervals will appear here.
              <button className="text-[var(--color-accent)] hover:underline ml-1">Read the documentation</button>
            </div>

            {/* Quick ranges */}
            <div>
              <div className="text-sm font-medium text-[var(--color-text)] mb-2">Search quick ranges</div>
              <div className="flex flex-wrap gap-1">
                {quickRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => handleQuickRange(range)}
                    className="px-2 py-1 text-xs rounded-full border border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition text-[var(--color-text)]"
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Timezone buttons */}
            <div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-2">
              {timezones.map((tz) => (
                <button
                  key={tz}
                  onClick={() => setTimezone(tz)}
                  className={`px-2 py-1 text-xs rounded transition ${
                    timezone === tz
                      ? "bg-[var(--color-accent)] text-[#06222A]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {tz}
                </button>
              ))}
              <button className="flex items-center gap-1 ml-auto text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition">
                <Settings size={12} />
                Change time settings
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}