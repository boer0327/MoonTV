'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavorite, isFavorited, generateStorageKey } from '@/lib/db.client';

interface FavoriteButtonProps {
  source: string;
  id: string;
  favoriteData: {
    title: string;
    source_name: string;
    year: string;
    cover: string;
    total_episodes: number;
  };
}

export function FavoriteButton({ source, id, favoriteData }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isFavorited(source, id).then(fav => {
      setFavorited(fav);
      setLoading(false);
    });
  }, [source, id]);

  const handleToggleFavorite = async () => {
    try {
      const newState = await toggleFavorite(source, id, {
        ...favoriteData,
        save_time: Date.now(),
      });
      setFavorited(newState);

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));

      // Also send request to the backend API
      const key = generateStorageKey(source, id);
      if (newState) {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, favorite: { ...favoriteData, source, id, save_time: Date.now() } }),
        });
      } else {
        await fetch(`/api/favorites?key=${key}`, {
          method: 'DELETE',
        });
      }
    } catch (err) {
      /* eslint-disable no-console */
      console.error('切换收藏失败:', err);
    }
  };

  if (loading) {
    return (
      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-400 animate-pulse" />
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
        favorited
          ? 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
          : 'bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600'
      }`}
    >
      <Heart
        className={`h-5 w-5 stroke-[2] ${
          favorited ? 'text-red-500' : 'text-white'
        }`}
        fill={favorited ? 'currentColor' : 'none'}
      />
    </button>
  );
}
