import { Layout } from "@/modules/layout";
import { NewReading, NewReadingOnboarding, NewReadingProps, ReadingType } from "@/modules/new";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function New() {
  const [readingType, setReadingType] = React.useState<ReadingType | null>();

  const methods = useForm<NewReadingProps>({
    defaultValues: {
      title: "",
      description: "",
      content: [],
      image: null,
    },
  });

  const handleSubmit = methods.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8 pb-8">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-4 pb-4 border-b-[1.5px] border-b-subtle">
            <h1 className="text-2xl md:text-3xl font-bold">New Reading</h1>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit} className="max-md:px-4">
              <AnimatePresence mode="wait" initial={false}>
                {readingType ? (
                  <NewReading key="new" type={readingType} onReturn={() => setReadingType(null)} />
                ) : (
                  <NewReadingOnboarding onSelected={(type) => setReadingType(type)} />
                )}
              </AnimatePresence>
            </form>
          </FormProvider>
        </main>
      </div>
    </Layout>
  );
}
