"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Trophy, Star } from "lucide-react";
import { 
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from 'next/link';

interface TopUser {
  id: string;
  name: string;
  avatar: string | null;
  score: number;
  rank: number;
}

interface TopUsersClientProps {
  initialTopUsers: TopUser[];
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Trophy className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Trophy className="w-6 h-6 text-amber-600" />;
    default:
      return <Star className="w-6 h-6 text-blue-500" />;
  }
};

export default function TopUsersClient({initialTopUsers}: TopUsersClientProps) {
  const [topUsers, setTopUsers] = useState<TopUser[]>(initialTopUsers);

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          優良ユーザーランキング
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          {topUsers.map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <Link href={`/user/${user.id}`}>
                  <div className="flex items-center mb-4 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <div className="mr-4 relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                        <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -left-2">
                        {getRankIcon(user.rank)}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">スコア: {user.score}</p>
                    </div>
                  <div className="text-2xl font-bold text-blue-500">#{user.rank}</div>
                  </div>
                </Link>
              </TooltipTrigger>
            </Tooltip>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}