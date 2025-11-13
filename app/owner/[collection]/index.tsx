'use client';
import { use } from 'react'

import Image from 'next/image'
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { baseURL, ImageType } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import AddImages from '@/components/addImages';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import getToken from '../get_token';


export default function OwnerSingleCollection({
  params,
}: {
  params: Promise<{collection: string}>
}) {
  const {collection} = use(params)
  const collectionName = collection.replaceAll('_', ' ')

  const [token, setToken] = useState<string>("");
  const [images, setImages] = useState<ImageType[]>([]);


  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${baseURL}/photos/${collection}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  let delConfig = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${baseURL}/photos/`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: ''
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.request(config);
        const photos: ImageType[] = response.data as ImageType[];
        setImages(photos);

        const bearer = await getToken();
        if (bearer) {
          setToken(bearer);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, [])

  const handleDeleteImage = async(name: string) => {

    delConfig.data = JSON.stringify({
      "name": name,
      "collection": collectionName,
      "num_photos": images.length
    });

    try {
      const response = await axios.request(delConfig);
      console.log(response.data);
      setImages(images.filter((image) => image.name !== name));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative flex flex-col items-center p-4 w-full">
      <div className="text-xl md:text-2xl lg:text-4xl font-bold pt-2 pb-4">
        "{collectionName}"
      </div>
      <div className="w-full sm:w-3/4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {images.map((image) => (
          <ContextMenu key={image.id}>
            <ContextMenuTrigger>
              <AspectRatio ratio={1/1} className="bg-stone-300 hover:shadow-lg">
                <Image src={image.url} alt={`${image.name} photo`} fill className="object-contain p-2" quality={100}/>
              </AspectRatio>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onSelect={() => handleDeleteImage(image.name)}>
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
      ))}
    </div>
    <div className="fixed right-[6vw] sm:right-[4vw] bottom-[8vw]  sm:bottom-[4vw]">
      <AddImages token={token} collection={collection} images={images} setImages={setImages}/>
    </div>
  </div>
  )
}