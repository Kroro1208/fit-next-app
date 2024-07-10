import React from 'react'
import prisma from '../lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

async function getData(userId: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: userId
        }, select: {
            userName: true
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
  return (
    <div className='max-w-[1000px] mx-auto flex flex-col mt-4'>
      {data?.userName}
    </div>
  )
}

export default SettingsPage
