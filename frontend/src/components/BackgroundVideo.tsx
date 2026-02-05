'use client';

interface BackgroundVideoProps {
  src: string;
  opacity?: number;
}

export default function BackgroundVideo({ src, opacity = 0.3 }: BackgroundVideoProps) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="fixed inset-0 w-full h-full object-cover pointer-events-none"
      style={{ opacity }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}