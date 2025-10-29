import React from 'react';

export interface ImageType {
  uploaded_at: string;
  name: string;
  collection: string;
  url: string;
  id: string;
}

export interface ShowHome {
  setShowHome: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SetCollections {
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
}

export interface Collection {
  name: string;
  created_at: string;
  updated_at: string;
  cover_photo: string;
  num_photos: number;
  description?: string;
}

export const baseURL = 'http://localhost:3000';