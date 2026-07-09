/*
  Warnings:

  - You are about to drop the column `reviewedBy` on the `access_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "access_requests" DROP COLUMN "reviewedBy",
ADD COLUMN     "approvedRole" TEXT,
ADD COLUMN     "reviewedByUserId" TEXT;
