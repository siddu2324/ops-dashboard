export const login = (role) => {
  localStorage.setItem("auth", "true");
  localStorage.setItem("role", role);
};

export const logout = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("role");
};

export const isAuthenticated = () => {
  return localStorage.getItem("auth") === "true";
};

export const getRole = () => {
  return localStorage.getItem("role") || "user"; // default to user
};

export const isAdmin = () => {
  return getRole() === "admin";
};