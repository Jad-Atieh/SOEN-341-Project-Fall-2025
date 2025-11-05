export function login(user) {
  localStorage.setItem("auth_user", JSON.stringify(user));
}
export function logout() {
  localStorage.removeItem("auth_user");
}
export function getUser() {
  try { return JSON.parse(localStorage.getItem("auth_user") || "null"); } catch { return null; }
}
export function isLoggedIn() {
  return !!getUser();
}