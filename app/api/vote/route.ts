import { type NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { TypeOfVote } from "@prisma/client";
import prisma from '../../lib/db';

export async function POST(req: NextRequest) {
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ message: '認証されていないユーザーです' }, { status: 401 });
        }

        const { postId, voteDirection } = await req.json();

        if (!postId || !voteDirection) {
            return NextResponse.json({ message: 'このポストには投票できません' }, { status: 400 });
        }

        const result = await handleVote(postId, voteDirection as TypeOfVote, user.id);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Vote error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

async function handleVote(postId: string, voteDirection: TypeOfVote, userId: string) {
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
            userId: userId,
        }
    });

    if (existingVote) {
        if (existingVote.voteType === voteDirection) {
            await prisma.vote.delete({ where: { id: existingVote.id } });
            if (voteDirection === 'UP') {
                upVoteCount--;
            } else {
                downVoteCount--;
            }
        } else {
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
        await prisma.vote.create({
            data: {
                voteType: voteDirection,
                userId: userId,
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

    const updatedPost = await prisma.post.update({
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

    if (post.userId && post.userId !== userId) {
        await prisma.notification.create({
            data: {
                userId: post.userId,
                postId: postId,
                type: voteDirection === 'UP' ? 'upvote' : 'downvote',
                message: `ユーザーがあなたの投稿に${voteDirection === 'UP' ? 'UP' : 'DOWN'}投票しました。`
            }
        });
    }

    return {
        upVoteCount: updatedPost.upVoteCount,
        downVoteCount: updatedPost.downVoteCount,
        trustScore: updatedPost.trustScore
    };
}