'use client'

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { baseURL, ImageType } from "@/lib/types"
import axios from "axios"
import { use, useEffect, useState } from "react"
import Image from 'next/image'

export default function CollectionImages({
  params,
}: {
  params: Promise<{collection: string}>
}) {
  const {collection} = use(params)
  const collectionName = collection.replaceAll('_', ' ')

  const [images, setImages] = useState<ImageType[]>([]);

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${baseURL}/photos/${collection}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.request(config);
        const photos: ImageType[] = response.data as ImageType[];
        setImages(photos);
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, [])

  return (
    <div className="relative flex flex-col items-center p-4 w-full">
      <div className="text-xl md:text-2xl lg:text-4xl font-bold pt-2 pb-4">
        "{collectionName}"
      </div>
      <div className="w-full xl:w-5/6 3xl:w-3/4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 3xl:grid-cols-6 gap-4">
        {images.map((image) => (
          <AspectRatio key={image.name} ratio={1/1} className="bg-stone-300 hover:shadow-lg">
            <Image src={image.url} alt={`${image.name} photo`} fill className="object-contain p-2" quality={100} />
          </AspectRatio>
        ))}
      </div>
    </div>
  )


}