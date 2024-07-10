import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '../../../lib/db';
import { generateFromEmail, generateUsername } from "unique-username-generator";
import { NextResponse } from 'next/server';


export async function GET() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if(!user || null || !user.id)
        throw new Error('エラーが発生しました。もう一度やり直してください。');

    let dbUser = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if(!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                id: user.id,
                email: user.email ?? "",
                firstName: user.given_name ?? "",
                lastName: user.family_name ?? "",
                imageUrl: user.picture,
                userName: generateUsername("-", 3, 15)
            }
        });
    }

    return NextResponse.redirect('http://localhost:3000');
}