export interface IzipayClientConfig {
  apiKey: string;
  environment: "sandbox" | "production";
}

export function createAuthHeaders(config: IzipayClientConfig): Record<string, string> {
  return {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export function getBaseUrl(environment: "sandbox" | "production"): string {
  const urls = {
    sandbox: "https://api.sandbox.izipay.pe",
    production: "https://api.izipay.pe",
  };
  return urls[environment];
}

export function buildUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}