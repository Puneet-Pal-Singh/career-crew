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
    <div className="flex items-center justify-center p-2 sm:p-4">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 dark:invert-0 dark:hover:opacity-100"
        // For dark mode, if logos are dark, they might need `dark:brightness-200 dark:contrast-150` or `dark:invert`
        // depending on the logo. `dark:invert-0` is to ensure it doesn't invert by default if not needed.
        // If logos are light and need to be visible on dark bg, `dark:brightness-0 dark:invert` can work.
        // For SVG logos designed for both themes, this might not be needed.
        // Since these are placeholders, this is a starting point.
      />
    </div>
  );
}