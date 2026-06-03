/*
  Warnings:

  - You are about to drop the column `estimatedTokens` on the `analyses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "analyses" DROP COLUMN "estimatedTokens",
ADD COLUMN     "completionTokens" INTEGER;
