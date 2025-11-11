'use client'

import { baseURL, Collection } from "@/lib/types";
import axios from "axios";
import Link from "next/link";
import Image  from "next/image";
import { useEffect, useState } from "react";
import { CardContent } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";

export default function HomeCollection() {
  const [collections, setCollections] = useState<Collection[]>([]);

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${baseURL}/collections`,
    headers: {}
  }

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

  return (
    <div className="flex flex-col items-center p-8 w-full">
      <div className="flex justify-center items-center w-full sm:w-3/4 mb-8">
        <h1 className="text-3xl font-bold">Ricardo's Photography Portfolio</h1>
      </div>
      <div className="w-full sm:w-3/4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {collections.map((collection) => (
          <Link href={`/${collection.name.replaceAll(' ', '_')}`} key={collection.name}>
            <CardContent  className="bg-stone-200 rounded-lg hover:shadow-xl">
              <AspectRatio ratio={1/1}>
                <Image src={collection.cover_photo} alt={`${collection.name} Collection`} fill className="object-contain"/>
              </AspectRatio>
              <div className="items-center pb-2 xl:pb-6 text-center">
                <p className="text-sm 3xl:text-lg font-bold truncate px-2">{collection.name}</p>
                <p className="text-xs 3xl:text-base">{collection.num_photos} Photos</p>
              </div>
            </CardContent>
          </Link>
        ))}
      </div>
    </div>
  )

}