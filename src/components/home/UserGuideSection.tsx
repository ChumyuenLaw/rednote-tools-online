'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, X } from 'lucide-react';

export default function UserGuideSection() {
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const steps = [
    {
      id: 1,
      title: "Step 1",
      description: "Open the Rednote video you want to download and locate the share button.",
      image: "/images/1.jpg"
    },
    {
      id: 2,
      title: "Step 2",
      description: "Tap the share button and find the \"Copy Link\" option to copy the video URL.",
      image: "/images/2.jpg"
    },
    {
      id: 3,
      title: "Step 3",
      description: "Paste the copied link into the input field above and click the Download button.",
      image: "/images/3.jpg"
    }
  ];

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // Regular component rendering without conditional early return
  return (
    <div className="py-8 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">How to Download Rednote Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {steps.map((step, index) => (
          <div key={step.id} className="border rounded-lg p-4 sm:p-6 bg-card hover:shadow-md transition-shadow">
            <div 
              className="relative w-full mb-4 rounded-md overflow-hidden border bg-black flex items-center justify-center h-[200px] sm:h-[250px] cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleImageClick(step.image)}
            >
              <Image 
                src={step.image} 
                alt={step.title}
                className="object-contain max-h-full max-w-full h-auto w-auto"
                width={500}
                height={400}
                priority
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
            
            {index < steps.length - 1 && mounted && (
              <div className="hidden md:flex absolute right-[-15px] top-1/2 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full-screen image modal */}
      {selectedImage && mounted && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button 
              className="absolute top-2 right-2 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
              onClick={(e) => { e.stopPropagation(); closeModal(); }}
            >
              <X className="h-6 w-6" />
            </button>
            <Image
              src={selectedImage}
              alt="Enlarged view"
              className="object-contain max-h-full max-w-full"
              width={1200}
              height={900}
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
} 