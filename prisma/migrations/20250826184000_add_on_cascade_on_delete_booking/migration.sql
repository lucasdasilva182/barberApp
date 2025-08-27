-- DropForeignKey
ALTER TABLE "BookingService" DROP CONSTRAINT "BookingService_bookingId_fkey";

-- AddForeignKey
ALTER TABLE "BookingService" ADD CONSTRAINT "BookingService_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
