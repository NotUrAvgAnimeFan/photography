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
      <div className="flex flex-col justify-center items-center w-full sm:w-3/4 mb-8">
        <h1 className="sm:text-3xl font-bold">Ricardo's Photography Portfolio</h1>
        <p className="sm:text-xl mt-2">Click on the collections below to see more</p>
      </div>
      <div className="w-full xl:w-3/4 3xl:w-1/2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {collections.map((collection) => (
          <Link href={`/${collection.name.replaceAll(' ', '_')}`} key={collection.name} className="group cursor-pointer">
            <AspectRatio ratio={1/1} className="bg-black rounded-xs hover:shadow-xl">
              <Image src={collection.cover_photo} alt={`${collection.name} Collection`} fill className="object-contain p-2 transition-opacity duration-300 opacity-50 sm:opacity-100 group-hover:opacity-50"/>
              <div className="absolute inset-0 flex items-center justify-center text-white text-xs sm:text-xl font-bold opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {collection.name}
              </div>
            </AspectRatio>
          </Link>
        ))}
      </div>
    </div>
  )

}