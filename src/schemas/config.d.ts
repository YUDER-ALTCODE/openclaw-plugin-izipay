import { Type, type Static } from "typebox";
export declare const IzipayPluginConfigSchema: Type.TObject<{
    apiKey: Type.TOptional<Type.TString>;
    environment: Type.TOptional<Type.TUnion<[Type.TLiteral<"sandbox">, Type.TLiteral<"production">]>>;
}>;
export type IzipayPluginConfig = Static<typeof IzipayPluginConfigSchema>;
export declare const DEFAULT_CONFIG: IzipayPluginConfig;
export declare function getApiKey(config: IzipayPluginConfig | undefined): string | undefined;
export declare function resolveConfig(config: IzipayPluginConfig | undefined): Required<IzipayPluginConfig>;
//# sourceMappingURL=config.d.ts.map