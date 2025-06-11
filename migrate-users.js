import { PrismaClient } from "@prisma/client";
import { auth } from "./src/lib/firebase-admin";

const prisma = new PrismaClient();

async function migrateFirebaseUsersToPrisma() {
  let nextPageToken = undefined;
  let createdCount = 0;
  let updatedCount = 0;
  do {
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    for (const firebaseUser of listUsersResult.users) {
      const { uid, email, displayName } = firebaseUser;
      if (!email) continue; // skip users without email

      // Check if user exists in Prisma
      const existingUser = await prisma.user.findUnique({ where: { id: uid } });
      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: uid,
            email,
            name: displayName || null,
            role: "USER", // or "ADMIN" if you want to set admins manually
          },
        });
        createdCount++;
        console.log(`Created user: ${email} (${uid})`);
      } else {
        // Optionally update name/email if changed in Firebase
        if (existingUser.email !== email || existingUser.name !== displayName) {
          await prisma.user.update({
            where: { id: uid },
            data: {
              email,
              name: displayName || null,
            },
          });
          updatedCount++;
          console.log(`Updated user: ${email} (${uid})`);
        }
      }
    }
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);

  await prisma.$disconnect();
  console.log(
    `Migration complete! Created ${createdCount} new users, updated ${updatedCount} users.`
  );
}

migrateFirebaseUsersToPrisma();
