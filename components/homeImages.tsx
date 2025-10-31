'use client';

import { ImageType } from "@/lib/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from 'next/image'


export default function HomeImages({images}: {images: ImageType[]}) {
  if (!images) {
    return(
      <div>No Images found</div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl pt-6">Ricardo's Photography</h1>
      <div className="flex flex-col items-center p-8 w-full">
        <div className="w-3/4 lg:w-1/2 grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6">
          {images.map((image) => (
            <AspectRatio ratio={1/1} key={image.id} className="bg-stone-200 hover:shadow-lg">
              <Image src={image.url} alt={`${image.name} photo`} fill className="object-contain p-2" />
            </AspectRatio>
          ))}
        </div>
      </div>
    </div>

  );
}