import React from "react";
import Card from "../components/common/Card";
import StatusDot from "../components/common/StatusDot";
import { T } from "../constants/theme";
import { servers } from "../data/servers";

export default function ServersPage() {
  return (
    <Card title="Servers · 251 hosts">
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
          }}
        >
          <thead>
            <tr style={{ color: T.muted, textAlign: "left" }}>
              {["", "Host", "IP", "OS", "CPU", "Memory"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${T.border}`,
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {servers.map((s) => (
              <tr key={s.host} style={{ color: T.text }}>
                <td style={{ padding: "10px" }}>
                  <StatusDot state={s.state} />
                </td>
                <td style={{ padding: "10px", fontFamily: T.mono }}>
                  {s.host}
                </td>
                <td style={{ padding: "10px", fontFamily: T.mono, color: T.muted }}>
                  {s.ip}
                </td>
                <td style={{ padding: "10px", color: T.muted }}>{s.os}</td>
                <td
                  style={{
                    padding: "10px",
                    fontFamily: T.mono,
                    color:
                      s.cpu > 85
                        ? T.crit
                        : s.cpu > 60
                          ? T.warn
                          : T.ok,
                  }}
                >
                  {s.cpu}%
                </td>
                <td
                  style={{
                    padding: "10px",
                    fontFamily: T.mono,
                    color:
                      s.mem > 85
                        ? T.crit
                        : s.mem > 60
                          ? T.warn
                          : T.ok,
                  }}
                >
                  {s.mem}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
