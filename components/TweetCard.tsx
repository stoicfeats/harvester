import React from 'react';
import { Tweet } from '../types';

export const TweetCard: React.FC<{ tweet: Tweet }> = ({ tweet }) => {
  const hasMedia = tweet.extended_entities?.media && tweet.extended_entities.media.length > 0;
  
  // Format date
  const dateObj = new Date(tweet.created_at);
  const dateStr = isNaN(dateObj.getTime()) ? 'UNKNOWN_DATE' : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="break-inside-avoid mb-6 relative group animate-reveal">
      <div className="bg-[#e2e0d9] p-5 rounded-[2px] shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.8)] transition-shadow duration-300 border border-transparent hover:border-black/5">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3 opacity-80">
          <div className="flex gap-2 items-center">
             <div className="w-8 h-8 rounded-full bg-black/10 overflow-hidden relative">
                {tweet.user?.profile_image_url_https ? (
                    <img src={tweet.user.profile_image_url_https} alt="" className="w-full h-full object-cover grayscale contrast-125" />
                ) : (
                    <div className="w-full h-full bg-black/20" />
                )}
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-xs leading-none">{tweet.user?.name || 'Unknown User'}</span>
                <span className="font-mono text-[9px] opacity-60">@{tweet.user?.screen_name || 'unknown'}</span>
             </div>
          </div>
          <span className="font-mono text-[9px] opacity-40">{dateStr}</span>
        </div>

        {/* Content */}
        <p className="font-['Space_Grotesk'] text-sm leading-relaxed mb-4 whitespace-pre-wrap">
          {tweet.full_text}
        </p>

        {/* Media */}
        {hasMedia && (
            <div className="mb-4 rounded-sm overflow-hidden border border-black/10">
                {tweet.extended_entities!.media.map((media) => (
                    <img 
                        key={media.media_url_https}
                        src={media.media_url_https} 
                        alt="Tweet Attachment" 
                        className="w-full h-auto block grayscale hover:grayscale-0 transition-all duration-500"
                    />
                ))}
            </div>
        )}

        {/* Footer Metrics */}
        <div className="flex gap-4 border-t border-black/5 pt-3 mt-2">
            <div className="flex items-center gap-1 opacity-40">
                <div className="w-2 h-2 rounded-full border border-black"></div>
                <span className="font-mono text-[9px]">{tweet.favorite_count || 0}</span>
            </div>
            <div className="flex items-center gap-1 opacity-40">
                <div className="w-2 h-2 border border-black transform rotate-45"></div>
                <span className="font-mono text-[9px]">{tweet.retweet_count || 0}</span>
            </div>
             <div className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity">
                {/* Safe string conversion for ID to prevent substring errors if ID is numeric */}
                <span className="font-mono text-[8px]">ID: {tweet.id ? String(tweet.id).substring(0, 8) : '????'}...</span>
            </div>
        </div>
      </div>
    </div>
  );
};