'use client'

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { baseURL, ImageType } from "@/lib/types"
import axios from "axios"
import { use, useEffect, useLayoutEffect, useState } from "react"
import Image from 'next/image'
import {Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog';
import {ChevronLeft, ChevronRight, X, ImageDown} from 'lucide-react';
import Link from "next/link"
import {useSwipeable} from "react-swipeable";

export default function CollectionImages({
  params,
}: {
  params: Promise<{collection: string}>
}) {
  const {collection} = use(params)
  const collectionName = collection.replaceAll('_', ' ')
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const [images, setImages] = useState<ImageType[]>([]);



  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${baseURL}/photos/${collection}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };



  useLayoutEffect(() => {
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

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false
  });

  return (
    <>
      <div className="relative flex flex-col items-center p-4 w-full">
        <div className="text-xl md:text-2xl lg:text-4xl font-bold pt-2 pb-4">
          "{collectionName}"
        </div>
        <div className="w-full xl:w-5/6 3xl:w-3/4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 3xl:grid-cols-6 gap-4">
          {images.map((image, i) => (
            <AspectRatio key={image.name} ratio={1/1} className="bg-stone-300 hover:shadow-lg" onClick={() => {setIndex(i); setOpen(true);}}>
              <Image src={image.url} alt={`${image.name} photo`} fill className="object-contain p-2" quality={100}/>
            </AspectRatio>
          ))}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 m-0 bg-black/90 border-none fixed min-w-full sm:min-w-5/6 xl:min-w-4/5 min-h-4/5 flex items-center justify-center">
          <DialogTitle className="fixed invisible">
            Image
          </DialogTitle>
          <div className="relative w-screen h-screen">
            <button className="absolute top-4 right-4 text-white p-2 bg-black/60 rounded-full z-20" onClick={() => setOpen(false)}>
              <X size={20}/>
            </button>

            {images.length > 1 && index > 0 && (
              <button className="absolute left-4 invisible sm:visible top-1/2 -translate-y-1/2 text-white p-3 bg-black/40 rounded-full z-20" onClick={prev}>
                <ChevronLeft size={40} />
              </button>
            )}


            <div {...handlers} className="relative w-full h-full flex items-center justify-center touch-pan-y">
              {images.length > 0 && images[index] && (
                <Image src={images[index].url} alt={`${images[index].name} photo`} fill className="object-contain 2xl:p-5"/>
              )}

              {images.length > 1 && images[index] &&  (
                <Link target="_blank" href={images[index].url} className="absolute bottom-75 sm:bottom-4 right-0 sm:right-4 text-white p-3 bg-black/20 rounded-full z-20">
                  <ImageDown size={40}/>
                </Link>
              )}
            </div>


            {images.length > 1 && index < (images.length - 1) &&  (
              <button className="absolute right-4 invisible sm:visible top-1/2 -translate-y-1/2 text-white p-3 bg-black/40 rounded-full z-20" onClick={next}>
                <ChevronRight size={40}/>
              </button>
            )}





          </div>
        </DialogContent>
      </Dialog>
    </>

  );


}