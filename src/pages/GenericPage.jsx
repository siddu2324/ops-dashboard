import React from "react";
import { Layers } from "lucide-react";
import Card from "../components/common/Card";
import { T } from "../constants/theme";

export default function GenericPage({ name, section }) {
  const blurb = {
    Monitoring: "Metrics, logs, and traces in one place.",
    Infrastructure: "Everything running under your control.",
    Observability: "Your telemetry backends, connected.",
    Operations: "Detect, respond, and learn.",
    AI: "Machine-assisted operations.",
    Reports: "Numbers your stakeholders read.",
    Administration: "Access, teams, and integrations.",
  };
  return (
    <Card>
      <div style={{ padding: "28px 8px 20px", textAlign: "center" }}>
        <Layers size={28} color={T.faint} style={{ margin: "0 auto" }} />
        <h2
          style={{
            color: T.text,
            fontSize: 20,
            fontWeight: 600,
            margin: "12px 0 4px",
          }}
        >
          {name}
        </h2>
        <p style={{ color: T.muted, fontSize: 14, margin: "0 0 16px" }}>
          {blurb[section] || "This page is ready to build."} No{" "}
          {name.toLowerCase()} configured yet.
        </p>
        <button
          style={{
            background: T.accent,
            color: "#06222A",
            border: "none",
            borderRadius: 8,
            padding: "9px 18px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Set up {name}
        </button>
      </div>
    </Card>
  );
}
