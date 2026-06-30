import type { NextRequest } from "next/server";

export function getAdminCredentials() {
  return {
    user: process.env.ADMIN_USER || "admin",
    password: process.env.ADMIN_PASSWORD || "nauat2026"
  };
}

export function isAdminRequest(request: NextRequest) {
  const { user, password } = getAdminCredentials();
  const expected = `Basic ${btoa(`${user}:${password}`)}`;
  return request.headers.get("authorization") === expected;
}
