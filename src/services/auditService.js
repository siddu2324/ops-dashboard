// src/services/auditService.js
const STORAGE_KEY = "auditLog";

// Get current user (from authService)
import { getRole } from "./authService";

const getCurrentUser = () => {
  const role = getRole();
  return role === "admin" ? "admin" : "user";
};

// Log an action
export const logAction = (action, details = {}) => {
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    user: getCurrentUser(),
    action,
    details,
  };
  // Store in localStorage
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const updated = [entry, ...existing].slice(0, 500); // keep last 500 entries
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// Get all log entries
export const getAuditLog = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

// Clear log (admin only)
export const clearAuditLog = () => {
  localStorage.removeItem(STORAGE_KEY);
};