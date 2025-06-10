import React, { useRef, useEffect } from 'react';
import video from '../assets/banner.mp4'

const ImageSlider = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden relative w-full h-48 px-4 mb-6">
        <div className="h-full w-full relative overflow-hidden rounded-2xl">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            preload="auto"
            className="w-full h-full object-cover"
            style={{ objectFit: 'cover' }}
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block relative w-full h-[400px] rounded-2xl overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            preload="auto"
            className="absolute inset-0 w-full h-full"
            style={{ 
              objectFit: 'fill',
              objectPosition: 'center',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>
      </div>
    </>
  );
};

export default ImageSlider;