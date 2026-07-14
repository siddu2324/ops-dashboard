// src/components/HostDrilldownModals.jsx
import { useState } from "react";
import { X, Clock, AlertCircle, ChevronRight } from "lucide-react";

// ---- Problem Detail Modal ----
export const ProblemDetailModal = ({ isOpen, onClose, problem }) => {
  if (!isOpen || !problem) return null;

  const { detail } = problem;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-[var(--color-crit)]" />
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">{detail.title}</h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs bg-[var(--color-panel-alt)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)]">
                  {detail.source}
                </span>
                <span className="text-xs text-[var(--color-muted)]">Host {detail.host}</span>
                <span className="text-xs text-[var(--color-muted)]">Service {detail.service}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-[var(--color-muted)]">As of {new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-xs font-mono text-[var(--color-faint)]">Reference ID {detail.referenceId}</span>
          </div>

          <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
            <p className="text-sm text-[var(--color-text)]">
              Live resource snapshot for {detail.host} ({detail.ip}).
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">Root Cause Analysis</h4>
              <span className="text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full border border-[var(--color-accent)]/20">
                {detail.confidence} CONFIDENCE
              </span>
            </div>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">{detail.rootCause}</p>
            <ul className="mt-3 space-y-1">
              {detail.metrics.map((metric, i) => (
                <li key={i} className="text-sm text-[var(--color-muted)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                  {metric}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider mb-2">Recommended Action</h4>
            <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-text)] leading-relaxed">{detail.recommendation}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
          <button
            onClick={() => alert('Marked as reviewed')}
            className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-text)]"
          >
            Mark reviewed
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Host Problems Modal ----
export const HostProblemsModal = ({ isOpen, onClose, hostname, problems }) => {
  const [selectedProblem, setSelectedProblem] = useState(null);

  if (!isOpen) return null;

  const severityColors = {
    Critical: "bg-[var(--color-crit)] text-white",
    High: "bg-[var(--color-crit)]/80 text-white",
    Medium: "bg-[var(--color-warn)] text-[#06222A]",
    Low: "bg-[var(--color-ok)] text-[#06222A]",
    Information: "bg-[var(--color-accent)] text-[#06222A]",
    "Not classified": "bg-[var(--color-border)] text-[var(--color-muted)]",
  };

  const handleRowClick = (problem) => {
    setSelectedProblem(problem);
  };

  const closeDetail = () => {
    setSelectedProblem(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-[var(--color-crit)]" />
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text)]">Problems for {hostname}</h3>
                <p className="text-xs text-[var(--color-muted)]">{problems.length} problems found</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              <X size={22} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
            {problems.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-muted)]">
                <p className="text-lg">No problems for {hostname}</p>
                <p className="text-sm mt-1">All systems are operating normally</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Severity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Info</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => handleRowClick(p)}
                        className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/10 transition cursor-pointer group"
                      >
                        <td className="px-4 py-3 text-[var(--color-text)] font-mono text-xs whitespace-nowrap">{p.time}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-crit)] text-white">
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[p.severity] || severityColors["Not classified"]}`}>
                            {p.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text)]">{p.info}</td>
                        <td className="px-4 py-3 text-[var(--color-faint)] font-mono text-xs flex items-center gap-1">
                          <Clock size={12} />
                          {p.duration}
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            <ChevronRight size={12} />
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
            <span className="text-xs text-[var(--color-muted)]">Displaying {problems.length} of {problems.length} found</span>
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <ProblemDetailModal
        isOpen={!!selectedProblem}
        onClose={closeDetail}
        problem={selectedProblem}
      />
    </>
  );
};