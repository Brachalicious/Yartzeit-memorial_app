import React, { useState } from 'react';

export default function GalleryUpload() {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setMediaFiles(files);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Upload Photos & Videos</h2>
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleUpload}
        className="mb-4"
      />

      <div className="grid grid-cols-2 gap-4">
        {mediaFiles.map((file, index) => {
          const url = URL.createObjectURL(file);

          if (file.type.startsWith('image')) {
            return (
              <img
                key={index}
                src={url}
                alt={`upload-${index}`}
                className="rounded w-full h-auto max-h-64 object-cover"
              />
            );
          }

          if (file.type.startsWith('video')) {
            return (
              <video key={index} controls className="rounded w-full max-h-64">
                <source src={url} type={file.type} />
                Your browser does not support the video tag.
              </video>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
