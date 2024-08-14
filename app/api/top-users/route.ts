import { getTopUsers } from "@/app/actions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'GET') {
        try {
            const topUsers = await getTopUsers();
            res.status(200).json(topUsers);
        } catch (error) {
            console.error('Error fetching top users:', error);
            res.status(500).json({ message: 'Internal server error' });
        } 
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}