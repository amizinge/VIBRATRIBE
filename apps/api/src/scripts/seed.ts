import { prisma } from '../config/prisma';

async function main() {
  const user = await prisma.user.upsert({
    where: { walletAddress: '0xseeded0000000000000000000000000000000000' },
    update: {},
    create: {
      walletAddress: '0xseeded0000000000000000000000000000000000',
      profile: {
        create: {
          handle: '@seed',
          displayName: 'Seed User',
          bio: 'Seeder of vibes'
        }
      }
    },
    include: { profile: true }
  });

  await prisma.post.create({
    data: {
      body: 'Hello from the seed script',
      authorId: user.id,
      tags: ['hello']
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
