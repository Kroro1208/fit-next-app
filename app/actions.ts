"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "./lib/db";
import { Prisma, TypeOfVote } from "@prisma/client";
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
    { jsonString }: { jsonString: string | null },
    formData: FormData
    ) {
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        if (!user) {
            return { error: 'ログインが必要です。' };
        }
        
        const title = formData.get('title') as string;
        const imageUrl = formData.get('imageUrl') as string | null;
        const subName = formData.get('subName') as string;

        // バリデーション
        if (!title || title.trim() === '') {
            return { error: 'タイトルは必須です。' };
        }

        if (!subName || subName.trim() === '') {
            return { error: 'サブカテゴリは必須です。' };
        }

        // jsonStringの詳細なチェック
        if (!jsonString) {
            return { error: '投稿内容は必須です。' };
        }

        try {
            const contentObj = JSON.parse(jsonString);
            if (!contentObj.content || contentObj.content.length === 0) {
                return { error: '投稿内容は必須です。' };
            }

            // TipTapの空の段落のみの場合をチェック
            const hasNonEmptyContent = contentObj.content.some((node: any) => 
                node.type !== 'paragraph' || 
                (node.content && node.content.some((textNode: any) => textNode.text.trim() !== ''))
            );

            if (!hasNonEmptyContent) {
                return { error: '投稿内容は必須です。' };
            }

            const data = await prisma.post.create({
                data: {
                    title: title.trim(),
                    imageString: imageUrl ? imageUrl.trim() : undefined,
                    subName: subName.trim(),
                    userId: user.id,
                    textContent: jsonString,
                }
            });

            return { success: true, postId: data.id };
        } catch (error) {
            console.error('投稿の作成中にエラーが発生しました:', error);
            return { error: '投稿の作成に失敗しました。後でもう一度お試しください。' };
        }
    }

export async function handleVote(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect('/api/auth/login');
    }

    const postId = formData.get('postId') as string;
    const voteDirection = formData.get('voteDirection') as TypeOfVote;

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            upVoteCount: true,
            downVoteCount: true,
            userId: true,
            shareLinkVisible: true,
        }
    });

    if (!post) {
        throw new Error('投稿が存在しません');
    }

    let { upVoteCount, downVoteCount } = post;

    const existingVote = await prisma.vote.findFirst({
        where: {
            postId: postId,
            userId: user.id,
        }
    });

    if (existingVote) {
        // 既存の投票がある場合
        if (existingVote.voteType === voteDirection) {
            // 同じ方向の投票をしたので、投票を取り消す
            await prisma.vote.delete({ where: { id: existingVote.id } });
            if (voteDirection === 'UP') {
                upVoteCount--;
            } else {
                downVoteCount--;
            }
        } else {
            // 異なる方向の投票なので、投票を更新する
            await prisma.vote.update({
                where: { id: existingVote.id },
                data: { voteType: voteDirection }
            });
            if (voteDirection === 'UP') {
                upVoteCount++;
                downVoteCount--;
            } else {
                upVoteCount--;
                downVoteCount++;
            }
        }
    } else {
        // 新しい投票を作成する
        await prisma.vote.create({
            data: {
                voteType: voteDirection,
                userId: user.id,
                postId: postId
            }
        });
        if (voteDirection === 'UP') {
            upVoteCount++;
        } else {
            downVoteCount++;
        }
    }

    const totalVotes = upVoteCount + downVoteCount;
    const trustScore = totalVotes > 0 ? (upVoteCount / totalVotes) * 100 : 50;

    await prisma.post.update({
        where: { id: postId },
        data: {
            upVoteCount,
            downVoteCount,
            trustScore
        }
    });

    if (upVoteCount >= 50 && !post.shareLinkVisible) {
        await prisma.post.update({
            where: { id: postId },
            data: { shareLinkVisible: true }
        });

        await prisma.notification.create({
            data: {
                userId: post.userId as string,
                postId: postId,
                message: 'あなたの投稿が50件以上のUP投票を獲得し、共有リンクが表示されるようになりました!'
            }
        });
    }

    revalidatePath("/");
}

export async function createComment(formData: FormData){
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if(!user) return redirect('/api/auth/login');

    const comment = formData.get('comment') as string;
    const postId = formData.get('postId') as string;
    const data = await prisma.comment.create({
        data: {
            text: comment,
            userId: user.id,
            postId: postId
        }
    });

    revalidatePath(`{/post/${postId}}`);

    return data;
}

export interface Notification {
    id: string;
    message: string;
    createdAt: Date;
}

export async function getNotifications(): Promise<Notification[]> {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if(!user || !user.id) return [];

    const notifications = await prisma.notification.findMany({
        where: {
            userId: user.id,
            read: false
        },
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            message: true,
            createdAt: true,
        }
    });

    //既読マークつける
    await prisma.notification.updateMany({
        where: {
            userId: user.id,
            read: false
        },
        data: {
            read: true
        }
    });

    return notifications;
}

export async function getUserInfo(userId: string) {
    const { getUser } = getKindeServerSession();
    const currentUser = await getUser();

    if (!currentUser || !currentUser.id) return null;

    const dbUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            userName: true,
            imageUrl: true,
            _count: {
                select: {
                    posts: true,
                    Comment: true,
                    followers: true,
                    following: true
                }
            }
        }
    });
    if (!dbUser) return null;

    return {
        id: dbUser.id,
        userName: dbUser.userName || '未設定',
        imageUrl: dbUser.imageUrl,
        postCount: dbUser._count.posts,
        commentCount: dbUser._count.Comment,
        followerCount: dbUser._count.followers,
        followingCount: dbUser._count.following
    };
}

export async function followUser(userId: string) {
    const { getUser } = getKindeServerSession();
    const currentUser = await getUser();
    
    if (!currentUser || !currentUser.id) {
        throw new Error('認証が必要です');
    }

    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUser.id,
                followingId: userId
            }
        }
    });

    if (existingFollow) {
        await prisma.follow.delete({
            where: {
                id: existingFollow.id
            }
        });
        return {
            action: 'unfollow'
        };
    } else {
        await prisma.follow.create({
            data: {
                followerId: currentUser.id,
                followingId: userId
            }
        });
        return {
            action: 'follow'
        };
    }
}