import { NewReadingOnboarding, NewReadingProps } from "@/modules/new";
import { useStepOneData } from "@/modules/new/store";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/modules/layout";
import { useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function New() {
  const stepOneData = useStepOneData();

  const methods = useForm<NewReadingProps>({
    defaultValues: {
      ...stepOneData,
    },
  });

  const router = useRouter();

  return (
    <Layout>
      <FormProvider {...methods}>
        <form className="max-md:px-4">
          <NewReadingOnboarding onSelected={(type) => router.push(`/new/${type}`)} />
        </form>
      </FormProvider>
    </Layout>
  );
}
