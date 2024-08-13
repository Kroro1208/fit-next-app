"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Trophy, Star } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from 'next/link';

const topUsers = [
  { id: 1, name: "ユーザー1", score: 95, avatar: "/avatar1.jpg", rank: 1 },
  { id: 2, name: "ユーザー2", score: 90, avatar: "/avatar2.jpg", rank: 2 },
  { id: 3, name: "ユーザー3", score: 85, avatar: "/avatar3.jpg", rank: 3 },
  { id: 4, name: "ユーザー4", score: 80, avatar: "/avatar4.jpg", rank: 4 },
  { id: 5, name: "ユーザー5", score: 75, avatar: "/avatar5.jpg", rank: 5 },
];

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

export default function TopUsersClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" />
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
                        <AvatarImage src={user.avatar} alt={user.name} />
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
              <TooltipContent>
                <p>{user.name}の詳細を見る</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}