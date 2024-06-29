-- CreateTable
CREATE TABLE "Suggestions" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suggestions_pkey" PRIMARY KEY ("id")
);
