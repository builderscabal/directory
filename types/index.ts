/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from "react";

import { Id } from "@/convex/_generated/dataModel";

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface Users {
  _id: Id<"users">;
  name: string;
  subject: string;
  html: string;
  new: boolean;
  views: number;
  _creationTime: number;
};

export interface UploadPageThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
}

export interface UploadPageFileProps {
  setZipFile: Dispatch<SetStateAction<string>>;
  setZipFileStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  zipFile: string;
}

export interface UploadPageDemoVideoProps {
  setVideo: Dispatch<SetStateAction<string>>;
  setVideoStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  video: string;
}

export interface UploadMethodPDFProps {
  setPDF: Dispatch<SetStateAction<string>>;
  setPDFStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  pdf: string;
}

export interface UploadMethodVideoProps {
  setVideo: Dispatch<SetStateAction<string>>;
  setVideoStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  video: string;
}

export interface UploadPageThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
}