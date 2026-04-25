-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('customer', 'driver', 'manager');

-- CreateEnum
CREATE TYPE "comfortLevel" AS ENUM ('economy', 'comfort', 'business');

-- CreateEnum
CREATE TYPE "orderStatus" AS ENUM ('searchingDriver', 'driverAssigned', 'inProgress', 'finished', 'canceled');

-- CreateEnum
CREATE TYPE "applicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "role" "userRole" NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driverProfiles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "comfortLevel" "comfortLevel",
    "driverLicense" VARCHAR(50) NOT NULL,

    CONSTRAINT "driverProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" SERIAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    "make" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "color" VARCHAR(50),
    "number" VARCHAR(20) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driverApplications" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "driverLicense" VARCHAR(50),
    "carMake" VARCHAR(100),
    "carModel" VARCHAR(100),
    "carColor" VARCHAR(50),
    "carNumber" VARCHAR(20),
    "comfortLevel" "comfortLevel",
    "status" "applicationStatus" NOT NULL DEFAULT 'pending',
    "comment" TEXT,
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP,
    "driverId" INTEGER,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "driverApplications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "driverId" INTEGER,
    "pickupAddress" VARCHAR(255) NOT NULL,
    "pickupLatitude" DECIMAL(10,8),
    "pickupLongitude" DECIMAL(11,8),
    "dropoffAddress" VARCHAR(255) NOT NULL,
    "dropoffLatitude" DECIMAL(10,8),
    "dropoffLongitude" DECIMAL(11,8),
    "comfortLevel" "comfortLevel" NOT NULL,
    "distanceMeters" INTEGER,
    "durationSec" INTEGER,
    "priceByn" DECIMAL(10,2),
    "status" "orderStatus" NOT NULL DEFAULT 'searchingDriver',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP,
    "finishedAt" TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userCredentials" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(512) NOT NULL,

    CONSTRAINT "userCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "driverProfiles_userId_key" ON "driverProfiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "cars_number_key" ON "cars"("number");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_orderId_key" ON "reviews"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "userCredentials_userId_key" ON "userCredentials"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "userCredentials_email_key" ON "userCredentials"("email");

-- AddForeignKey
ALTER TABLE "driverProfiles" ADD CONSTRAINT "driverProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "driverProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driverApplications" ADD CONSTRAINT "driverApplications_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driverApplications" ADD CONSTRAINT "driverApplications_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "driverProfiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "driverProfiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCredentials" ADD CONSTRAINT "userCredentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
