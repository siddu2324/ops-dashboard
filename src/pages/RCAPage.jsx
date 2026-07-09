import Card from "../components/common/Card";
import { rcas } from "../data/rca";

export default function RCAPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <Card title="Root Cause Analysis">
        <div className="space-y-3">
          {rcas.map((r, idx) => (
            <div key={idx} className="p-3 border border-[var(--color-border)] rounded-lg">
              <div className="text-[var(--color-text)] font-medium">Incident #{r.incidentId}</div>
              <div className="text-[var(--color-muted)] text-sm">Root cause: {r.rootCause}</div>
              <div className="text-[var(--color-text)] text-sm mt-1">Action: {r.action}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}