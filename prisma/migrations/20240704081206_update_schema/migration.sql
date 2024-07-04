-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "descriptionId" TEXT NOT NULL DEFAULT 'Belum ada deskripsi.',
ADD COLUMN     "titleTraditional" TEXT NOT NULL DEFAULT 'Untitled';

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "titleTraditional" TEXT NOT NULL DEFAULT 'Untitled';
