import { Type } from "typebox";
export const IzipayPluginConfigSchema = Type.Object({
    apiKey: Type.Optional(Type.String({ minLength: 1 })),
    environment: Type.Optional(Type.Union([Type.Literal("sandbox"), Type.Literal("production")])),
}, { additionalProperties: false });
export const DEFAULT_CONFIG = {
    environment: "sandbox",
};
export function getApiKey(config) {
    if (!config)
        return undefined;
    if (config.apiKey)
        return config.apiKey;
    return process.env.IZIPAY_API_KEY;
}
export function resolveConfig(config) {
    return {
        apiKey: config?.apiKey ?? process.env.IZIPAY_API_KEY ?? "",
        environment: config?.environment ?? "sandbox",
    };
}
//# sourceMappingURL=config.js.map