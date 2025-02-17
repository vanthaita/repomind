import { db } from '@/server/db';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';

const syncUserToDatabase = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not found');
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const emailAddress = user.emailAddresses[0]?.emailAddress;

  if (!emailAddress) {
    return notFound();
  }

  await db.user.upsert({
    where: {
      emailAddress: emailAddress ?? '',
    },
    update: {
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    create: {
      id: userId,
      emailAddress: emailAddress ?? '',
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  return redirect('/dashboard');
};

export default syncUserToDatabase;