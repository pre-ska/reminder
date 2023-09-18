import { currentUser } from "@clerk/nextjs";
import { Suspense } from "react";

import { wait } from "@/lib/wait";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SadFace from "@/components/icons/SadFace";
import CreateCollectionBtn from "@/components/CreateCollectionBtn";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomeMsg />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <CollectionList />
      </Suspense>
    </>
  );
}

async function WelcomeMsg() {
  const user = await currentUser();

  await wait(3000);

  if (!user) {
    return <div>Error. No user.</div>;
  }

  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        Welcome, <br />
        <div className="capitalize">{user?.lastName}</div>
      </h1>
    </div>
  );
}

function WelcomeMsgFallback() {
  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        <Skeleton className="w-[150px] h-[36px]" />
        <Skeleton className="w-[150px] h-[36px]" />
      </h1>
    </div>
  );
}

async function CollectionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    where: {
      userId: user?.id,
    },
  });

  if (collections.length === 0) {
    return (
      <div className="flex flex-col gap-5 mt-4">
        <Alert>
          <SadFace />
          <AlertTitle>No connections yet</AlertTitle>
          <AlertDescription>Create a collection to get started</AlertDescription>
        </Alert>
        <CreateCollectionBtn />
      </div>
    );
  }
}
