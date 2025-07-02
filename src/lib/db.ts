/* eslint-disable no-console */

import { PlayRecord, Favorite } from './types';

// storage type 常量: 'localstorage' | 'database'，默认 'localstorage'
const STORAGE_TYPE = 'localstorage';


// 存储接口
export interface IStorage {
  // 播放记录相关
  getPlayRecord(key: string): Promise<PlayRecord | null>;
  setPlayRecord(key: string, record: PlayRecord): Promise<void>;
  getAllPlayRecords(): Promise<{ [key: string]: PlayRecord }>;
  deletePlayRecord(key: string): Promise<void>;

  // 收藏相关
  getFavorite(key: string): Promise<Favorite | null>;
  setFavorite(key: string, favorite: Favorite): Promise<void>;
  getAllFavorites(): Promise<{ [key: string]: Favorite }>;
  deleteFavorite(key: string): Promise<void>;
}

// 数据库实现（保留接口，待实现）
class DatabaseStorage implements IStorage {
  async getPlayRecord(_key: string): Promise<PlayRecord | null> {
    // TODO: 实现数据库查询逻辑
    throw new Error('Database storage not implemented yet');
  }

  async setPlayRecord(_key: string, _record: PlayRecord): Promise<void> {
    // TODO: 实现数据库插入/更新逻辑
    throw new Error('Database storage not implemented yet');
  }

  async getAllPlayRecords(): Promise<{ [key: string]: PlayRecord }> {
    // TODO: 实现数据库查询所有记录逻辑
    throw new Error('Database storage not implemented yet');
  }

  async deletePlayRecord(_key: string): Promise<void> {
    // TODO: 实现数据库删除逻辑
    throw new Error('Database storage not implemented yet');
  }

  async getFavorite(_: string): Promise<Favorite | null> {
    // TODO: 实现数据库查询逻辑
    throw new Error('Database storage not implemented yet');
  }

  async setFavorite(_key: string, _favorite: Favorite): Promise<void> {
    // TODO: 实现数据库插入/更新逻辑
    throw new Error('Database storage not implemented yet');
  }

  async getAllFavorites(): Promise<{ [key: string]: Favorite }> {
    // TODO: 实现数据库查询所有收藏逻辑
    throw new Error('Database storage not implemented yet');
  }

  async deleteFavorite(_key: string): Promise<void> {
    // TODO: 实现数据库删除逻辑
    throw new Error('Database storage not implemented yet');
  }
}

// 创建存储实例
function createStorage(): IStorage {
  switch (STORAGE_TYPE) {
    case 'database':
      return new DatabaseStorage();
    case 'localstorage':
    default:
      return null as unknown as IStorage;
  }
}

// 单例存储实例
let storageInstance: IStorage | null = null;

export function getStorage(): IStorage {
  if (!storageInstance) {
    storageInstance = createStorage();
  }
  return storageInstance;
}

// 工具函数：生成存储key
export function generateStorageKey(source: string, id: string): string {
  return `${source}+${id}`;
}

// 导出便捷方法
export class DbManager {
  private storage: IStorage;

  constructor() {
    this.storage = getStorage();
  }

  // 播放记录相关方法
  async getPlayRecord(source: string, id: string): Promise<PlayRecord | null> {
    const key = generateStorageKey(source, id);
    return this.storage.getPlayRecord(key);
  }

  async savePlayRecord(
    source: string,
    id: string,
    record: Omit<PlayRecord, 'user_id'>
  ): Promise<void> {
    const key = generateStorageKey(source, id);
    const fullRecord: PlayRecord = { ...record, user_id: 0 };
    await this.storage.setPlayRecord(key, fullRecord);
  }

  async getAllPlayRecords(): Promise<{ [key: string]: PlayRecord }> {
    return this.storage.getAllPlayRecords();
  }

  async deletePlayRecord(source: string, id: string): Promise<void> {
    const key = generateStorageKey(source, id);
    await this.storage.deletePlayRecord(key);
  }

  // 收藏相关方法
  async getFavorite(source: string, id: string): Promise<Favorite | null> {
    const key = generateStorageKey(source, id);
    return this.storage.getFavorite(key);
  }

  async saveFavorite(
    source: string,
    id: string,
    favorite: Omit<Favorite, 'user_id'>
  ): Promise<void> {
    const key = generateStorageKey(source, id);
    const fullFavorite: Favorite = { ...favorite, user_id: 0 };
    await this.storage.setFavorite(key, fullFavorite);
  }

  async getAllFavorites(): Promise<{ [key: string]: Favorite }> {
    return this.storage.getAllFavorites();
  }

  async deleteFavorite(source: string, id: string): Promise<void> {
    const key = generateStorageKey(source, id);
    await this.storage.deleteFavorite(key);
  }

  async isFavorited(source: string, id: string): Promise<boolean> {
    const favorite = await this.getFavorite(source, id);
    return favorite !== null;
  }

  async toggleFavorite(
    source: string,
    id: string,
    favoriteData?: Omit<Favorite, 'user_id'>
  ): Promise<boolean> {
    const isFav = await this.isFavorited(source, id);

    if (isFav) {
      await this.deleteFavorite(source, id);
      return false;
    } else {
      if (favoriteData) {
        await this.saveFavorite(source, id, favoriteData);
        return true;
      } else {
        throw new Error('Favorite data is required when adding to favorites');
      }
    }
  }
}

// 导出默认实例
export const db = new DbManager();
