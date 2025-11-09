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
import { baseURL, Collection, SetCollections } from "@/lib/types"
import axios from "axios"
import { FolderPlus } from "lucide-react"
import { useState } from "react"

export function NewCollectionButton({token, collections, setCollections}: {token: string, collections: Collection[], setCollections: React.Dispatch<React.SetStateAction<Collection[]>>}) {

  const [collectionName, setCollectionName] =  useState('Sample');
  const [collectionDescription, setCollectionDescription] = useState('');

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseURL}/collections`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: JSON.stringify({
      "name": collectionName,
      "description": collectionDescription
    })
  }


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollectionName(e.target.value);
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollectionDescription(e.target.value);
  }

  const handleSubmit = async () => {
    await axios.request(config).then((response) => {
      const newCollection: Collection = response.data[0] as Collection;
      setCollections([newCollection, ...collections]);
    })
    .catch((error) => {
      console.log(error);
    });

  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button><FolderPlus /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Create a new Collection by providing the name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue="Sample" onChange={handleNameChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue="" onChange={handleDescriptionChange}/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={handleSubmit}>Create</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
