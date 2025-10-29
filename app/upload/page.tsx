'use client'

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Field, FieldLabel, FieldDescription, FieldSeparator, FieldSet, FieldGroup} from '@/components/ui/field';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import axios from 'axios';
import { toast } from 'sonner';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';


export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
    setUploaded(true);

    const previews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);

  }

  const handleCancel = () => {
    setFiles([]);
    setUploaded(false);
    setFilePreviews([]);
  }

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file, file.name);
    }

    try {
      const response = await axios.post('http://localhost:3000/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(`Upload progress: ${percentage}%`);
        },
      });
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
    <div className='flex flex-col items-center'>
      <div className='w-1/3 h-1/3 pt-4 pb-4'>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="file">Upload Image</FieldLabel>
              <Dropzone
                maxFiles={40}
                accept={{'image/*': []}}
                onDrop={handleDrop}
                onError={console.error}
                src={files}
              >
                {
                  !uploaded ? (
                    <DropzoneContent className="size-[20rem]" />
                ) : (

                    <div className="grid grid-cols-4 gap-2 h-full w-full">
                      {filePreviews.map((preview, index) => (
                      <AspectRatio ratio={1 / 1} key={index}>
                        <div className="relative h-full m-0 p-0">
                          <img src={preview} alt={`Preview ${index + 1}`} className="object-contain w-full h-full" />
                        </div>
                      </AspectRatio>

                    ))}
                    </div>


                  )
                }
              </Dropzone>
              <FieldDescription>
                Pick your picture(s) for upload
              </FieldDescription>
            </Field>
            <FieldSeparator/>
            <Field orientation="responsive" className="justify-center space-x-10">
              <Button type="submit" disabled={!uploaded} onClick={handleSubmit}>Submit</Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </div>

  )

}