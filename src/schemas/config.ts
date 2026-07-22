import { Type, type Static } from "typebox";

export const IzipayPluginConfigSchema = Type.Object({
  apiKey: Type.Optional(Type.String({ minLength: 1 })),
  environment: Type.Optional(
    Type.Union([Type.Literal("sandbox"), Type.Literal("production")])
  ),
}, { additionalProperties: false });

export type IzipayPluginConfig = Static<typeof IzipayPluginConfigSchema>;

export const DEFAULT_CONFIG: IzipayPluginConfig = {
  environment: "sandbox",
};

export function getApiKey(config: IzipayPluginConfig | undefined): string | undefined {
  if (!config) return undefined;
  if (config.apiKey) return config.apiKey;
  return process.env.IZIPAY_API_KEY;
}

export function resolveConfig(config: IzipayPluginConfig | undefined): Required<IzipayPluginConfig> {
  return {
    apiKey: config?.apiKey ?? process.env.IZIPAY_API_KEY ?? "",
    environment: config?.environment ?? "sandbox",
  };
}