
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function OwnerLayout({children} : { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('bearer')?.value;
  const axios = require('axios');

  if (!token) redirect('/login');

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/valid',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios.request(config);
    console.log(response.data);

    if (!(response.data === true)) {
      redirect('/login');
    }

  } catch (error) {
    console.log("incorrect bearer token or failed to make request");
    redirect('/login')
  }

  return <>
  {children}
  </>
}