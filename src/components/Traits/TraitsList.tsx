import { Box } from "@primer/react";
import React, { FC, useMemo } from "react";
import { ITrait } from "../../interface/collections.interface";
import Traits from "./Traits";

const TraitsList: FC<{ traits: ITrait[] }> = ({ traits }) => {
  const renderTraits = useMemo(() => {
    return traits.map((t) => {
      return <Traits trait={t} key={t.name} />;
    });
  }, []);
  return <Box className="flex flex-col gap-10 pl-0">{renderTraits}</Box>;
};

export default TraitsList;