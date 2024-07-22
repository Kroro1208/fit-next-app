import { Card } from "@/components/ui/card";
import Image from "next/image";
import Banner from "../public/banner.png"
import HomeImage from "../public/idea.png"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreatePostCard from "./components/CreatePostCard";
import prisma from "./lib/db";

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
      subName: true
    }
  });
}

export default function Home() {
  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt4">
      <div className="w-[65%] flex flex-col gap-y-5">
        <CreatePostCard />
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
