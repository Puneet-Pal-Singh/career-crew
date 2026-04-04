'use client';

import { motion } from 'framer-motion';

const leftCarouselItems = [
  { label: 'Development', icon: '💻', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-400/30' },
  { label: 'Design', icon: '🎨', color: 'from-pink-500/20 to-purple-500/20', border: 'border-pink-400/30' },
  { label: 'Data Science', icon: '📊', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-400/30' },
  { label: 'Cloud', icon: '☁️', color: 'from-sky-500/20 to-indigo-500/20', border: 'border-sky-400/30' },
  { label: 'Security', icon: '🔒', color: 'from-red-500/20 to-orange-500/20', border: 'border-red-400/30' },
  { label: 'AI / ML', icon: '🤖', color: 'from-violet-500/20 to-fuchsia-500/20', border: 'border-violet-400/30' },
];

const rightCarouselItems = [
  { label: '500+ Companies', icon: '🏢', color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-400/30' },
  { label: '10k+ Placements', icon: '🚀', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-400/30' },
  { label: 'Top Talent', icon: '⭐', color: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-400/30' },
  { label: 'Verified', icon: '✅', color: 'from-teal-500/20 to-cyan-500/20', border: 'border-teal-400/30' },
  { label: 'Remote Ready', icon: '🌍', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-400/30' },
  { label: 'Mobile First', icon: '📱', color: 'from-orange-500/20 to-red-500/20', border: 'border-orange-400/30' },
];

function CarouselCard({ item, index }: { item: typeof leftCarouselItems[0]; index: number }) {
  return (
    <motion.div
      className={`flex-shrink-0 w-44 h-20 rounded-2xl bg-gradient-to-br ${item.color} backdrop-blur-md border ${item.border} flex items-center gap-3 px-4 shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <span className="text-2xl">{item.icon}</span>
      <span className="text-sm font-semibold text-content-light dark:text-content-dark whitespace-nowrap">
        {item.label}
      </span>
    </motion.div>
  );
}

export default function FloatingCarousels() {
  const itemHeight = 96; // h-24 equivalent in px for gap spacing
  const totalHeight = itemHeight * leftCarouselItems.length;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 dark:bg-primary-dark/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 dark:bg-secondary-dark/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Left carousel - scrolls upward */}
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-48 hidden md:flex flex-col overflow-hidden">
        <motion.div
          className="flex flex-col gap-4"
          animate={{ y: [0, -totalHeight] }}
          transition={{ y: { duration: 20, repeat: Infinity, ease: 'linear' } }}
        >
          {[...leftCarouselItems, ...leftCarouselItems].map((item, i) => (
            <CarouselCard key={`left-${i}`} item={item} index={i % leftCarouselItems.length} />
          ))}
        </motion.div>
      </div>

      {/* Right carousel - scrolls downward */}
      <div className="absolute right-4 md:right-8 top-0 bottom-0 w-48 hidden md:flex flex-col overflow-hidden">
        <motion.div
          className="flex flex-col gap-4"
          animate={{ y: [-totalHeight, 0] }}
          transition={{ y: { duration: 22, repeat: Infinity, ease: 'linear' } }}
        >
          {[...rightCarouselItems, ...rightCarouselItems].map((item, i) => (
            <CarouselCard key={`right-${i}`} item={item} index={i % rightCarouselItems.length} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
