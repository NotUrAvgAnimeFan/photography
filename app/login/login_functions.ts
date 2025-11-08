'use server'

import axios from 'axios';
import {cookies} from 'next/headers'


export default async function makeRequest(username: string, password: string) {
    let data = JSON.stringify({
      "username": username,
      "password": password
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/auth/login',
      headers: {
        'Content-Type': 'application/json'
      },
      data : data
    };


    try {
      const response = await axios.request(config);
      const cookieStore = await cookies();
      console.log(response.data["access_token"]);

      cookieStore.set({
        name: 'bearer',
        value: response.data["access_token"],
        httpOnly: true,
        secure: true,
        path: '/',
      })


    }
    catch (error) {
      console.log(error);
    }
  }