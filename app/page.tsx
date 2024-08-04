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
import { Suspense } from "react";
import SuspenseCard from "./components/SuspenseCard";
import Pagination from "./components/Pagination";
import UserInfoCard from "./components/UserInfo";

async function getData(searchParam: string) {
  const [count, data] = await prisma.$transaction([
    prisma.post.count(),
    prisma.post.findMany({
      take: 10,
      skip: searchParam ? (Number(searchParam) - 1) * 10 : 0,
      select: {
        id: true,
        title: true,
        createdAt: true,
        textContent: true,
        imageString: true,
        upVoteCount: true,
        downVoteCount: true,
        trustScore: true,
        shareLinkVisible: true,
        Comment: {
          select: {
            id: true,
          }
        },
        User: {
          select: {
            userName: true,
          }
        },
        subName: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    })
  ]);

  return { data, count };
}

export default function Home({searchParams}: {searchParams: {page: string}}) {
  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-4 mb-10">
      <div className="w-[65%] flex flex-col gap-y-5">
        <CreatePostCard />
        <Suspense fallback={<SuspenseCard />} key={searchParams.page}>
          <ShowItems searchParams={searchParams}/>
        </Suspense>
      </div>
      <div className="w-[35%]">
        <Card className="mt-5">
          <Image src={Banner} alt="banner" className="rounded-lg"/>
          <div className="p-2">
            <div className="flex items-center">
              <Image src={HomeImage} alt="homeImage" className="w-20 h-20 -mt-6"/>
              <h1 className="font-medium pl-5">Home</h1>
            </div>
            <p className="text-sm text-center text-muted-foreground pt-2">信頼性のある情報に投票しましょう</p>
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
        <UserInfoCard />
      </div>
    </div>
  );
}

async function ShowItems({ searchParams }: { searchParams: { page: string } }) {
  const { count, data } = await getData(searchParams.page);
  return (
    <>
      {data.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          imageString={post.imageString}
          jsonContent={post.textContent}
          subName={post.subName as string}
          title={post.title}
          userName={post.User?.userName as string}
          commentAmount={post.Comment.length}
          upVoteCount={post.upVoteCount}
          downVoteCount={post.downVoteCount}
          trustScore={post.trustScore}
          shareLinkVisible={post.shareLinkVisible}
        />
      ))}
      <Pagination totalPages={Math.ceil(count / 10)} />
    </>
  );
}


