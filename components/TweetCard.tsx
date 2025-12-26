import React from 'react';
import { Tweet } from '../types';
import { TEXT, COLORS, LINKS } from '../constants';

export const TweetCard: React.FC<{ tweet: Tweet; darkMode: boolean }> = ({ tweet, darkMode }) => {
  const hasMedia = tweet.extended_entities?.media && tweet.extended_entities.media.length > 0;

  const dateObj = new Date(tweet.created_at);
  const dateStr = isNaN(dateObj.getTime()) ? TEXT.UNKNOWN_DATE : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const theme = darkMode ? COLORS.DARK : COLORS.LIGHT;

  const tweetUrl = `${LINKS.X_BASE}/${tweet.user?.screen_name || 'i'}/status/${tweet.id}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block relative group transition-transform duration-300 hover:-translate-y-1`}
      style={{ color: theme.TEXT }}
    >
      <div
        className={`p-4 rounded-[2px] transition-all duration-300 border ${darkMode ? theme.SHADOW_HOVER : theme.SHADOW_HOVER}`}
        style={{
          backgroundColor: theme.CARD_BG,
          borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'transparent',
          boxShadow: darkMode ? '4px 4px 8px rgba(0,0,0,0.6), -1px -1px 2px rgba(255,255,255,0.05)' : '4px 4px 8px rgba(0,0,0,0.15), -4px -4px 8px rgba(255,255,255,0.6)'
        }}
      >

        <div className="flex items-start justify-between mb-3 opacity-80">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden relative" style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              {tweet.user?.profile_image_url_https ? (
                <img src={tweet.user.profile_image_url_https} alt="" className="w-full h-full object-cover grayscale contrast-125" />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs leading-none">{tweet.user?.name || TEXT.UNKNOWN_USER}</span>
              <span className="font-mono text-[9px] opacity-60">@{tweet.user?.screen_name || 'unknown'}</span>
            </div>
          </div>
          <span className="font-mono text-[8px] opacity-40">{dateStr}</span>
        </div>

        <p className="font-['Space_Grotesk'] text-sm leading-relaxed mb-3 whitespace-pre-wrap">
          {tweet.full_text}
        </p>

        {hasMedia && (
          <div className={`mb-3 rounded-sm overflow-hidden border`} style={{ borderColor: theme.BORDER }}>
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

        <div className={`flex gap-4 border-t pt-2 mt-1`} style={{ borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-1 opacity-40">
            <div className={`w-2 h-2 rounded-full border`} style={{ borderColor: theme.TEXT }}></div>
            <span className="font-mono text-[9px]">{tweet.favorite_count || 0}</span>
          </div>
          <div className="flex items-center gap-1 opacity-40">
            <div className={`w-2 h-2 border transform rotate-45`} style={{ borderColor: theme.TEXT }}></div>
            <span className="font-mono text-[9px]">{tweet.retweet_count || 0}</span>
          </div>
          <div className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="font-mono text-[8px]">{TEXT.OPEN_SOURCE} // {tweet.id ? String(tweet.id).substring(0, 4) : '????'}</span>
          </div>
        </div>
      </div>
    </a>
  );
};