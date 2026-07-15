export const CURRENT_VERSION = 11; // increment if needed

export const defaultDashboards = [
  // ❌ REMOVED: Oracle Monitoring (id: 7)
  // ❌ REMOVED: OracleRealTimeOSPerformance etc. (there were no separate entries, only "Oracle Monitoring")
  { id: 2, name: "Top 10 Memory Utilization Report - Windows", description: "", createdAt: new Date().toISOString() },
  { id: 3, name: "Top 10 CPU Load Report - Windows", description: "", createdAt: new Date().toISOString() },
  { id: 4, name: "Top 10 CPU Load Report - Linux", description: "", createdAt: new Date().toISOString() },
  { id: 5, name: 'Top 10 "C" Disk Utilization Report - Windows', description: "", createdAt: new Date().toISOString() },
  { id: 6, name: 'Top 10 "/" Disk Utilization Report - Linux', description: "", createdAt: new Date().toISOString() },
  // id: 7 was Oracle Monitoring - REMOVED
  { id: 8, name: "Firewall Dashboard", description: "", createdAt: new Date().toISOString() },
  { id: 9, name: "Bangalore Dashboard", description: "", createdAt: new Date().toISOString() },
  { id: 10, name: "NOC Dashboard", description: "", createdAt: new Date().toISOString() },
];