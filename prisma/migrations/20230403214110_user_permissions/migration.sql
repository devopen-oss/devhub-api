-- AlterTable
ALTER TABLE "users" ADD COLUMN     "permissions" INTEGER[] DEFAULT ARRAY[1]::INTEGER[];
