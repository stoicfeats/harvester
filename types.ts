export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  status: 'fetched' | 'waiting' | 'pending';
}

export interface ExportFormat {
  label: string;
  subLabel: string;
  id: string;
}

export interface TweetMedia {
  type: 'photo' | 'video' | 'animated_gif';
  media_url_https: string;
  url: string;
}

export interface Tweet {
  id: string;
  created_at: string;
  full_text: string;
  user: {
    name: string;
    screen_name: string;
    profile_image_url_https: string;
  };
  extended_entities?: {
    media: TweetMedia[];
  };
  favorite_count?: number;
  retweet_count?: number;
}
