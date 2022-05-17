export interface CacheHitResponse {
  /**
   * If the cache had a hit
   */
  hit: boolean;

  /**
   * The sorted array from the cache
   */
  sorted?: number[];
}
