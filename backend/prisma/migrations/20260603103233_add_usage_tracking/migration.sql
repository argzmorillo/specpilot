/*
  Warnings:

  - You are about to drop the `Analysis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Analysis";

-- CreateTable
CREATE TABLE "analyses" (
    "id" TEXT NOT NULL,
    "inputText" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "userStories" JSONB NOT NULL,
    "technicalTasks" JSONB NOT NULL,
    "risks" JSONB NOT NULL,
    "questions" JSONB NOT NULL,
    "requestDurationMs" INTEGER,
    "estimatedTokens" INTEGER,
    "promptTokens" INTEGER,
    "totalTokens" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "model" TEXT,
    "metadata" JSONB,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);
