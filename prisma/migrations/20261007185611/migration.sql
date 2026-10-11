/*
  Warnings:

  - You are about to drop the column `cep_loja` on the `Vendedor` table. All the data in the column will be lost.
  - You are about to drop the column `nome_da_loja` on the `Vendedor` table. All the data in the column will be lost.
  - Added the required column `cepLoja` to the `Vendedor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeLoja` to the `Vendedor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vendedor" DROP COLUMN "cep_loja",
DROP COLUMN "nome_da_loja",
ADD COLUMN     "cepLoja" TEXT NOT NULL,
ADD COLUMN     "nomeLoja" TEXT NOT NULL;
