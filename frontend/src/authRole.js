import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

export function isAuthed() {
  const t = localStorage.getItem(ACCESS_TOKEN);
  if (!t) return false;
  try {
    const d = jwtDecode(t);
    return d.exp && d.exp > Date.now()/1000;
  } catch { return false; }
}

export function userRole() {
  const t = localStorage.getItem(ACCESS_TOKEN);
  if (!t) return null;
  try {
    const d = jwtDecode(t);
    return d.role || null;
  } catch { return null; }
}

export function signOut() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  window.location.href = "/";
}