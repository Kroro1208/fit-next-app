"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "./lib/db";
import { Prisma } from "@prisma/client";

export async function updateUsername(prevState: any, formData: FormData){
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if(!user) {
        redirect('/api/auth/login');
    }

    const username = formData.get('username') as string;

    try {
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                userName: username
            }
        });
        return {
            message: 'ユーザー名が更新されました',
            status: 'success',
        };
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === "P2002") {
                return {
                    mmessage: 'このユーザー名はすでに使用されています',
                    status: 'false'
                }
            }
        }
        throw error;
    }
}

export const createCommunity = async (prevState: any, formData: FormData) => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if(!user) {
        return redirect('/api/auth/login');
    }

    try {
        const name = formData.get("name") as string;
        const data = await prisma.community.create({
            data: {
                name: name,
                userId: user.id,
            }
        });
        return redirect('/');
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            if(error.code === 'P2002'){
                return {
                    message: 'この名前はすでに使用されています',
                    status: 'error'
                }
            }
        }
        throw error;
    }
}