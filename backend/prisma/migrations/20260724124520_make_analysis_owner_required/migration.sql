/*
  Warnings:

  - Made the column `keycloakUserId` on table `analyses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "analyses" ALTER COLUMN "keycloakUserId" SET NOT NULL;
