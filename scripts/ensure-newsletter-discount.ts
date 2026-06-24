import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const code = "NEWSLETTER26";
  const discount = await prisma.discountCode.findUnique({
    where: { code }
  });

  if (!discount) {
    await prisma.discountCode.create({
      data: {
        code,
        percentage: 15,
        description: "Rabat 15% za zapis do newslettera",
        isActive: true
      }
    });
    console.log(`Created discount code: ${code}`);
  } else {
    console.log(`Discount code ${code} already exists.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
