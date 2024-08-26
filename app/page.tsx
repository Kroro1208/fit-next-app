import { Card } from "@/components/ui/card";
import Image from "next/image";
import Banner from "../public/banner.png"
import HomeImage from "../public/idea.png"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreatePostCard from "./components/CreatePostCard";
import { Suspense } from "react";
import SuspenseCard from "./components/SuspenseCard";
import Pagination from "./components/Pagination";
import UserInfoCard from "./components/UserInfo";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import FilterablePosts from "./components/FilterPosts";
import { getData } from "./actions";

export default async function Home({searchParams}: {searchParams: {page: string; search?: string}}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const { data, count, tags } = await getData(searchParams.page, searchParams.search);
  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-4 mb-10">
      <div className="w-[65%] flex flex-col gap-y-5">
        <CreatePostCard />
        <Suspense fallback={<SuspenseCard />} key={searchParams.page}>
          <FilterablePosts initialPosts={data} tags={tags} currentUserId={user?.id} />
        </Suspense>
        <Pagination totalPages={Math.ceil(count / 10)} />
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
                <Link href="/fit/naoya/create">記事を投稿する</Link>
              </Button>
              <Button asChild>
                <Link href="/fit/create">コミュニティを作る</Link>
              </Button>
            </div>
          </div>
        </Card>
        {user && <UserInfoCard userId={user.id} />}
      </div>
    </div>
  );
}