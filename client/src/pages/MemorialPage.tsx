import React, { useState } from 'react';

export const MemorialPage = () => {
  const [uploads, setUploads] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploads(Array.from(e.target.files));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Upload Memories</h1>
      <p className="mb-6 text-gray-700">
        Add cherished photos or videos you'd like to preserve in memory.
      </p>

      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
        className="mb-6 block mx-auto"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {uploads.map((file, index) => {
          const url = URL.createObjectURL(file);
          return file.type.startsWith('image') ? (
            <img key={index} src={url} alt="upload preview" className="w-full rounded shadow" />
          ) : (
            <video key={index} controls className="w-full rounded shadow">
              <source src={url} />
              Your browser does not support the video tag.
            </video>
          );
        })}
      </div>

      {/* Optional highlight section */}
      <div className="mt-8 p-6 bg-yellow-100 border border-yellow-400 rounded-lg shadow">
        <p className="text-yellow-800 font-semibold">
          These memories will live on and can be shared with loved ones forever. ❤️
        </p>
      </div>
    </div>
  );
};
