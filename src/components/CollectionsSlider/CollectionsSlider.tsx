import React, { FC, useEffect, useMemo } from "react";
import { ICollectionData } from "../../interface/collections.interface";
import Marqee from "react-fast-marquee";
import "react-alice-carousel/lib/alice-carousel.css";
import { Box } from "@primer/react";
import { collectionsStore } from "../../stores/collectionsStore";
const CollectionsSlider: FC = () => {
  const { collections } = collectionsStore.getState();

  const renderCollections = useMemo(() => {
    return collections.map((c) => {
      return (
        <Box sx={{ width: "10em", padding: "0.5em" }} key={c.id}>
          <img src={c.image} alt="collectionImg" />
        </Box>
      );
    });
  }, [collections]);

  return (
    <Box sx={{ zIndex: -1 }}>
      <Marqee pauseOnHover loop={0} speed={40} direction={"right"}>
        <Box style={{ display: "flex" }}>{renderCollections}</Box>
      </Marqee>
      <Marqee pauseOnHover loop={0} speed={40}>
        <Box style={{ display: "flex" }}>{renderCollections}</Box>
      </Marqee>
    </Box>
  );
};

export default CollectionsSlider;
