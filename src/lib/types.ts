export interface VideoDetail {
  code: number;
  episodes: string[];
  detailUrl: string;
  videoInfo: {
    title: string;
    cover?: string;
    desc?: string;
    type?: string;
    year?: string;
    area?: string;
    director?: string;
    actor?: string;
    remarks?: string;
    source_name: string;
    source: string;
    id: string;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  poster: string;
  episodes: string[];
  source: string;
  source_name: string;
  class?: string;
  year: string;
  desc?: string;
  type_name?: string;
}

export interface DoubanItem {
  title: string;
  poster: string;
  rate: string;
}

export interface DoubanResult {
  code: number;
  message: string;
  list: DoubanItem[];
}

export interface PlayRecord {
  title: string;
  source_name: string;
  year: string;
  cover: string;
  index: number; // 第几集
  total_episodes: number; // 总集数
  play_time: number; // 播放进度（秒）
  total_time: number; // 总进度（秒）
  save_time: number; // 记录保存时间（时间戳）
  user_id: number; // 用户 ID，本地存储情况下恒为 0
}

export interface Favorite {
  title: string;
  source_name: string;
  year: string;
  cover: string;
  total_episodes: number;
  save_time: number;
  user_id: number; // 本地存储情况下恒为 0
  source: string; // Add source
  id: string; // Add id
}

export interface User {
  id?: number;
  username: string;
  password?: string;
}
