import { Loader } from 'lucide-react';
import React from 'react';

const LoaderSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <blockquote className="space-y-2 text-center">
        <p className="text-lg">
          &ldquo;The goal was simple - to build a platform where founders can support each other to build and launch their startups.&rdquo;
        </p>
      </blockquote>
      <div className="flex items-center mt-4">
        <div className="inline-flex items-center">
          - Victor Onyekere
        </div>
        <Loader className="ml-2 animate-spin text-blue-500" size={30} />
      </div>
    </div>
  );
};

export default LoaderSpinner;