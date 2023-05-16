"use client";

import axios from "axios";
import React, { FormEvent, useRef, useState } from "react";
import Image from "next/image";
const ImageUploader = () => {
  // 1. add reference to input element
  const ref = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 2. get reference to the input element
    const input = ref.current!;

    // 3. build form data
    const formData = new FormData();
    const files = Array.from(input.files ?? []);
    for (const file of files) {
      formData.append(file.name, file);
    }

    // 4. use axios to send the FormData
    await axios.post("/api/upload", formData);
    setUrls(files.map((file) => `/api/uploads/${file.name}`));
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" name="files" ref={ref} multiple />
        <button
          type="submit"
          className="px-2 py-1 rounded-md bg-violet-50 text-violet-500"
        >
          Upload
        </button>
      </form>
      {/* display uploaded images */}
      <div className="relative aspect-video max-h-[400px]">
        {urls.map((url) => {
          return (
            <Image
              key={url}
              src={url}
              alt={url}
              className="object-cover"
              fill
            />
          );
        })}
      </div>
    </>
  );
};

export default ImageUploader;
