function parseCsv(value: string | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function getAllowedFrameSrc() {
  const fromEnv = parseCsv(process.env.IFRAME_ALLOWLIST);
  if (fromEnv.length > 0) return fromEnv;

  // Defaults cover public Power BI embeds.
  return ["https://app.powerbi.com", "https://*.powerbi.com"];
}

export function isCspReportOnly() {
  // Default a enforcing para producción. Configurar CSP_REPORT_ONLY=true solo si hay problemas con dashboards.
  return (process.env.CSP_REPORT_ONLY ?? "false").toLowerCase() === "true";
}

