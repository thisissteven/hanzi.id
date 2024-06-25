-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_bookId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
