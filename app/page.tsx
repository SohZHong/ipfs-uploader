'use client';

import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import axios from 'axios';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  const uploadFile = async (file: File) => {
    try {
      // Request an upload URL from the API
      const response = await axios.post('/api/upload', {
        fileName: file.name,
        filetype: file.type,
      });
      console.log(response);
      const uploadUrl = response.data.uploadUrl;
      // const cid = response.data.cid;
      // Upload the file to the presigned URL
      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
      });

      console.log('File uploaded successfully!');
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };
  const handleButtonClick = async () => {
    if (files.length === 0) {
      console.warn('No files selected');
      return;
    }

    await uploadFile(files[0]);
  };

  // async function uploadFile(file) {
  //   const response = await fetch('/api/upload', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       filename: file.name,
  //       filetype: file.type,
  //     }),
  //   });

  //   const { uploadUrl } = await response.json();

  //   // Upload the file to Filebase via the signed URL
  //   await fetch(uploadUrl, {
  //     method: 'PUT',
  //     body: file,
  //     headers: { 'Content-Type': file.type },
  //   });

  //   console.log('File uploaded successfully!');
  // }

  return (
    <div className='grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <div className='flex-col justify-center flex items-center gap-2'>
        <h1 className='text-2xl font-black'>IPFS Image Uploader</h1>
        <p className='brightness-50'>
          Upload your files to IPFS and receive its CID
        </p>
      </div>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <div className='w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg'>
          <FileUpload onChange={handleFileUpload} />
        </div>
        <button
          onClick={handleButtonClick}
          className='shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400'
        >
          Upload File
        </button>
      </main>
    </div>
  );
}
