
import { baseURL, ImageType } from "@/lib/types"
import axios from "axios"
import CollectionImages from "."


// Generate static params for build time
export async function generateStaticParams() {
  let fetchCollectionsConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${baseURL}/collections`,
    headers: { }
  };

  try {
    const collections = await axios.request(fetchCollectionsConfig);

    return collections.data.map((collection: any) => (
      {collection: collection.name.replaceAll(' ', '_')}
    ))
  } catch (error) {
    console.log("failed to retrieve collections, ", error);
  }

}


export default function CollectionImagesPage({
  params,
}: {
  params: Promise<{collection: string}>
}) {
  return (
    <CollectionImages params={params} />
  )


}