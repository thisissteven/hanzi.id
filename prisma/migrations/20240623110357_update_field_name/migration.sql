/*
  Warnings:

  - You are about to drop the column `characterCount` on the `Chapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "characterCount",
ADD COLUMN     "wordCount" INTEGER DEFAULT 0;
