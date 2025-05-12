// src/components/landing/BlogPreviewCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPreviewData } from '@/lib/data/landingContent';
import { CalendarDays, UserCircle } from 'lucide-react'; // Example icons
// import {ExternalLink} from 'lucide-react'; // Example icon

interface BlogPreviewCardProps {
  post: BlogPreviewData;
}

export default function BlogPreviewCard({ post }: BlogPreviewCardProps) {
  return (
    <Link 
      href={`/blog/${post.slug}`} // Assuming your blog posts will live under /blog/[slug]
      className="group flex flex-col h-full bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 border border-border-light dark:border-border-dark hover:border-primary/30 dark:hover:border-primary-dark/30"
    >
      {post.imageUrl && (
        <div className="relative w-full h-48 sm:h-52 overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Basic responsive sizes
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 text-xs font-semibold text-primary-foreground dark:text-gray-900 bg-primary dark:bg-primary-dark rounded-full shadow-sm">
              {post.category}
            </span>
          </div>
        </div>
      )}
      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <h3 className="mb-2 text-lg md:text-xl font-semibold text-content-light dark:text-content-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors leading-tight">
          {post.title}
        </h3>
        <p className="text-sm text-subtle-light dark:text-subtle-dark mb-3 line-clamp-3 flex-grow">
          {post.snippet}
        </p>
        <div className="mt-auto pt-3 border-t border-border-light/50 dark:border-border-dark/50 text-xs text-subtle-light dark:text-subtle-dark space-y-1.5">
          <div className="flex items-center">
            <UserCircle size={14} className="mr-1.5 opacity-70" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarDays size={14} className="mr-1.5 opacity-70" />
              <span>{post.date}</span>
            </div>
            {post.readTime && (
              <span className="opacity-80">{post.readTime}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}