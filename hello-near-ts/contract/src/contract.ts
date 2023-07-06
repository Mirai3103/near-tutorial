// Find all our documentation at https://docs.near.org
import {
    NearBindgen,
    initialize,
    near,
    call,
    view,
    AccountId,
    UnorderedSet,
    LookupMap,
    UnorderedMap,
    deserialize,
    serialize,
} from "near-sdk-js";
import { NFTContractMetadata, Token, TokenMetadata } from "./metadata";
import { signerAccountId } from "near-sdk-js/lib/api";
interface IMintProps {
    tokenId: string;
    title?: string;
    description?: string;
    media?: string;
}
@NearBindgen({})
class Contract {
    public owner_id: string;
    public tokens_per_owner: LookupMap<UnorderedSet<string>>;
    public token_by_id: LookupMap<Token>;
    public token_metadata_by_id: UnorderedMap<TokenMetadata>;
    public metadata?: NFTContractMetadata;
    constructor() {
        const metadata = new NFTContractMetadata();
        metadata.spec = "nft-1.0.0";
        metadata.name = "Huu Hoang NFT";
        metadata.symbol = "HHNFT";
        this.owner_id = signerAccountId() || "laffy.testnet";
        this.tokens_per_owner = new LookupMap<UnorderedSet<string>>("t");
        this.token_by_id = new LookupMap<Token>("b");
        this.token_metadata_by_id = new UnorderedMap<TokenMetadata>("m");
        this.metadata = metadata;
    }
    @initialize({})
    public init(): void {
        const metadata = new NFTContractMetadata();
        metadata.spec = "nft-1.0.0";
        metadata.name = "Huu Hoang NFT";
        metadata.symbol = "HHNFT";
        this.owner_id = signerAccountId() || "laffy.testnet";
        this.tokens_per_owner = new LookupMap<UnorderedSet<string>>("t");
        this.token_by_id = new LookupMap<Token>("b");
        this.token_metadata_by_id = new UnorderedMap<TokenMetadata>("m");
        this.metadata = metadata;
    }

    @call({
        payableFunction: true,
    })
    public mint({ tokenId, title, description, media }: IMintProps): void {
        let tokenMetadata = new TokenMetadata();
        tokenMetadata.title = title;
        tokenMetadata.description = description;
        tokenMetadata.media = media;
        let token = new Token();
        token.owner_id = this.owner_id;
        token.token_id = tokenId;
        token.metadata = tokenMetadata;
        this.token_by_id.set(tokenId, token);
        let oldTokens = this.tokens_per_owner.get(this.owner_id);
        if (!oldTokens) {
            oldTokens = new UnorderedSet<string>("ta");
        }
        oldTokens.set(tokenId);
        this.tokens_per_owner.set(this.owner_id, oldTokens);
        this.token_metadata_by_id.set(tokenId, tokenMetadata);
    }
    @view({})
    public getTokenById({ tokenId }) {
        return this.token_by_id.get(tokenId);
    }
    @view({})
    public getTokensByOwner({ accountId }): Token[] {
        const tokens = this.tokens_per_owner.get(accountId);
        if (!tokens) {
            return [];
        }
        const result = new Array<Token>(tokens.length);
        let i = 0;
        for (let tokenId of tokens.elements({})) {
            result[i] = this.token_by_id.get(tokenId);
            i += 1;
        }
        return result;
    }
    @view({})
    public getMetadataById({ tokenId }): TokenMetadata {
        return this.token_metadata_by_id.get(tokenId);
    }
}
