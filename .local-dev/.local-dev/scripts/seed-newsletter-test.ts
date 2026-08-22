import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const subscribers = [
    { email: "test1@example.com", locale: "pl", discountCode: "NEWSLETTER26" },
    { email: "test2@example.de", locale: "de", discountCode: "NEWSLETTER26" },
    { email: "test3@example.com", locale: "en", discountCode: "NEWSLETTER26" },
    { email: "bot@test.com", locale: "pl", discountCode: "NEWSLETTER26" },
  ];

  for (const sub of subscribers) {
    await prisma.newsletterSubscriber.upsert({
      where: { email: sub.email },
      update: {},
      create: sub,
    });
  }
  
  console.log(`Created ${subscribers.length} sample newsletter subscribers.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
