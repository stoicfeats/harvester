import React from 'react';
import { Tweet } from '../types';
import { TweetCard } from './TweetCard';

interface MasonryGridProps {
  tweets: Tweet[];
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ tweets }) => {
  if (tweets.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
         <div className="w-16 h-16 border-2 border-black/20 mb-4 animate-pulse rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-black/40"></div>
         </div>
         <p className="font-mono text-xs uppercase tracking-widest">Awaiting Data Stream</p>
         <p className="font-mono text-[9px] mt-2 opacity-60">Upload JSON archive via Sidebar Control 01</p>
      </div>
    );
  }

  return (
    <div className="w-full columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 p-6 pb-20">
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
};
