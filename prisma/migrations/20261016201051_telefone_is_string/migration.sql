-- AlterTable
ALTER TABLE "User" ALTER COLUMN "telefone" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Vendedor" ALTER COLUMN "telefoneLoja" DROP DEFAULT,
ALTER COLUMN "telefoneLoja" SET DATA TYPE TEXT;
