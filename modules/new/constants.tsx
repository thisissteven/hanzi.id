import { FileTextIcon, ImageUpIcon, TypeIcon } from "lucide-react";

export type ReadingType = "pdf" | "text" | "image";

export type StepOneData = {
  title: string;
  description?: string;
  image: {
    smallUrl: string;
    mediumUrl: string;
    source: string;
    width: number;
    height: number;
  } | null;
};

export type StepTwoData = {
  chapters: Array<{
    title: string;
    content: string;
  }>;
};

export type NewReadingProps = StepOneData & StepTwoData;

export const buttons: Array<{
  icon: React.ReactNode;
  text: string;
  type: ReadingType;
}> = [
  {
    icon: <FileTextIcon />,
    text: "Extract Text from PDF",
    type: "pdf",
  },
  {
    icon: <TypeIcon />,
    text: "Type or Paste Text",
    type: "text",
  },
  {
    icon: <ImageUpIcon />,
    text: "Upload Image/s",
    type: "image",
  },
];
