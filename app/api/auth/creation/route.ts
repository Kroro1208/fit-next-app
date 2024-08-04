import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '../../../lib/db';
import { generateUsername } from "unique-username-generator";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user || !user.id) {
            throw new Error('ユーザー情報が取得できませんでした。');
        }

        let dbUser = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        });

        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email ?? "",
                    firstName: user.given_name ?? "",
                    lastName: user.family_name ?? "",
                    imageUrl: user.picture ?? "",
                    userName: generateUsername("-", 3, 15)
                }
            });
        }

        // リダイレクトURLの設定
        const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // リダイレクト
        return NextResponse.redirect(new URL(redirectUrl));
    } catch (error) {
        console.error('Auth creation error:', error);
        return NextResponse.json({ error: 'An error occurred during authentication.' }, { status: 500 });
    }
}