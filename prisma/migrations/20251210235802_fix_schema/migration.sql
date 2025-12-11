/*
  Warnings:

  - The values [RISCO,ALAGAMENTO,TRANSITO,RESGATE,VAZAMENTO] on the enum `TipoOcorrencia` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `entidadeId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `occurrences` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `occurrences` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `occurrences` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `occurrences` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `occurrences` table. All the data in the column will be lost.
  - The `fotos` column on the `occurrences` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `permissoes` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `system_config` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `statusAnterior` to the `occurrence_history` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `statusNovo` on the `occurrence_history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoOcorrencia_new" AS ENUM ('QUEDA_ARVORE', 'BLOQUEIO_VIA', 'ACIDENTE', 'ENCHENTE', 'DESLIZAMENTO', 'INCENDIO', 'VANDALISMO', 'ILUMINACAO', 'BURACO', 'OUTROS');
ALTER TABLE "occurrences" ALTER COLUMN "tipo" TYPE "TipoOcorrencia_new" USING ("tipo"::text::"TipoOcorrencia_new");
ALTER TYPE "TipoOcorrencia" RENAME TO "TipoOcorrencia_old";
ALTER TYPE "TipoOcorrencia_new" RENAME TO "TipoOcorrencia";
DROP TYPE "TipoOcorrencia_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_userId_fkey";

-- DropIndex
DROP INDEX "audit_logs_createdAt_idx";

-- DropIndex
DROP INDEX "audit_logs_userId_idx";

-- DropIndex
DROP INDEX "occurrence_history_occurrenceId_idx";

-- DropIndex
DROP INDEX "occurrences_dataOcorrencia_idx";

-- DropIndex
DROP INDEX "occurrences_latitude_longitude_idx";

-- DropIndex
DROP INDEX "occurrences_status_idx";

-- DropIndex
DROP INDEX "occurrences_tipo_idx";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "entidadeId",
ALTER COLUMN "detalhes" DROP NOT NULL,
ALTER COLUMN "detalhes" DROP DEFAULT;

-- AlterTable
ALTER TABLE "occurrence_history" DROP COLUMN "statusAnterior",
ADD COLUMN     "statusAnterior" TEXT NOT NULL,
DROP COLUMN "statusNovo",
ADD COLUMN     "statusNovo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "occurrences" DROP COLUMN "cidade",
DROP COLUMN "estado",
DROP COLUMN "metadata",
DROP COLUMN "observacoes",
DROP COLUMN "tags",
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL,
DROP COLUMN "fotos",
ADD COLUMN     "fotos" TEXT[];

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ATIVO',
DROP COLUMN "permissoes",
ADD COLUMN     "permissoes" TEXT[];

-- DropTable
DROP TABLE "system_config";
