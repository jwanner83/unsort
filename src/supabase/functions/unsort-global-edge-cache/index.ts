import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { unsort } from '../../../mod.ts'
import GlobalEdgeCacheResponse from '../../../interfaces/GlobalEdgeCacheResponse.ts'

const cache: { [key: string]: string } = {
  '[2,1,3]': '[1,2,3]'
}

serve(async (req) => {
  const { unsorted } = await req.json()

  const data: GlobalEdgeCacheResponse = {}

  if (!unsorted || !Array.isArray(unsorted)) {
    data.message = 'unsorted array has wrong format'
  }

  const hit = cache[JSON.stringify(unsorted)]
  if (hit) {
    data.cacheHit = true
    data.sorted = JSON.parse(hit)
  } else {
    data.sorted = await unsort(unsorted, { useGlobalEdgeCache: false })
  }

  return new Response(
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
  )
})
