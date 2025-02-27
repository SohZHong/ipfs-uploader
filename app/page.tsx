'use client';

import React, { useEffect, useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import axios from 'axios';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [ipfs, setIpfs] = useState<string>('');
  const [uploadedFileSrc, setUploadedFileSrc] = useState<string>();

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/pinata/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIpfs(response.data.IpfsHash);
      setFiles([]);
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

  useEffect(() => {
    if (ipfs) {
      setUploadedFileSrc(`https://gateway.pinata.cloud/ipfs/${ipfs}`);
    }
  }, [ipfs]);

  return (
    <div className='grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <div className='flex-col justify-center flex items-center gap-2'>
        <h1 className='text-2xl font-black'>IPFS Image Uploader</h1>
        <p>
          <span className='brightness-50'>
            Upload your files to IPFS and receive its CID{' '}
          </span>
          <br></br>
          <span className='brightness'>* Please reload after an upload</span>
        </p>
      </div>
      <main className='flex flex-col gap-8 row-start-2 items-center'>
        <div className='w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg'>
          <FileUpload onChange={handleFileUpload} />
        </div>
        <button
          onClick={handleButtonClick}
          className='shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400'
        >
          Upload File
        </button>
        {uploadedFileSrc && (
          <div className='flex flex-col items-center gap-2'>
            <img
              src={uploadedFileSrc}
              alt='Uploaded IPFS File'
              className='lg:max-w-1/2 rounded-lg shadow-lg'
            />
            <p className='text-sm break-all'>CID: {ipfs}</p>
          </div>
        )}
      </main>
    </div>
  );
}
