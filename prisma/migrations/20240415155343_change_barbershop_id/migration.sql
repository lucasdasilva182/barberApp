/*
  Warnings:

  - You are about to drop the column `babershopId` on the `Booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_babershopId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "babershopId",
ADD COLUMN     "barbershopId" TEXT;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
