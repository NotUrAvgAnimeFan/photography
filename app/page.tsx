'use client'
import { Button } from "@/components/ui/button";
import Start from "@/components/start";
import { useState, useLayoutEffect} from "react";
import { ImageType } from "@/lib/types";
import axios from "axios";
import {baseURL} from "@/lib/types";
import { CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Images from "./images/page";

export default function Home() {

  const [showHome, setShowHome] = useState(false);
  const [images, setImages] = useState<ImageType[]>([]);

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${baseURL}/photos`,
    headers: {}
  }

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
    // call the async function without making the effect callback async
    fetchImages();
  }, []);


  return (
    <div>
      {!showHome ? ( <Start setShowHome={setShowHome} />
      ) : (
        <Images images={images}/>
      )}
    </div>


  );
}
