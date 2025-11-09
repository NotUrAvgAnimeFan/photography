import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { baseURL, Collection, ImageType, SetCollections } from "@/lib/types"
import axios from "axios"
import Image from "next/image";
import { CirclePlus } from "lucide-react"
import { use, useState } from "react"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./ui/shadcn-io/dropzone"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { CardContent } from "./ui/card"
import { AspectRatio } from "./ui/aspect-ratio"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "./ui/field"
import { toast } from "sonner"

export default function AddImages({token, collection, images, setImages} : {token: string, collection: string, images: ImageType[], setImages: React.Dispatch<React.SetStateAction<ImageType[]>>}) {


  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [hasUploads, setHasUploads] = useState<boolean>(false);

  const handleCancel = () => {
    setFiles([]);
    setPreviews([]);
    setHasUploads(false);
  }

  const handleDrop = (files: File[]) => {
    setFiles(files);
    setHasUploads(true);

    const tempPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(tempPreviews);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file, file.name);
    }
    formData.append('num_photos', `${images.length}`);

    try {
      const response = await axios.post(`${baseURL}/photos/${collection}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(`Upload progress: ${percentage}%`);
        }
      });

      const newImages: ImageType[] = response.data as ImageType[];
      setImages(images.concat(newImages));
      toast("Upload was successful!", {description: `Uploaded ${response.data.length} file(s).`});
      handleCancel();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error uploading file(s):', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }


  }

  return (
    <div>
      <Dialog>
        <form >
          <DialogTrigger>
            <CirclePlus className="size-8 sm:size-8 2xl:size-10"/>
          </DialogTrigger>
          <DialogContent className="min-w-4/5 h-4/5">
            <VisuallyHidden>
              <DialogTitle>Upload Images</DialogTitle>
            </VisuallyHidden>
            <FieldSet className="overflow-auto">
              <FieldGroup className="items-center">
                <Field>
                  <FieldLabel htmlFor="file">Upload Image</FieldLabel>
                  <Dropzone accept={{'image/*': []}} maxFiles={40} onDrop={handleDrop} onError={console.error} src={files} className=" h-[55vh]">
                  {
                    !hasUploads ? (
                      <DropzoneContent className="size-[20rem]" />
                    ) : (
                      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 overflow-auto no-scrollbar">
                        {hasUploads && (
                          previews.map((preview, index) => (
                            <AspectRatio ratio={1/1} key={index}>
                              <img src={preview} alt={`${index} photo`} className="object-contain w-full h-full" />
                            </AspectRatio>
                          ))
                        )}
                      </div>
                    )
                    }
                  </Dropzone>
                  <FieldDescription className="text-center">
                    Pick your picture(s) for upload
                  </FieldDescription>
                </Field>
                <FieldSeparator className="w-full" />
                <Field className="w-1/2 items-center justify-center">
                  <div className="w-1/4 flex justify-between">
                    <Button variant="secondary" className="w-1/3" onClick={handleCancel}>Clear</Button>
                    <Button className="w-1/3" disabled={!hasUploads} onClick={handleSubmit}>Upload</Button>
                  </div>

                </Field>
              </FieldGroup>

            </FieldSet>
          </DialogContent>
        </form>
      </Dialog>

    </div>
  )
}
