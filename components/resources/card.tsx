"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import * as pdfjs from "pdfjs-dist";

interface CardProps {
  fileUrl: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  resourceId: Id<"resources">;
};

const Card = ({
  fileUrl,
  title,
  description,
  category,
  videoUrl,
  resourceId
}: CardProps) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoDarkRef = useRef<HTMLVideoElement>(null);
  const state = useRef<"idle" | "playing" | "leaving" | "looping">("idle");

  const forceLayout = () => {
    if (videoRef.current) {
      void videoRef.current.offsetWidth;
    }
  };

  const showVideo = () => {
    forceLayout();
    if (videoContainerRef.current) {
      videoContainerRef.current.style.opacity = "1";
      videoContainerRef.current.style.transition = "";
    }
  };

  const hideVideo = (durationSeconds = 0.5) => {
    forceLayout();
    if (videoContainerRef.current) {
      videoContainerRef.current.style.opacity = "0";
      videoContainerRef.current.style.transition = `opacity ${durationSeconds}s linear`;
    }
  };

  const onEnded = () => {
    state.current = "looping";
    hideVideo();
  };

  const getVideo = () => {
    return document.documentElement.classList.contains("dark")
      ? videoDarkRef.current
      : videoRef.current;
  };

  return (
    <div
      className="group relative rounded-xl dark:bg-neutral-800 bg-neutral-50 p-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
      onMouseEnter={() => {
        if (state.current === "idle") {
          state.current = "playing";
          getVideo()?.play();
          showVideo();
        } else if (state.current === "leaving") {
          state.current = "looping";
        }
      }}
      onMouseLeave={() => {
        state.current = "leaving";
        hideVideo();
      }}
    >
      <div className="aspect-[672/494] relative rounded-lg transform overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.08)] bg-slate-200">
       
      <iframe
        src={fileUrl}
        className="absolute inset-0 w-full h-full"
        title={`Preview of ${title}`}
        frameBorder="0"
        scrolling="no"
        style={{ overflow: "hidden" }}
      />


        <div
          ref={videoContainerRef}
          onTransitionEnd={() => {
            if (state.current === "leaving") {
              state.current = "idle";
              const video = getVideo();
              if (video) {
                video.currentTime = 0;
                video.pause();
              }
            } else if (state.current === "looping") {
              state.current = "playing";
              const video = getVideo();
              if (video) {
                video.currentTime = 0;
                video.play();
                showVideo();
              }
            }
          }}
        >
          <video
            ref={videoRef}
            preload="none"
            muted
            playsInline
            className="absolute inset-0 w-full h-full [mask-image:radial-gradient(white,black)]"
            onEnded={onEnded}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="flex flex-wrap items-center mt-6">
        <h2 className="text-base leading-6 text-foreground font-semibold group-hover:text-blue-500 capitalize">
          <Link href={`/${category}/${resourceId}`}>
            <span className="absolute inset-0 whitespace-nowrap rounded-3xl" />
            {title}
          </Link>
        </h2>
        <svg
          className="w-6 h-6 flex-none opacity-0 group-hover:opacity-100 stroke-blue-500"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9.75 15.25L15.25 9.75M15.25 9.75H10.85M15.25 9.75V14.15"
            stroke=""
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="w-full flex-none text-sm leading-6 text-slate-500">
          {category}
        </p>
      </div>
    </div>
  );
};

export default Card;