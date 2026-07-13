// src/data/events.js
export const initialEvents = [
  {
    id: 1,
    name: "Error: 401",
    type: "Exceptions",
    severity: "High",
    count: 32971,
    lastTriggered: "2026-07-09T12:55:00Z",
  },
  {
    id: 2,
    name: "RequestError",
    type: "Exceptions",
    severity: "High",
    count: 32613,
    lastTriggered: "2026-07-09T12:55:00Z",
  },
  {
    id: 3,
    name: "AWSSecurityTokenServiceException",
    type: "Exceptions",
    severity: "High",
    count: 40165,
    lastTriggered: "2026-07-09T12:55:00Z",
  },
  {
    id: 4,
    name: "QueryFailedException",
    type: "Exceptions",
    severity: "High",
    count: 15243,
    lastTriggered: "2026-07-09T12:55:00Z",
  },
  {
    id: 5,
    name: "Database connection timeout",
    type: "Timeout",
    severity: "Medium",
    count: 8452,
    lastTriggered: "2026-07-09T11:30:00Z",
  },
  {
    id: 6,
    name: "Memory limit exceeded",
    type: "Resource",
    severity: "High",
    count: 1234,
    lastTriggered: "2026-07-09T10:15:00Z",
  },
  {
    id: 7,
    name: "SSL certificate expired",
    type: "Security",
    severity: "High",
    count: 567,
    lastTriggered: "2026-07-09T09:00:00Z",
  },
  {
    id: 8,
    name: "Disk space warning",
    type: "Resource",
    severity: "Medium",
    count: 892,
    lastTriggered: "2026-07-09T08:45:00Z",
  },
];

export const generateNewEvent = () => {
  const names = [
    "Error: 401", "RequestError", "AWSSecurityTokenServiceException", 
    "QueryFailedException", "Database connection timeout", 
    "Memory limit exceeded", "SSL certificate expired", 
    "Disk space warning", "API rate limit exceeded", 
    "Service unavailable", "Authentication failed"
  ];
  const types = ["Exceptions", "Timeout", "Resource", "Security", "Network", "Authentication"];
  const severities = ["High", "Medium", "Low", "Critical"];
  
  return {
    id: Date.now(),
    name: names[Math.floor(Math.random() * names.length)],
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    count: Math.floor(100 + Math.random() * 50000),
    lastTriggered: new Date().toISOString(),
  };
};