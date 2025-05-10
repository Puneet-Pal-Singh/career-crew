// src/components/landing/FeaturedCompanyLogo.tsx
import Image from 'next/image';

interface FeaturedCompanyLogoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export default function FeaturedCompanyLogo({ src, alt, width = 120, height = 48 }: FeaturedCompanyLogoProps) {
  return (
    <div className="flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain"
      />
    </div>
  );
}