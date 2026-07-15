// src/data/servers.js

// ----- Master list of all servers with IPs and hostnames -----
export const serverInventory = [
  { id: 1, hostname: "VITSRVPDC01", ip: "192.168.4.53", os: "Windows Server 2022", location: "DC1" },
  { id: 2, hostname: "VITBLRSRVAAC01", ip: "192.168.4.69", os: "Windows Server 2022", location: "BLR" },
  { id: 3, hostname: "VITBLRSRVD01", ip: "192.168.2.28", os: "Windows Server 2022", location: "BLR" },
  { id: 4, hostname: "vitblrsrvbkp01", ip: "192.168.4.97", os: "Windows Server 2022", location: "BLR" },
  { id: 5, hostname: "VITBLRSRVAAC02", ip: "192.168.4.70", os: "Windows Server 2022", location: "BLR" },
  { id: 6, hostname: "VITBLRSRVW01", ip: "192.168.4.83", os: "Windows Server 2022", location: "BLR" },
  { id: 7, hostname: "VITSRVADC02", ip: "192.168.4.54", os: "Windows Server 2022", location: "DC2" },
  { id: 8, hostname: "VITBLRSRVPW01", ip: "192.168.6.90", os: "Windows Server 2022", location: "BLR" },
  { id: 9, hostname: "ASPL_VITBLRSRVT51", ip: "192.168.6.68", os: "Windows Server 2022", location: "BLR" },
  { id: 10, hostname: "VITSRVPRTG01", ip: "192.168.4.60", os: "Windows Server 2022", location: "DC1" },
  { id: 11, hostname: "ASPL_HO_Demo_Proxy_192.168.4.190", ip: "192.168.4.190", os: "Windows Server 2022", location: "HO" },
  { id: 12, hostname: "VITBLRUATMSSQL", ip: "192.168.2.165", os: "Windows Server 2022", location: "BLR" },
  { id: 13, hostname: "Mysql Server", ip: "192.168.2.111", os: "Linux", location: "BLR" },
  { id: 14, hostname: "MSSQL", ip: "192.168.2.172", os: "Windows Server 2022", location: "BLR" },
  { id: 15, hostname: "ASPL_DESKTOP-2MS825A", ip: "192.168.2.116", os: "Windows 11", location: "BLR" },
  { id: 16, hostname: "VITBLRSRVSRHPRNT", ip: "192.168.4.21", os: "Windows Server 2022", location: "BLR" },
  { id: 17, hostname: "VITSRVANTV02", ip: "192.168.4.64", os: "Windows Server 2022", location: "DC2" },
  { id: 18, hostname: "VITBLRSRVAPP01", ip: "192.168.4.104", os: "Windows Server 2022", location: "BLR" },
  { id: 19, hostname: "VITBLRSRVAPP02", ip: "192.168.4.105", os: "Windows Server 2022", location: "BLR" },
  { id: 20, hostname: "VITBLRSRVPDB02", ip: "192.168.4.108", os: "Windows Server 2022", location: "BLR" },
  { id: 21, hostname: "VITBLRSRVTAIL02", ip: "192.168.4.41", os: "Windows Server 2022", location: "BLR" },
  // Linux servers
  { id: 22, hostname: "VITBLRSRVZBC01", ip: "192.168.6.101", os: "Ubuntu 22.04", location: "BLR" },
  { id: 23, hostname: "VITBLRSRVZDB01", ip: "192.168.2.111", os: "Ubuntu 22.04", location: "BLR" },
  { id: 24, hostname: "Docker", ip: "192.168.2.73", os: "Ubuntu 22.04", location: "BLR" },
  { id: 25, hostname: "VITZBOXORACLE_192.168.2.164", ip: "192.168.2.164", os: "Oracle Linux", location: "BLR" },
  { id: 26, hostname: "ASPL_Pulse", ip: "192.168.2.111", os: "Linux", location: "BLR" },
  { id: 27, hostname: "zbxkuberc1-JMX Tomcat", ip: "192.168.2.115", os: "Linux", location: "BLR" },
  { id: 28, hostname: "Database Server", ip: "192.168.2.111", os: "Linux", location: "BLR" },
  { id: 29, hostname: "vitblruat03", ip: "192.168.2.192", os: "Ubuntu 22.04", location: "BLR" },
  { id: 30, hostname: "SPLUNKTEST", ip: "192.168.4.172", os: "Linux", location: "BLR" },
  { id: 31, hostname: "photon_machine", ip: "192.168.4.157", os: "Linux", location: "BLR" },
];

// ----- Generate mock metrics for a server -----
export const generateServerMetrics = (serverId) => {
  return {
    cpu: Math.round(10 + Math.random() * 80),
    memory: Math.round(20 + Math.random() * 70),
    disk: Math.round(15 + Math.random() * 75),
    status: ["up", "up", "up", "down", "warning"][Math.floor(Math.random() * 5)],
    uptime: `${Math.floor(Math.random() * 30) + 1}d ${Math.floor(Math.random() * 24)}h`,
  };
};

// ----- Get a server by hostname -----
export const getServerByHostname = (hostname) => {
  return serverInventory.find(s => s.hostname === hostname);
};

// ----- Get a server by IP -----
export const getServerByIP = (ip) => {
  return serverInventory.find(s => s.ip === ip);
};

// ----- Get all servers with their current metrics -----
export const getAllServersWithMetrics = () => {
  return serverInventory.map(server => ({
    ...server,
    metrics: generateServerMetrics(server.id),
  }));
};