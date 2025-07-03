export interface VideoDetail {
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
  videoInfo: VideoInfo;
}

interface VideoInfo {
  title: string;
  cover: string;
  desc: string;
  type: string;
  year: string;
  source_name: string;
  source: string;
  id: string;
  remarks: string; // Map class to remarks
}

interface FetchVideoDetailOptions {
  source: string;
  id: string;
  fallbackTitle?: string;
  fallbackYear?: string;
}

/**
 * 根据 source 与 id 获取视频详情。
 * 1. 若传入 fallbackTitle，则先调用 /api/search 搜索精确匹配。
 * 2. 若搜索未命中或未提供 fallbackTitle，则直接调用 /api/detail。
 */
export async function fetchVideoDetail({
  source,
  id,
  fallbackTitle = '',
  fallbackYear = '',
}: FetchVideoDetailOptions): Promise<VideoDetail> {
  // 优先通过搜索接口查找精确匹配
  if (fallbackTitle) {
    try {
      const searchResp = await fetch(
        `/api/search?q=${encodeURIComponent(fallbackTitle)}`
      );
      if (searchResp.ok) {
        const searchData = await searchResp.json();
        const exactMatch = searchData.results.find(
          (item: VideoDetail) =>
            item.source.toString() === source.toString() &&
            item.id.toString() === id.toString()
        );
        if (exactMatch) {
          // Transform SearchResult to VideoDetail structure
          return {
            code: 200, // Assuming success
            episodes: exactMatch.episodes || [],
            detailUrl: '', // Not available from search result
            videoInfo: {
              title: exactMatch.title,
              cover: exactMatch.poster,
              desc: exactMatch.desc,
              type: exactMatch.type_name,
              year: exactMatch.year,
              source_name: exactMatch.source_name,
              source: exactMatch.source,
              id: exactMatch.id,
              remarks: exactMatch.class, // Map class to remarks
            },
          } as unknown as VideoDetail;
        }
      }
    } catch (error) {
      // do nothing
    }
  }

  // 调用 /api/detail 接口
  const response = await fetch(`/api/detail?source=${source}&id=${id}`);
  if (!response.ok) {
    throw new Error('获取详情失败');
  }
  const data = await response.json();

  const result: VideoDetail = {
    id: data?.videoInfo?.id || id,
    title: data?.videoInfo?.title || fallbackTitle,
    poster: data?.videoInfo?.cover || '',
    episodes: data?.episodes || [],
    source: data?.videoInfo?.source || source,
    source_name: data?.videoInfo?.source_name || '',
    class: data?.videoInfo?.remarks || '',
    year: data?.videoInfo?.year || fallbackYear || '',
    desc: data?.videoInfo?.desc || '',
    type_name: data?.videoInfo?.type || '',
    videoInfo: data?.videoInfo,
  };
  return result;
}
