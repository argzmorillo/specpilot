-- AlterTable
ALTER TABLE "analyses" ADD COLUMN     "keycloakUserId" TEXT;

-- CreateIndex
CREATE INDEX "analyses_keycloakUserId_idx" ON "analyses"("keycloakUserId");

-- CreateIndex
CREATE INDEX "analyses_keycloakUserId_createdAt_idx" ON "analyses"("keycloakUserId", "createdAt");
