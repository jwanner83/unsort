import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'

console.log("Hello from Functions!")

serve(async (req) => {
  const { unsorted } = await req.json()

  let data = {
    message: ''
  }

  if (!unsorted || !Array.isArray(unsorted)) {
    data.message = 'unsorted has wrong format'
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})
