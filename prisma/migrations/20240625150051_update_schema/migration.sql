/*
  Warnings:

  - Made the column `estimatedReadingTime` on table `Chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `wordCount` on table `Chapter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "totalSentences" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "estimatedReadingTime" SET NOT NULL,
ALTER COLUMN "wordCount" SET NOT NULL;
