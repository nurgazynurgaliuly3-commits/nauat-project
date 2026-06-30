export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000";
}

export function getProductionWarnings() {
  const warnings: string[] = [];
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === "nauat2026") {
    warnings.push("ADMIN_PASSWORD production үшін ауыстырылуы керек.");
  }
  if (!process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL.includes("example")) {
    warnings.push("NEXT_PUBLIC_SITE_URL нақты доменге қойылуы керек.");
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    warnings.push("Тегін production сақтау үшін Supabase env мәндері қойылуы керек.");
  }
  return warnings;
}
