import { Layout } from "@/modules/layout";
import { NewReadingContent, NewReadingProps } from "@/modules/new";
import { useStepOneData } from "@/modules/new/store";
import { useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function Type() {
  const stepOneData = useStepOneData();

  const methods = useForm<NewReadingProps>({
    defaultValues: {
      ...stepOneData,
    },
  });

  const handleSubmit = methods.handleSubmit((data) => {
    console.log(data);
  });

  const router = useRouter();

  return (
    <Layout>
      <FormProvider {...methods}>
        <form className="max-md:px-4" onSubmit={handleSubmit}>
          <NewReadingContent key="new" type="text" onReturn={() => router.back()} />
        </form>
      </FormProvider>
    </Layout>
  );
}
