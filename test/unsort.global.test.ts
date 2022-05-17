import { unsort } from "../package/mod.ts";
import { assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";

Deno.test( 'numbers between 1 and 3 with global cache', async () => {
  const sorted = await unsort([2, 1, 3]);
  assertEquals(sorted, [1, 2, 3]);
})

Deno.test( 'numbers between 100 and 300 with global cache', async () => {
  const sorted = await unsort([200, 100, 300]);
  assertEquals(sorted, [100, 200, 300]);
})

Deno.test( 'numbers between 1000 and 3000 with global cache', async () => {
  const sorted = await unsort([2000, 1000, 3000]);
  assertEquals(sorted, [1000, 2000, 3000]);
})

Deno.test( 'numbers between 1 and 3000 with global cache', async () => {
  const sorted = await unsort([200, 1, 3000]);
  assertEquals(sorted, [1, 200, 3000]);
})

Deno.test( '100 random numbers between 1 and 1000 with global cache', async () => {
  const unsorted = [];
  for (let i = 0; i < 100; i++) {
    unsorted.push(Math.floor(Math.random() * 1000));
  }
  const sorted = await unsort(unsorted);
  assertEquals(
      sorted,
      unsorted.sort((a, b) => a - b),
  );
})

Deno.test( '100 random numbers between 1 and 10000 with global cache', async () => {
  const unsorted = [];
  for (let i = 0; i < 100; i++) {
    unsorted.push(Math.floor(Math.random() * 10000));
  }
  const sorted = await unsort(unsorted);
  assertEquals(
      sorted,
      unsorted.sort((a, b) => a - b),
  );
})