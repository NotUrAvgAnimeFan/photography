'use server'

import { baseURL } from '@/lib/types';
import axios from 'axios';
import {cookies} from 'next/headers'


export default async function loginAction(username: string, password: string) {
    let data = JSON.stringify({
      "username": username,
      "password": password
    });

    console.log(data);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseURL}/auth/login`,
      headers: {
        'Content-Type': 'application/json'
      },
      data : data
    };


    try {
      const response = await axios.request(config);
      if (response.data["access_token"]) {
        const cookieStore = await cookies();
        console.log(response.data["access_token"]);

        cookieStore.set({
          name: 'bearer',
          value: response.data["access_token"],
          httpOnly: true,
          secure: true,
          path: '/',
        })
        return 1;
      }
    }
    catch (error) {
      console.log(error);
    }

    return -1;
}


