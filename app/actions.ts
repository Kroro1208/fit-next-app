"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Prisma, PrismaClient, type TypeOfVote, Comment } from '@prisma/client';
import { revalidatePath } from "next/cache";
import type { ActionState, UserProfileState } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function updateUserProfile(prevState: UserProfileState, formData: FormData): Promise<UserProfileState> {
    const supabase = createServerComponentClient({ cookies });
    
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user) {
            return { message: 'ユーザーが見つかりません', status: 'error' };
        }

        const username = formData.get('username') as string;
        const imageFile = formData.get('image') as File | null;

        console.log("Username:", username);
        console.log("User ID:", user.id);

        // バケットの存在確認
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (bucketError || !buckets.some(b => b.name === 'avatars')) {
            console.error('Bucket check failed:', bucketError || 'avatars bucket not found');
            return {
                message: 'ストレージ設定エラー: 管理者に連絡してください',
                status: 'error',
            };
        }

        // 権限チェック
        const { data: permissions, error: permissionError } = await supabase.rpc('check_storage_permissions', {
            bucket: 'avatars'
        });

        if (permissionError || !permissions) {
            console.error('Permission check failed:', permissionError);
            return {
                message: 'ストレージ権限エラー: 管理者に連絡してください',
                status: 'error',
            };
        }

        let imageUrl = null;

        if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${user.id}_${Date.now()}.${fileExt}`;

            console.log("File name:", fileName);

            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(fileName, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Image upload error:', JSON.stringify(error, null, 2));
                console.error('User context:', JSON.stringify({
                    userId: user.id,
                    fileName,
                    fileSize: imageFile.size,
                    mimeType: imageFile.type
                }, null, 2));
                return {
                    message: `画像アップロードエラー: ${error.message}`,
                    status: 'error',
                };
            }

            if (!data) {
                return {
                    message: 'アップロードデータが見つかりません',
                    status: 'error',
                };
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(data.path);

            imageUrl = publicUrl;
            console.log("Image uploaded, new URL:", imageUrl);
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                userName: username,
                imageUrl: imageUrl || undefined,
            },
        });

        console.log("User profile updated:", updatedUser);
        revalidatePath('/settings');
        return {
            message: 'プロフィールが更新されました',
            status: 'success',
        };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return {
            message: `エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
            status: 'error',
        };
    }
}



export const createCommunity = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
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

interface SubDescriptionState {
    status?: 'green' | 'error';
    message?: string;
}

export async function updateSubDescription(prevState: SubDescriptionState, formData: FormData): Promise<SubDescriptionState> {
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
    }
}

const prisma = new PrismaClient();

interface TipTapNodeAttrs {
  level?: number;
  href?: string;
}

interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  attrs?: TipTapNodeAttrs;
  text?: string;
}

interface TipTapContent {
  type: 'doc';
  content: TipTapNode[];
}

interface CreatePostResult {
  error?: string;
  success?: boolean;
  postId?: string;
}

export async function createPost(
  { jsonString, tags }: { jsonString: string | null; tags: string[] },
  formData: FormData
): Promise<CreatePostResult> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return { error: 'ログインが必要です。' };
  }
        
  const title = formData.get('title') as string | null;
  const imageUrl = formData.get('imageUrl') as string | null;
  const subName = formData.get('subName') as string | null;

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
    const contentObj: TipTapContent = JSON.parse(jsonString);
    if (!contentObj.content || contentObj.content.length === 0) {
      return { error: '投稿内容は必須です。' };
    }

    // TipTapの空の段落のみの場合をチェック
    const hasNonEmptyContent = contentObj.content.some((node: TipTapNode) => 
        node.type !== 'paragraph' || 
        node.content?.some((childNode: TipTapNode) => 
          childNode.type === 'text' && childNode.text?.trim() !== ''
        )
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
        tags: {
          connect: tags.map(tagId => ({ id: tagId }))
        }
      }
    });

    return { success: true, postId: data.id };
  } catch (error) {
    console.error('投稿の作成中にエラーが発生しました:', error);
    return { error: '投稿の作成に失敗しました。コミュニティは作成されましたか？' };
  }
}

export async function createTag(name: string) {
    const tag = await prisma.tag.create({
        data: { name }
    });
    return tag;
}

export async function getTags() {
    const tags = await prisma.tag.findMany({
        orderBy: {
            name: 'asc'
        }
    });
    return tags;
}

export async function getFilteredPosts(tagId?: string) {
    const posts = await prisma.post.findMany({
        where: tagId ? {
        tags: {
            some: { id: tagId }
        }
        } : {},
        include: {
        tags: true,
        User: {
            select: {
            id: true,
            userName: true,
            }
        },
        comments: {
            select: {
            id: true,
            }
        },
        },
        orderBy: { createdAt: 'desc' },
    });

    return posts;
}

