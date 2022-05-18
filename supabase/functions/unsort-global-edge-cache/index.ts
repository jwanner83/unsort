import { PostgrestResponse } from "https://cdn.esm.sh/v78/@supabase/postgrest-js@0.37.2/dist/module/lib/types.d.ts";
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.33.2";
import GlobalEdgeCacheResponse from "../../../package/interfaces/GlobalEdgeCacheResponse.ts";
import { unsort } from "../../../package/mod.ts";
import { CacheDatabaseResponse } from "./interfaces/CacheDatabaseResponse.ts";
import { CacheHitResponse } from "./interfaces/CacheHitResponse.ts";

/**
 * The cors headers
 */
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

/**
 * The supabase client
 */
export const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
);

/**
 * The entry function which gets called as soon as the edge function gets called
 */
serve(async (request: Request) => {
  // if is invoked in browser environment
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  const { unsorted } = await request.json();
  const data: GlobalEdgeCacheResponse = {};

  // validate the input array
  data.message = validateInput(unsorted);
  if (data.message) {
    // if the message is set, return it to the client
    return respond(data);
  }

  // resolve the cache
  const cacheHitResponse = await resolveCacheHit(unsorted);
  data.cacheHit = cacheHitResponse.hit;
  if (cacheHitResponse.hit) {
    // if the cache resolve resulted in a hit, set sorted with the value of the cache
    data.sorted = cacheHitResponse.sorted;
  } else {
    // if the cache resolve didn't return a result, use unsort to sort the array
    const sorted = await unsort(unsorted, { useGlobalEdgeCache: false });
    data.sorted = sorted;
    // after sorting, save the unsorted, sorted key value pair to the cache database
    await saveToCache(unsorted, sorted);
  }

  return respond(data);
}).then();

function respond(data: GlobalEdgeCacheResponse): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      ...cors,
      "Content-Type": "application/json"
    },
  });
}

/**
 * Validate the input array
 * @param unsorted
 */
function validateInput(unsorted: number[]): string {
  if (!unsorted || !Array.isArray(unsorted)) {
    return "unsorted array has wrong format";
  }

  return "";
}

/**
 * Check the cache database if the unsorted array is already saved to it. If true, return
 * the sorted array from the database
 * @param unsorted
 */
async function resolveCacheHit(unsorted: number[]): Promise<CacheHitResponse> {
  const response: PostgrestResponse<CacheDatabaseResponse> = await supabase
    .from("cache")
    .select("sorted")
    .eq("unsorted", `{${unsorted.toString()}}`);

  if (response.error || response.data.length === 0) {
    return {
      hit: false,
    };
  } else {
    return {
      hit: true,
      sorted: response.data[0].sorted,
    };
  }
}

/**
 * Save the sorted array to the database
 * @param unsorted
 * @param sorted
 */
async function saveToCache(unsorted: number[], sorted: number[]) {
  await supabase.from("cache").insert([{ unsorted, sorted }]);
}
