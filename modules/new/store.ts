import { create } from "zustand";
import { StepOneData, StepTwoData } from "./constants";

const stepVariant = {
  1: "stepOne",
  2: "stepTwo",
} as const;

type setDataType = { step: 1; data: StepOneData | null } | { step: 2; data: StepTwoData | null };

export type StepFormSlice = {
  stepOne: StepOneData | null;
  stepTwo: StepTwoData | null;
  actions: {
    setData: ({ step, data }: setDataType) => void;
  };
};

export const useStepFormStore = create<StepFormSlice>()((set) => ({
  stepOne: null,
  stepTwo: null,
  actions: {
    setData: ({ step, data }) => set({ [stepVariant[step]]: data }),
  },
}));

export const useStepOne = () => useStepFormStore((state) => state.stepOne);

export const useStepTwo = () => useStepFormStore((state) => state.stepTwo);

export const useStepFormActions = () => useStepFormStore((state) => state.actions);