export async function deletePost(postId: string) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
        throw new Error('認証が必要です');
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
        select: {
            userId: true
        }
    });

    if (!post) throw new Error('投稿が見つかりません');
    if (post.userId !== user.id) {
        throw new Error('この投稿を削除する権限はありません');
    }

    // トランザクションを使用して、投稿とそれに関連するコメントを削除
    await prisma.$transaction(async (tx) => {
        await tx.notification.deleteMany({
            where: {
                postId
            }
        });
        await tx.vote.deleteMany({
            where: {
                postId
            }
        });
        await tx.bookmark.deleteMany({
            where: {
                postId
            }
        });
        await tx.comment.deleteMany({
            where: {
                postId: postId
            }
        });
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                tags: {
                    set: []
                }
            }
        });

        // 次に、投稿自体を削除
        await tx.post.delete({
            where: {
                id: postId
            }
        });
    });

    revalidatePath("/");
    return { success: true, message: '投稿と関連する全てのデータが削除されました' };
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
                type: 'vote_milestone',
                message: 'あなたの投稿が50件以上のUP投票を獲得し、共有リンクが表示されるようになりました!'
            }
        });
    }

    if (post.userId && post.userId !== user.id) {
        await prisma.notification.create({
            data: {
                userId: post.userId,
                postId: postId,
                type: voteDirection === 'UP' ? 'upvote' : 'downvote',
                message: `${user.given_name || 'ユーザー'} があなたの投稿に${voteDirection === 'UP' ? 'UP' : 'DOWN'}投票しました。`
            }
        });
    }

    revalidatePath("/");

    return {
        upVoteCount,
        downVoteCount,
        trustScore
    };
}

export async function createComment(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) return redirect('/api/auth/login');

    const comment = formData.get('comment') as string;
    const postId = formData.get('postId') as string;
    
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true }
    });

    const newComment = await prisma.comment.create({
        data: {
            text: comment,
            userId: user.id,
            postId: postId
        }
    });

    // 投稿が存在し、投稿者が現在のユーザーでない場合のみ通知を作成
    if (post?.userId && post.userId !== user.id) {
        await prisma.notification.create({
            data: {
                userId: post.userId,
                postId: postId,
                commentId: newComment.id,
                type: 'comment',
                message: `${user.given_name || 'ユーザー'} があなたの投稿にコメントしました。`
            }
        });
    }

    revalidatePath(`/post/${postId}`);
    return newComment;
}

export interface Notification {
    id: string;
    message: string;
    createdAt: Date;
    type: string;
    postTitle?: string;
    commentText?: string;
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
        include: {
            post: {
                select: {
                    title: true,
                }
            },
            comment: {
                select: {
                    text: true
                }
            }
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

    return notifications.map((notification) => ({
        id: notification.id,
        message: notification.message,
        createdAt: notification.createdAt,
        type: notification.type,
        postTitle: notification.post?.title,
        commentText: notification.comment?.text
    }));
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
    }

    const newFollow = await prisma.follow.create({
        data: {
            followerId: currentUser.id,
            followingId: userId,
        }
    });

    await prisma.notification.create({
        data: {
            userId: userId,
            followId: newFollow.id,
            type: 'follow',
            message: `${currentUser.given_name}があなたをフォローしました`
        }
    });

    return {
        action: 'follow'
    };
}

export async function getUserCommunities(userId: string) {
    const communities = await prisma.community.findMany({
        where: {
            userId: userId
        },
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            posts: {
                select: {
                    id: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    return communities.map(community => ({
        ...community,
        postCount: community.posts.length,
        createdAt: community.createdAt.toISOString(),
        posts: undefined,
    }));
}

export async function toggleBookmark(postId: string) {
    const { getUser } = getKindeServerSession()
    const user = await getUser();
    if(!user) {
        throw new Error ('認証が必要です');
    }

    const existingBookmark = await prisma.bookmark.findUnique({
        where: {
            userId_postId: {
                userId: user.id,
                postId: postId
            }
        }
    });

    if(existingBookmark) {
        await prisma.bookmark.delete({
            where: {
                id: existingBookmark.id
            },
        });
        revalidatePath(`/post/${postId}`);
        return { action: "unbookmark" };
    }

    await prisma.bookmark.create({
        data: {
            userId: user.id,
            postId: postId
        }
    });
    revalidatePath(`/post/${postId}`);
    return { action: "bookmark" };
}

export async function getBookmarkedPosts(userId: string) {
    const bookmarkedPosts = await prisma.bookmark.findMany({
        where: {
            userId: userId,
        },
        include: {
            post: {
                include: {
                User: true,
                Community: true,
                comments: true,
                votes: {
                    where: {
                    userId: userId,
                    },
                },
                tags: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return bookmarkedPosts.map((bookmark) => ({
        ...bookmark.post,
        userName: bookmark.post.User?.userName || "Unknown",
        jsonContent: bookmark.post.textContent,
        commentAmount: bookmark.post.comments.length,
        userVote: bookmark.post.votes[0]?.voteType || null,
        isBookmarked: true,
        tags: bookmark.post.tags,
    }));
}

export async function isBookmarked(postId: string, userId: string): Promise<boolean> {
    const bookmark = await prisma.bookmark.findUnique({
        where: {
            userId_postId: {
            userId: userId,
            postId: postId,
            },
        },
    });
    return !!bookmark;
}

export async function getTopUsers(limit= 10) {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            userName: true,
            imageUrl: true,
            posts: {
                select: {
                    upVoteCount: true,
                    downVoteCount: true
                }
            }
        }
    });

    const userScore = users.map(user => {
        const totalPosts = user.posts.length;
        const goodPosts = user.posts.filter(post => 
        (post.upVoteCount / (post.upVoteCount + post.downVoteCount)) > 0.7 ).length;
        const score = totalPosts > 0 ? (goodPosts / totalPosts) *  100 : 0;

        return {
            id: user.id,
            name: user.userName || 'Unknown',
            avatar: user.imageUrl || '/user-avatar.png',
            score: Math.round(score)
        }
    });

    return userScore.sort((a, b) => b.score - a.score).slice(0, limit).map((user, index) => ({
        ...user, rank: index + 1
    }));
}