"use client";

import axios from "axios";
import React, { FormEvent, useRef } from "react";

const UploadForm = () => {
  const ref = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    for (let file of Array.from(ref.current?.files ?? [])) {
      formData.append(file.name, file);
    }
    await axios.post("/api/upload", formData);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="files" ref={ref} multiple />
      <button
        type="submit"
        className="px-2 py-1 rounded-md bg-violet-50 text-violet-500"
      >
        Upload
      </button>
    </form>
  );
};

export default UploadForm;
