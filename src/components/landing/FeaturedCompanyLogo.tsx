// src/components/landing/FeaturedCompanyLogo.tsx
import Image from 'next/image';

interface FeaturedCompanyLogoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export default function FeaturedCompanyLogo({ src, alt, width = 180, height = 72 }: FeaturedCompanyLogoProps) {
  return (
    <div className="flex items-center justify-center p-2 sm:p-4">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain transition-all duration-300"
      />
    </div>
  );
}