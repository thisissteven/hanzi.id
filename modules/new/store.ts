import { create } from "zustand";
import { StepOneData, StepTwoData } from "./constants";

const stepVariant = {
  1: "stepOne",
  2: "stepTwo",
} as const;

type setDataType = { step: 1; data: StepOneData | null } | { step: 2; data: StepTwoData | null };

const defaultStepOneData: StepOneData = {
  title: "",
  description: "",
  image: null,
};

const defaultStepTwoData: StepTwoData = {
  chapters: [
    {
      title: "",
      content: "",
    },
  ],
};

export type StepFormSlice = {
  stepOne: StepOneData | null;
  stepTwo: StepTwoData | null;
  actions: {
    setData: ({ step, data }: setDataType) => void;
    clearData: () => void;
  };
};

export const useStepFormStore = create<StepFormSlice>()((set) => ({
  stepOne: defaultStepOneData,
  stepTwo: defaultStepTwoData,
  actions: {
    setData: ({ step, data }) => set({ [stepVariant[step]]: data }),
    clearData: () => set({ stepOne: defaultStepOneData, stepTwo: defaultStepTwoData }),
  },
}));

export const useStepOneData = () => useStepFormStore((state) => state.stepOne);

export const useStepTwoData = () => useStepFormStore((state) => state.stepTwo);

export const useStepFormActions = () => useStepFormStore((state) => state.actions);
