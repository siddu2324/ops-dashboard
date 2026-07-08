export function login() {
  sessionStorage.setItem("isLoggedIn", "true");
}

export function logout() {
  sessionStorage.removeItem("isLoggedIn");
}

export function isAuthenticated() {
  return sessionStorage.getItem("isLoggedIn") === "true";
}