import { Box, Button, Text } from "@primer/react";
import { FC, useCallback, useMemo, useState } from "react";
import magicEdenLogo from "../../assets/magicEdenLogo.png";
import tensorLogo from "../../assets/tensorLogo.png";
import { ListingSource } from "../../enums/collections.enums";
import { INftListing } from "../../interface/collections.interface";

const ListedNftItem: FC<{ listedNft: INftListing }> = ({ listedNft }) => {
  const [hover, setHover] = useState(false);

  const getImgLogo = useMemo(() => {
    switch (listedNft.soruce) {
      case ListingSource.MagicEden:
        return magicEdenLogo;
      case ListingSource.Tensor:
        return tensorLogo;
    }
  }, [listedNft]);
  return (
    <Box
      className="flex relative flex-col gap-5 px-2 py-4  items-start border-cyan-500 ease-in duration-300"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={listedNft.imageUrl}
        alt="nftImg"
        className="rounded-[4px] w-48"
        style={{ opacity: hover ? 0.2 : 1 }}
      />
      {hover && (
        <Box className="flex absolute flex-col w-full h-full gap-2 items-center justify-center text-white font-mono">
          <Box className="flex flex-row  items-center">
            <Box className="flex flex-col">
              <Text
                className="text-sm font-bold"
                sx={{ color: "rgb(45, 212, 191)" }}
              >
                {listedNft.name}
              </Text>
              <Text className="text-sm font-bold ">{listedNft.price} SOL</Text>
            </Box>
          </Box>
          <Box className="flex flex-row gap-5 items-center">
            <Button
              className="bg-transparent font-mono font-bold text-lg"
              sx={{
                bg: "transparent",
                fontFamily: "monospace",
                padding: "1em",
              }}
              onClick={() =>
                window.open(
                  `https://magiceden.io/item-details/${listedNft.mint}`,
                  "_blank"
                )
              }
            >
              <div className="flex align-centar justify-between cursor-pointer">
                <img
                  src={getImgLogo}
                  alt="meLogo"
                  className="rounded-[50px] w-5 h-5 mr-2"
                />{" "}
                Details
              </div>
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ListedNftItem;
