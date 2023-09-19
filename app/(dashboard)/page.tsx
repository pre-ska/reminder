import { currentUser } from "@clerk/nextjs";
import { Suspense } from "react";

import { wait } from "@/lib/wait";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SadFace from "@/components/icons/SadFace";
import CreateCollectionBtn from "@/components/CreateCollectionBtn";
import CollectionCard from "@/components/CollectionCard";
import { createCollection, deleteCollection } from "@/actions/collection";

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
        <div className="capitalize">Welcome {user?.firstName}!</div>
      </h1>
    </div>
  );
}

function WelcomeMsgFallback() {
  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold flex gap-3">
        <Skeleton className="w-[150px] h-[36px] mb-2" />
        <Skeleton className="w-[150px] h-[36px]" />
      </h1>
    </div>
  );
}

async function CollectionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    include: {
      tasks: true,
    },
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
        <CreateCollectionBtn createCollection={createCollection} />
      </div>
    );
  }

  return (
    <>
      <CreateCollectionBtn createCollection={createCollection} />
      <div className="flex flex-col gap-4 mt-6">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            deleteCollection={deleteCollection}
          />
        ))}
      </div>
    </>
  );
}
