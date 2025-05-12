/*
  Warnings:

  - Added the required column `companyName` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "applicationEmail" TEXT,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "jobType" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "salaryCurrency" TEXT;
