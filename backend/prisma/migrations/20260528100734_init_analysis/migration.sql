-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "inputText" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "userStories" JSONB NOT NULL,
    "technicalTasks" JSONB NOT NULL,
    "risks" JSONB NOT NULL,
    "questions" JSONB NOT NULL,
    "requestDurationMs" INTEGER,
    "estimatedTokens" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);
