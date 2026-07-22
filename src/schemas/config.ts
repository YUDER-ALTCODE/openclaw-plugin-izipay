import { Type, type Static } from "typebox";

export const IzipayPluginConfigSchema = Type.Object({
  username: Type.Optional(Type.String({ minLength: 1, description: "Izipay username (user ID)" })),
  password: Type.Optional(Type.String({ minLength: 1, description: "Izipay password (test or production)" })),
  environment: Type.Optional(
    Type.Union([Type.Literal("sandbox"), Type.Literal("production")])
  ),
}, { additionalProperties: false });

export type IzipayPluginConfig = Static<typeof IzipayPluginConfigSchema>;

export const DEFAULT_CONFIG: IzipayPluginConfig = {
  environment: "sandbox",
};

export function resolveConfig(config: IzipayPluginConfig | undefined): Required<IzipayPluginConfig> {
  return {
    username: config?.username ?? process.env.IZIPAY_USERNAME ?? "",
    password: config?.password ?? process.env.IZIPAY_PASSWORD ?? "",
    environment: config?.environment ?? "sandbox",
  };
}
