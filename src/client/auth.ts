export interface IzipayClientConfig {
  username: string;
  password: string;
  environment: "sandbox" | "production";
}

export function createAuthHeaders(config: IzipayClientConfig): Record<string, string> {
  const credentials = Buffer.from(`${config.username}:${config.password}`).toString("base64");
  return {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export function getBaseUrl(environment: "sandbox" | "production"): string {
  return "https://api.micuentaweb.pe";
}

export function getPaymentLinkBaseUrl(environment: "sandbox" | "production"): string {
  return environment === "sandbox"
    ? "https://sandbox-api-pw.izipay.pe"
    : "https://api-pw.izipay.pe";
}

export function buildUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}
