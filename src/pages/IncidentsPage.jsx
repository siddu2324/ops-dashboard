import Card from "../components/common/Card";
import StatusDot from "../components/common/StatusDot";
import { incidents } from "../data/incidents";

export default function IncidentsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <Card title="Incidents">
        <div className="space-y-3">
          {incidents.map((inc) => (
            <div key={inc.id} className="flex items-center gap-4 p-2 border-b border-[var(--color-border)]">
              <StatusDot state={inc.severity} />
              <span className="flex-1 text-[var(--color-text)]">{inc.title}</span>
              <span className="text-xs text-[var(--color-muted)]">{inc.status}</span>
              <span className="text-xs text-[var(--color-faint)]">{inc.date}</span>
              <span className="text-xs text-[var(--color-faint)]">{inc.duration}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}