/*
  Warnings:

  - Added the required column `passwordHash` to the `driverApplications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "driverApplications" ADD COLUMN     "passwordHash" VARCHAR(512) NOT NULL;
