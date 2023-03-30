import { Box, Button, ProgressBar } from "@primer/react";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useContext, useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import solanaLogo from "../../assets/solanaLogo.jpeg";
import {
  getNftsFromDeruggedCollection,
  getQuestionMarkPattern,
} from "../../common/helpers";
import { CollectionContext } from "../../stores/collectionContext";
import Flip from "react-reveal/Flip";
import { generateSkeletonArrays } from "../../utilities/nft-fetching";
import { NftWithToken } from "@metaplex-foundation/js";
import { mintNftFromCandyMachine } from "../../solana/methods/public-mint";
import toast from "react-hot-toast";

const PublicMint = () => {
  const { collection, remintConfig, collectionDerug, activeListings } =
    useContext(CollectionContext);
  const [loading, toggleLoading] = useState(false);
  const [isMinting, toggleIsMinting] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const wallet = useAnchorWallet();

  const [nfts, setNfts] = useState<{ image: string; name: string }[]>([]);

  const [mintedNft, setMintedNft] = useState<NftWithToken>();

  const [nftImage, setNftImage] = useState<string>();

  useEffect(() => {
    if (!nfts) void getNfts();
  }, []);

  const getNfts = async () => {
    toggleLoading(true);
    try {
      if (wallet) {
        setNfts(
          await getNftsFromDeruggedCollection(
            wallet.publicKey,
            //TODO:remove ?? before mainnet launch
            remintConfig?.collection ??
              new PublicKey("EW55NiBd4M3gEEqdA6NthxFZHoSC9w6UG8H6d7BuwS1D")
          )
        );
      }
    } catch (error) {
    } finally {
      toggleLoading(false);
    }
  };

  const getMintCurrencyData = useMemo(() => {
    if (!remintConfig || !remintConfig.mintCurrency) {
      return { logo: solanaLogo, currency: "SOL" };
    }
  }, [remintConfig]);

  const mintNfts = async () => {
    setHasMinted(true);
    toggleIsMinting(true);
    setMintedNft(undefined);
    setNftImage(undefined);
    try {
      if (wallet && remintConfig) {
        const minted = await mintNftFromCandyMachine(remintConfig, wallet);
        if (!minted) throw new Error();
        setNftImage((await (await fetch(minted?.uri!)).json()).image);
        toast.success(`Successfully minted ${minted.name}`);
      }
    } catch (error) {
      toast.error("Failed to mint");
    }
  };

  const renderNfts = useMemo(() => {
    return nfts.map((n) => {
      return (
        <Box className="flex flex-col items-center">
          <img src={n.image} alt="" />
          <p className="font-bold text-main-blue text-sm w-full">{n.name}</p>
        </Box>
      );
    });
  }, [nfts]);

  // const renderPattern = useMemo(() => {
  //   return (
  //     <Box
  //       sx={{
  //         width: "50%",
  //       }}
  //     >
  //       {pattern.map((_, index) => {
  //         return (
  //           <div className="grid grid-cols-7 gap-1 mb-1">
  //             {pattern[index].map((elem: boolean) => {
  //               return (
  //                 <>
  //                   {elem ? (
  //                     <img className="rounded-md" src={collection?.image} />
  //                   ) : (
  //                     <div
  //                       className="rounded-md"
  //                       style={{
  //                         background: "rgba(9,194,246, 0.2)",
  //                       }}
  //                     />
  //                   )}
  //                 </>
  //               );
  //             })}
  //           </div>
  //         );
  //       })}
  //     </Box>
  //   );
  // }, []);

  const renderNftPlaceholders = useMemo(() => {
    return (
      <div className="relative grid grid-cols-3 gap-1" style={{ width: "40%" }}>
        {activeListings
          ?.reverse()
          .slice(0, 9)
          .map((al) => {
            return (
              <Flip left opposite when={!hasMinted}>
                <img
                  src={al.imageUrl}
                  alt="nftImg"
                  className="rounded-md opacity-50 z-10"
                />
              </Flip>
            );
          })}

        <img
          src={nftImage ?? collection?.image}
          className="z-0 absolute top-0 left-0 rounded-md"
        />
      </div>
    );
  }, [activeListings, mintedNft, hasMinted, nftImage, collection]);

  return (
    <Box className="w-11/12 m-auto grid grid-cols-3 gap-10 my-10">
      <Box className="flex flex-col items-start gap-5">
        <p className="text-main-blue text-bold text-xl">
          Your {remintConfig?.newName ?? collection?.name} NFTs
        </p>
        <Box className="max-h-20 overlow-scroll grid grid-cols-5 gap-5">
          {loading
            ? generateSkeletonArrays(15).map(() => (
                <Skeleton
                  height={100}
                  width={110}
                  baseColor="rgb(22,27,34)"
                  highlightColor="rgb(29,35,44)"
                />
              ))
            : renderNfts}
        </Box>
      </Box>
      <Box className="relative flex flex-col gap-10 items-center">
        {collection ? (
          <> {renderNftPlaceholders}</>
        ) : (
          <Skeleton
            height={128}
            width={156}
            baseColor="rgb(22,27,34)"
            highlightColor="rgb(29,35,44)"
          />
        )}
        {mintedNft && (
          <p className="text-main-blue font-bold">{mintedNft.name}</p>
        )}
        <button
          className="w-40  border-[1px] border-main-blue text-main-blue py-1 
          hover:bg-main-blue hover:text-black font-bold hover:border-black hover:border-[1px]"
          onClick={mintNfts}
        >
          Mint
        </button>
      </Box>
      <Box className="flex flex-col items-start gap-3 ">
        <p className="text-main-blue text-bold text-xl">Mint details</p>
        <Box className="flex flex-col gap-3 items-start">
          <p className="text-bold text-green-color text-md">Private Mint</p>
          <Box className="flex gap-5 items-center">
            <ProgressBar
              width={"100%"}
              progress={100}
              bg="#2DD4BF"
              sx={{
                width: "380px",
                height: "8px",
                borderRadius: 0,
                color: "rgb(45, 212, 191)",
                "@media (max-width: 768px)": {
                  width: "200px",
                },
              }}
            />
            <p>
              {collectionDerug?.totalReminted ?? 200}/
              {collectionDerug?.totalSupply ?? 400}
            </p>
          </Box>
        </Box>
        <Box className="flex flex-col gap-3 items-start">
          <p className="text-bold text-main-blue text-md">Public Mint</p>
          <Box className="flex gap-5 items-center">
            <ProgressBar
              width={"100%"}
              progress={45}
              bg="rgb(9, 194, 246)"
              sx={{
                width: "380px",
                height: "8px",
                borderRadius: 0,
                color: "rgb(45, 212, 191)",
                "@media (max-width: 768px)": {
                  width: "200px",
                },
              }}
            />
            <p>
              {collectionDerug?.totalReminted ?? 200}/
              {collectionDerug?.totalSupply ?? 400}
            </p>
          </Box>
        </Box>
        <Box className="w-full flex">
          <Box className="flex gap-5 items-center">
            <p className="text-main-blue font-bold text-lg">
              MINT PRICE : {1.5} {getMintCurrencyData?.currency}
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PublicMint;
