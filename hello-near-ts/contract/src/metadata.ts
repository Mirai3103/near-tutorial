import { AccountId, deserialize } from "near-sdk-js";

export class Token {
    public owner_id: AccountId;
    public token_id: string;
    public metadata: TokenMetadata;
}

export class TokenMetadata {
    public title?: string;
    public description?: string;
    public media?: string;
}
export class NFTContractMetadata {
    public spec: string;
    public name: string;
    public symbol: string;
    public icon?: string;
    public base_uri?: string;
    public reference?: string;
    public reference_hash?: string;
}
