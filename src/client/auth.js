export function createAuthHeaders(config) {
    return {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
    };
}
export function getBaseUrl(environment) {
    const urls = {
        sandbox: "https://api.sandbox.izipay.pe",
        production: "https://api.izipay.pe",
    };
    return urls[environment];
}
export function buildUrl(baseUrl, path) {
    return `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}
//# sourceMappingURL=auth.js.map