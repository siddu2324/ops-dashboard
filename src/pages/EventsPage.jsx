import { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import { initialEvents, generateNewEvent } from "../data/events";

const severityColors = {
  Critical: "bg-[var(--color-crit)] text-white",
  High: "bg-[var(--color-crit)] text-white",
  Medium: "bg-[var(--color-warn)] text-[#06222A]",
  Low: "bg-[var(--color-ok)] text-[#06222A]",
};

export default function EventsPage() {
  const [events, setEvents] = useState(initialEvents);
  const [filtered, setFiltered] = useState(events);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = generateNewEvent();
      setEvents((prev) => {
        const existingIdx = prev.findIndex(e => e.name === newEvent.name);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            count: updated[existingIdx].count + Math.floor(Math.random() * 100),
            lastTriggered: newEvent.lastTriggered,
          };
          return updated;
        }
        return [newEvent, ...prev].slice(0, 50);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(events);
      return;
    }
    const term = search.toLowerCase();
    const result = events.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        e.type.toLowerCase().includes(term)
    );
    setFiltered(result);
  }, [search, events]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const newEvent = generateNewEvent();
    setEvents((prev) => [newEvent, ...prev].slice(0, 50));
    setTimeout(() => setIsRefreshing(false), 400);
    toast.success("Events refreshed");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <Card 
        title="Events" 
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 pl-9 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-xs"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
                <th className="py-2 px-3 font-medium">Event</th>
                <th className="py-2 px-3 font-medium">Type</th>
                <th className="py-2 px-3 font-medium">Severity</th>
                <th className="py-2 px-3 font-medium text-right">Count</th>
                <th className="py-2 px-3 font-medium">Last Triggered</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-[var(--color-muted)]">
                    No events match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((event) => (
                  <tr key={event.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-panel-alt)] transition-colors">
                    <td className="py-2 px-3 text-[var(--color-text)] font-mono text-xs">
                      {event.name}
                    </td>
                    <td className="py-2 px-3 text-[var(--color-muted)] text-xs">
                      {event.type}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[event.severity] || severityColors.Medium}`}>
                        {event.severity}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-[var(--color-text)] font-mono text-sm">
                      {event.count.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-[var(--color-faint)] text-xs">
                      {new Date(event.lastTriggered).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}