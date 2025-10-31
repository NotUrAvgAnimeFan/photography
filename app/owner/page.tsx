'use client'

import { Card, CardContent} from "@/components/ui/card"
import Image  from "next/image";
import {baseURL, Collection} from "@/lib/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { NewCollectionButton } from "@/components/newCollection";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import Link from "next/link";



export default function OwnerPage() {

  const [collections, setCollections] = useState<Collection[]>([]);

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${baseURL}/collections`,
    headers: {}
  }

  let delConfig = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${baseURL}/collections/`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: ''
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.request(config);
        const fetched_collections: Collection[] = response.data as Collection[];
        setCollections(fetched_collections);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCollections();
  }, []);

  const handleDeleteCollection = async (collectionName: string) => {
    try {
      delConfig.data = JSON.stringify({
        "name": collectionName
      });
      const response = await axios.request(delConfig);
      console.log(response.data);
      setCollections(collections.filter((collection) => collection.name !== collectionName));
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="flex flex-col items-center p-8 w-full">
      <div className="flex justify-between items-center w-full sm:w-3/4 mb-8">
        <h1 className="text-3xl font-bold">My Collections</h1>
        <NewCollectionButton collections={collections} setCollections={setCollections}/>
      </div>
      <div className="w-full sm:w-3/4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {collections.map((collection) => (
          <ContextMenu key={collection.name}>
            <Link href={`/owner/${collection.name.replaceAll(' ', '_')}`}>
              <ContextMenuTrigger>
                <CardContent  className="bg-stone-200 rounded-lg hover:shadow">
                  <AspectRatio ratio={1/1}>
                    <Image src={collection.cover_photo} alt={`${collection.name} Collection`} fill className="object-contain"/>
                  </AspectRatio>
                  <div className="items-center pb-2 xl:pb-6 text-center">
                    <p className="text-sm 3xl:text-lg font-bold truncate px-2">{collection.name}</p>
                    <p className="text-xs 3xl:text-base">{collection.num_photos} Photos</p>
                  </div>
                </CardContent>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onSelect={() => handleDeleteCollection(collection.name)}>
                  Delete Collection
                </ContextMenuItem>
              </ContextMenuContent>
            </Link>
          </ContextMenu>
        ))}
      </div>
    </div>

  )
}