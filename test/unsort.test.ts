import { assert, describe, it } from 'vitest'
import { unsort } from '../src/mod'

describe.concurrent('simple unsort', () => {
  it('numbers between 1 and 3', async () => {
    const sorted = await unsort([2,1,3], { useGlobalEdgeCache: false })
    assert.deepEqual(sorted, [1,2,3])
  })

  it('numbers between 100 and 300', async () => {
    const sorted = await unsort([200,100,300], { useGlobalEdgeCache: false })
    assert.deepEqual(sorted, [100,200,300])
  })

  it('numbers between 1000 and 3000', async () => {
    const sorted = await unsort([2000,1000,3000], { useGlobalEdgeCache: false })
    assert.deepEqual(sorted, [1000,2000,3000])
  })

  it('numbers between 1 and 3000', async () => {
    const sorted = await unsort([200,1,3000], { useGlobalEdgeCache: false })
    assert.deepEqual(sorted, [1,200,3000])
  })
})

describe('medium unsort', () => {
  it('100 random numbers between 1 and 10000', async () => {
    const unsorted = []
    for (let i = 0; i < 100; i++) {
      unsorted.push(Math.floor(Math.random() * 10000))
    }
    const sorted = await unsort(unsorted, { useGlobalEdgeCache: false })
    assert.deepEqual(sorted, unsorted.sort())
  }, 11000)
})
