import React from "react";
import { useStepFormActions } from "../store";
import { useFormContext } from "react-hook-form";
import { NewReadingProps } from "../constants";

export function useSyncData() {
  const { getValues } = useFormContext<NewReadingProps>();

  const { setData } = useStepFormActions();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setData({
        step: 2,
        data: getValues(),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [getValues, setData]);
}
