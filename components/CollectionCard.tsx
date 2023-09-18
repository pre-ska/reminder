"use client";
import { Collection } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { CaretDownIcon, CaretUpIcon, TrashIcon } from "@radix-ui/react-icons";
import { Separator } from "./ui/separator";

import { useRouter } from "next/navigation";
import { Progress } from "./ui/progress";
import PlusIcon from "./icons/PlusIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { deleteCollection } from "@/actions/collection";
import { toast } from "./ui/use-toast";

interface Props {
  collection: Collection & {
    tasks: {}[];
  };
}

function CollectionCard({ collection }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [isLoading, startTransition] = useTransition();

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);

      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });

      router.refresh();
    } catch (e) {
      toast({
        title: "Error",
        description: "Cannot delete collection",
        variant: "destructive",
      });
    }
  };

  const isPowder = collection.color === "powder";

  const tasks = [1, 2];

  const progress = 20;

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "flex w-full justify-between p-6",
              isOpen && "rounded-b-none",
              CollectionColors[collection.color as CollectionColor]
            )}
          >
            <span className={cn("text-white font-bold", isPowder && "text-black")}>
              {collection.name}
            </span>
            {!isOpen && <CaretDownIcon className={cn("h-6 w-6", isPowder && "text-black")} />}
            {isOpen && <CaretUpIcon className={cn("h-6 w-6", isPowder && "text-black")} />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg">
          {tasks.length === 0 && (
            <Button
              variant={"ghost"}
              className="flex items-center justify-center gap-1 p-8 py-12 rounded-none"
              // onClick={() => setShowCreateModal(true)}
            >
              <p>There are no tasks yet:</p>
              <span
                className={cn(
                  "text-sm bg-clip-text text-transparent",
                  CollectionColors[collection.color as CollectionColor]
                )}
              >
                Create one
              </span>
            </Button>
          )}

          {tasks.length > 0 && (
            <>
              <Progress className="rounded-none" value={progress} />
              <div className="p-4 gap-3 flex flex-col">{tasks.map((task) => "aaaa")}</div>
            </>
          )}

          <Separator />

          <footer className="h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center ">
            <p>Created at {collection.createdAt.toLocaleDateString("en-US")}</p>
            {isLoading ? (
              <div>Deleting...</div>
            ) : (
              <div>
                <Button size={"icon"} variant={"ghost"} onClick={() => setShowCreateModal(true)}>
                  <PlusIcon />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={"icon"} variant={"ghost"}>
                      <TrashIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your collection and
                      all tasks inside it.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          startTransition(removeCollection);
                        }}
                      >
                        Proceed
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}

export default CollectionCard;
