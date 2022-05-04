import { UnsortConfiguration } from './interfaces/UnsortConfiguration'
import GlobalEdgeCacheResponse from './interfaces/GlobalEdgeCacheResponse'

/**
 * The global configuration of unsort which is used if unsort is called without a specific sort
 */
let globalConfiguration: UnsortConfiguration = {
  useGlobalEdgeCache: true
}

/**
 * Update the global configuration of unsort
 * @param configuration
 */
export function updateGlobalUnsortConfiguration (configuration: UnsortConfiguration) {
  globalConfiguration = { ...globalConfiguration, ...configuration }
}

/**
 * The exposed unsort function which returns the sorted array
 * @param unsorted the unsorted array to sort
 * @param configuration the unsort configuration
 */
export async function unsort (unsorted: number[], configuration?: UnsortConfiguration): Promise<number[]> {
  return sort(unsorted, configuration ?? globalConfiguration)
}

/**
 * Function which checks the configuration and sorts the array according to it
 * @param unsorted
 * @param configuration
 */
function sort (unsorted: number[], configuration: UnsortConfiguration): Promise<number[]> {
  return new Promise(async (resolve) => {
    if (configuration.useGlobalEdgeCache) {
      const response = await checkGlobalEdgeCache(unsorted)

      if (response.sorted) {
        resolve(response.sorted)
      }
    }

    resolve(await sortLocally(unsorted))
  })
}

/**
 * Check the global edge cache and return its response
 * @param unsorted
 */
async function checkGlobalEdgeCache (unsorted: number[]): Promise<GlobalEdgeCacheResponse> {
  const response = await fetch('https://yvnpbuptgigylqeuxyng.functions.supabase.co/unsort-global-edge-cache', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnBidXB0Z2lneWxxZXV4eW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTE2NjcwMTMsImV4cCI6MTk2NzI0MzAxM30.gvTuy828d3HRZshNqx5HmRISCqfcB7PvHOl6iHsL8O8'
    },
    body: JSON.stringify({
      unsorted
    })
  })

  return await response.json() as GlobalEdgeCacheResponse
}

/**
 * Sort the array locally and return the sorted array
 * @param unsorted
 */
async function sortLocally (unsorted: number[]): Promise<number[]> {
  return new Promise(async (resolve) => {
    const sorted: number[] = []

    const sortTimeoutHandler = (number: number) => {
      sorted.push(number)

      if (sorted.length === unsorted.length) {
        resolve(sorted)
      }
    }

    for (const number of unsorted) {
      setTimeout(() => sortTimeoutHandler(number), number)
    }
  })
}
