import React, { useState } from 'react'
import gta6 from "./SampleImages/gta6.webp"
import jobs from "./SampleImages/jobs.jpg"
import macintosh from "./SampleImages/macintosh.jpg"
import sf from "./SampleImages/sf.webp"
import newyork from "./SampleImages/newyork.jpg"
import { Image } from '@heroui/react'

const ImageViewApp = () => {
  const Images = [
    {
      id: 1,
      img: jobs,
    },
    {
      id: 2,
      img: macintosh
    },
    {
      id: 4,
      img: gta6
    },
    {
      id: 5,
      img: sf
    },
    {
      id: 6,
      img: newyork
    },

  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % Images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + Images.length) % Images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground font-mono">
      {/* Top toolbar */}
      <div className="flex items-center justify-between p-2 bg-zinc-800">
        <div className="flex space-x-2">
          <button
            onClick={previousImage}
            className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextImage}
            className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
          >
            →
          </button>
        </div>
        <div className="text-sm text-white">
          {currentImageIndex + 1} of {Images.length}
        </div>
      </div>

      {/* Main image container */}
      <div className="flex-1 overflow-hidden bg-zinc-900 relative flex items-center justify-center p-4">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={Images[currentImageIndex].img}
            alt={`Image ${currentImageIndex + 1}`}
            className="max-w-[95%] max-h-[95vh] w-auto h-auto object-contain"
          />
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="h-24 bg-zinc-800 p-2 overflow-x-auto">
        <div className="flex space-x-2 h-full">
          {Images.map((image, index) => (
            <div
              key={image.id}
              onClick={() => selectImage(index)}
              className={`h-full aspect-square cursor-pointer transition-all ${
                currentImageIndex === index
                  ? ''
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image.img}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover rounded-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ImageViewApp