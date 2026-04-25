-- AlterTable
ALTER TABLE "driverProfiles" ADD COLUMN     "updatedAt" TIMESTAMP;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "updatedAt" TIMESTAMP;

-- AlterTable
ALTER TABLE "userCredentials" ADD COLUMN     "updatedAt" TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updatedAt" TIMESTAMP;
