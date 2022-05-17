import { unsort } from 'unsort'

;(async () => {
  const unsorted = []
  for (let i = 0; i < 20; i++) {
    unsorted.push(Math.floor(Math.random() * 1000))
  }
  const sorted = await unsort(unsorted)
  console.log('unsorted', sorted)
})()
