import React from 'react'
import prisma from '../lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import SetttingsForm from '../components/SetttingsForm';

async function getData(userId: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: userId
        }, select: {
          id: true,
          userName: true,
          imageUrl: true
        }
    });

    return data;
}

const SettingsPage = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if(!user) {
        return redirect("/api/auth/login");
    }

    const data = await getData(user.id);
    const userId = data?.id ?? null;
    const userName = data?.userName ?? null;
    const imageUrl = data?.imageUrl ?? null;

  return (
    <div className='max-w-[1000px] mx-auto flex flex-col mt-4'>
      <SetttingsForm username={userName} imageUrl={imageUrl} userId={userId}/>
    </div>
  )
}

export default SettingsPage
