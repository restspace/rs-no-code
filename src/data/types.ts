import type { ConnectSpec } from "../CatalogueItem";

export interface IAccessControl {
    readRoles: string;
    writeRoles: string;
    createRoles?: string;
    manageRoles?: string;
}

export interface IServiceSpec {
    name: string;
    apis?: string[];
    basePath: string;
    access: IAccessControl;
    tenant?: string;
}

export interface ServiceFull extends IServiceSpec {
    serviceName: string;
    adapterName: string;
    adapterConfig: any;
}

export interface PrivateService {
    adapterInterface?: string;
}

export interface ServiceManifest {
    name: string;
    source?: string;
    description: string;
    logo?: string;
    configSchema?: Record<string, unknown>;
    defaults?: Record<string, unknown>;
    apis?: string[];
    adapterInterface?: string;
    privateServices?: Record<string, PrivateService>
}

export interface ServiceManifestLocal extends ServiceManifest {
    connects: ConnectSpec[];
    configuration?: any;
}

export interface AdapterManifest {
    name: string;
    description: string;
    configSchema: Record<string, unknown>;
    adapterInterfaces: string[];
    source: string;
}

export interface CatalogueResponse {
    catalogue: Catalogue;
    baseSchema: any;
}

export interface InfraDetail {
    adapterSource: string;
    preconfigured: string[];
}

export interface Catalogue {
    services: Record<string, ServiceManifest>;
    adapters: Record<string, AdapterManifest>;
    infra: Record<string, InfraDetail>;
}

export interface UiServices {
    catalogue: Catalogue;
    baseSchema: any;
    services: Record<string, IServiceSpec>;
}

export interface TenantConfig {
    services: { [basePath: string]: IServiceConfig };
}

export interface IServiceConfig {
    name: string;
    source: string;
    basePath: string;
    access: IAccessControl;
    caching?: ICacheControl;
    adapterSource?: string;
    infraName?: string;
    adapterConfig?: Record<string, unknown>;
}

export interface ICacheControl {
    maxAge?: number;
    cache?: boolean;
    sendETag?: boolean;
}