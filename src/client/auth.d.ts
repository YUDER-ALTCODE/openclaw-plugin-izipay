export interface IzipayClientConfig {
    apiKey: string;
    environment: "sandbox" | "production";
}
export declare function createAuthHeaders(config: IzipayClientConfig): Record<string, string>;
export declare function getBaseUrl(environment: "sandbox" | "production"): string;
export declare function buildUrl(baseUrl: string, path: string): string;
//# sourceMappingURL=auth.d.ts.map