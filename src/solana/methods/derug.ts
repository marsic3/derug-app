import { SystemProgram, TransactionInstruction } from "@solana/web3.js";
import {
  IChainCollectionData,
  ICollectionDerugData,
  INftListing,
} from "../../interface/collections.interface";
import { PublicKey } from "@solana/web3.js";
import { derugDataSeed, metadataSeed } from "../seeds";
import { derugProgramFactory } from "../utilities";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  MAINNET_RPC_CONNECTION,
  METAPLEX_PROGRAM,
  RPC_CONNECTION,
} from "../../utilities/utilities";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import {
  IDerugInstruction,
  IUtilityData,
} from "../../interface/derug.interface";
import { mapUtilityAction } from "../helpers";
import { sendTransaction } from "../sendTransaction";
import { DerugStatus } from "../../enums/collections.enums";

export const createDerugDataIx = async (
  collection: IChainCollectionData,
  wallet: WalletContextState,
  listedNfts?: INftListing
) => {
  const derugProgram = derugProgramFactory();
  const collectionKey = new PublicKey(collection.collectionMint);

  const collectionAccountInf = await MAINNET_RPC_CONNECTION.getAccountInfo(
    collectionKey
  );

  let collectionMetadata: PublicKey | undefined;
  let mintKey: PublicKey | undefined;

  if (collectionAccountInf?.owner.toString() === TOKEN_PROGRAM_ID.toString()) {
    mintKey = collectionKey;
  } else {
    mintKey = new PublicKey(listedNfts?.mint!);
  }

  [collectionMetadata] = PublicKey.findProgramAddressSync(
    [metadataSeed, METAPLEX_PROGRAM.toBuffer(), mintKey.toBuffer()],
    METAPLEX_PROGRAM
  );

  const ix = await derugProgram.methods
    .initializeDerug(collection.totalSupply)
    .accounts({
      collectionKey,
      derugData: collection.derugDataAddress,
      payer: wallet.publicKey!,
      collectionMetadata,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return ix;
};

export const getCollectionDerugData = async (
  derugDataAddress: PublicKey
): Promise<ICollectionDerugData> => {
  try {
    const derugProgram = derugProgramFactory();
    const derugDataAccount = await derugProgram.account.derugData.fetch(
      derugDataAddress
    );
    return {
      collection: derugDataAccount.collection,
      createdAt: derugDataAccount.createdAt.toNumber(),
      status: Object.keys(derugDataAccount.derugStatus)[0] as DerugStatus,
      totalReminted: derugDataAccount.totalReminted,
      totalSuggestionCount: derugDataAccount.totalSuggestionCount,
      totalSupply: derugDataAccount.totalSupply,
      votingStartedAt: derugDataAccount.votingStartedAt.toNumber(),
      newCollection: derugDataAccount.newCollection,
      winningRequest: derugDataAccount.winningRequest,
    };
  } catch (error) {
    console.log(error);

    throw error;
  }
};