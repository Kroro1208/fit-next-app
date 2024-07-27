"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "./lib/db";
import { Prisma, TypeOfVote } from "@prisma/client";
import { JSONContent } from '@tiptap/react';
import { revalidatePath } from "next/cache";

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
        return redirect(`/fit/${data.name}`);
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

export async function updateSubDescription(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = getUser();
    if(!user) {
        return redirect('/api/auth/login');
    }

    try {
        const subName = formData.get('subName') as string;
        const description = formData.get('description') as string;
    
        await prisma.community.update({
            where: {
                name: subName,
            },
            data: {
                description: description
            }
        });
        
        return {
            status: 'green',
            message: '説明が更新されました'
        };
    } catch (error) {
        return {
            status: 'error',
            message: '更新に失敗しました'
        }
    };
}

export async function createPost(
    { jsonContent }: {jsonContent: JSONContent | null},
        formData: FormData
    ){
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if(!user) {
        return redirect('/api/auth/login');
    }
    
    const title = formData.get('title') as string;
    const imageUrl = formData.get('imageUrl') as string | null;
    const subName = formData.get('subName') as string;

    await prisma.post.create({
        data: {
            title,
            imageString: imageUrl ?? undefined,
            subName,
            userId: user.id,
            textContent: jsonContent ?? undefined,
        }
    });

    return redirect('/');
}

export async function handleVote(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect('/api/auth/login');
    }

    // どの投稿に投票するか
    const postId = formData.get('postId') as string;
    const voteDirection = formData.get('voteDirection') as TypeOfVote;

    const vote = await prisma.vote.findFirst({
        where: {
            postId: postId,
            userId: user.id,
        }
    });

    if(vote) {
        if(vote.voteType === voteDirection) {
            await prisma.vote.delete({
                where: {
                    id: vote.id
                }
            });
            return revalidatePath("/");
        } else {
            await prisma.vote.update({
                where: {
                    id: vote.id,
                },
                data: {
                    voteType: voteDirection
                }
            });
            return revalidatePath("/");
        }
    }

    await prisma.vote.create({
        data: {
            voteType: voteDirection,
            userId: user.id,
            postId: postId
        }
    });
    return revalidatePath("/");
}
