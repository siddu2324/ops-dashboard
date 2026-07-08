export const alerts = [
  {
    sev: "crit",
    name: "High memory on prod-db-02",
    src: "Prometheus",
    age: "4m",
  },
  {
    sev: "warn",
    name: "Pod restarts: payments-api",
    src: "Kubernetes",
    age: "18m",
  },
  {
    sev: "warn",
    name: "Disk 85% on log-store-1",
    src: "Zabbix",
    age: "42m",
  },
  {
    sev: "ok",
    name: "Latency recovered: checkout",
    src: "Tempo",
    age: "1h",
  },
];  