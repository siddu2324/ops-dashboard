// src/data/servers.js
export const generateServers = (count = 12) => {
  const statuses = ["up", "down", "warning", "up", "up", "warning", "up", "up", "down", "up", "up", "up"];
  const hosts = [
    "web-01", "web-02", "db-01", "cache-01", "lb-01", "app-01", "app-02",
    "redis-01", "elastic-01", "kafka-01", "zookeeper-01", "gateway-01"
  ];
  const ips = [
    "10.0.1.10", "10.0.1.11", "10.0.2.5", "10.0.3.8", "10.0.1.20",
    "10.0.1.30", "10.0.1.31", "10.0.4.12", "10.0.5.3", "10.0.6.7",
    "10.0.6.8", "10.0.1.40"
  ];
  const uptimes = ["2d 14h", "5d 3h", "12d 7h", "1d 2h", "8d 9h", "3d 0h", "6d 12h", "10d 5h", "0d 4h", "4d 8h", "7d 3h", "9d 1h"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    hostname: hosts[i % hosts.length],
    ip: ips[i % ips.length],
    status: statuses[i % statuses.length],
    cpu: Math.round(10 + Math.random() * 80),
    memory: Math.round(20 + Math.random() * 70),
    disk: Math.round(15 + Math.random() * 75),
    uptime: uptimes[i % uptimes.length],
    os: ["Ubuntu 22.04", "Debian 12", "CentOS 9", "AlmaLinux 9"][i % 4],
  }));
};

export const initialServers = generateServers(12);