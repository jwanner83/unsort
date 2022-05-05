import { assert, describe, it } from 'vitest'
import { unsort } from '../src/mod'

describe.concurrent('unsort without global cache', () => {
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

describe.concurrent('unsort with global cache', () => {
  it('numbers between 1 and 3', async () => {
    const sorted = await unsort([2,1,3])
    assert.deepEqual(sorted, [1,2,3])
  })

  it('numbers between 100 and 300', async () => {
    const sorted = await unsort([300,200,100])
    assert.deepEqual(sorted, [100,200,300])
  })

  it('numbers between 1000 and 3000', async () => {
    const sorted = await unsort([2000,1000,3000])
    assert.deepEqual(sorted, [1000,2000,3000])
  })

  it('numbers between 1 and 3000', async () => {
    const sorted = await unsort([200,1,3000])
    assert.deepEqual(sorted, [1,200,3000])
  })
})
