export default interface GlobalEdgeCacheResponse {
  /**
   * The sorted result array
   */
  sorted?: number[];

  /**
   * If the result comes from the global edge cache
   */
  cacheHit?: boolean;

  /**
   * A message if the result couldn't be obtained
   */
  message?: string;
}
