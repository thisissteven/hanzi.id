/*
  Warnings:

  - Made the column `title` on table `Book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `Chapter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "content" SET NOT NULL;
