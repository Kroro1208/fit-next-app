import { Card } from "@/components/ui/card";
import Image from "next/image";
import Banner from "../public/banner.png"
import HomeImage from "../public/idea.png"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreatePostCard from "./components/CreatePostCard";
import prisma from "./lib/db";
import PostCard from "./components/PostCard";

async function getData() {
  const data = await prisma.post.findMany({
    select: {
      title: true,
      createdAt: true,
      textContent: true,
      id: true,
      imageString: true,
      User: {
        select: {
          userName: true,
        }
      },
      subName: true,
      Vote: {
        select: {
          userId: true,
          voteType: true,
          postId: true,
        },
      },
    }
  });

  return data;
}

export default async function Home() {
  const data = await getData();
  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-4">
      <div className="w-[65%] flex flex-col gap-y-5">
        <CreatePostCard />
        {data.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            imageString={post.imageString}
            jsonContent={post.textContent}
            subName={post.subName as string}
            title={post.title}
            userName={post.User?.userName as string}
            voteCount={post.Vote.reduce((acc, vote) => {
              if(vote.voteType === 'UP') return acc + 1;
              if(vote.voteType === 'DOWN') return acc - 1;
              return acc;
            }, 0)}
          />
        ))}
      </div>
      <div className="w-[35%]">
        <Card className="mt-5">
          <Image src={Banner} alt="banner" className="rounded-lg"/>
          <div className="p-2">
            <div className="flex items-center">
              <Image src={HomeImage} alt="homeImage" className="w-20 h-20 -mt-6"/>
              <h1 className="font-medium pl-5">Home</h1>
            </div>
            <p className="text-sm text-muted-foreground pt-2">あなたのコミュニティページです</p>
            <Separator className="my-5"/>
            <div className="flex flex-col gap-y-3">
              <Button variant="secondary">
                <Link href="/fit/naoya/create">経験を投稿する</Link>
              </Button>
              <Button asChild>
                <Link href="/fit/create">コミュニティを作る</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
