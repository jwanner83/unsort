![unsort](docs/assets/lead.svg)

# unsort

An unreliable and overall unusable sorting library for numbers with a global
cache on the edge.

## the algorithm

This library implements a number sorting algorithm which is based on time.

Let's say we have an array with three numbers: 200, 100 and 300.

```ts
const unsorted = [200, 100, 300];
```

First, a new, empty array is created.

```ts
const sorted = [];
```

Second, the array with the unsorted numbers gets iterated over and a new timeout
is created with the number of the current number as its timeout value.

```ts
for (const value of unsorted) {
  setTimeout(() => {
    sorted.push(value);
  }, value);
}
```

The lowest number gets put into the sorted array first, after that the
second-lowest number and so on and on till the sorted array is filled with all
numbers in the correct order.

## global cache on the edge

If the option `useGlobalEdgeCache` is set to true (which is default), a global
cache on the edge will be used to increase the performance of this algorithm.

After the `unsort` method is called, a request will be made to a supabase edge
function which then checks its database, if the unsorted array is already sorted
in the database. If this is the case, the sorted value from the database will be
returned instead of sorting the whole array again.

If the array couldn't be found in the database, it will be sorted in the edge
function and saved to the cache database to be available for future sorting
requests.

If, for whatever reason, the request to the global cache on the edge fails, the
array will be sorted locally, without saving it anywhere to a cache.

## performance

The performance depends mostly on the highest number of the array which will be
sorted. If you want to sort the following array: `[1, 2, 3000]` the sorting will
take approximately `3000ms`, except it was found in the global cache on the
edge. Then it would take approximately `500ms`.

## drawbacks

[Because of the spec](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers)
of `setTimeout`, values beneath `4` will, at least sometimes, not be correctly
sorted. The runtime will do its best to handle these cases, but it will fail
sometimes.

## usage

Don't. But if you really want, here you go.

### import

#### deno

1. Import it `import { unsort } from 'https://esm.sh/unsort'`
2. Profit.

#### node

1. Install it `pnpm i unsort`
2. Import it `import { unsort } from 'unsort'`
3. Profit.

### code

```ts
const sorted = await unsort([300, 100, 200]); // results in [100, 200, 300] - hopefully
```

#### options

##### set global options

```ts
import { updateGlobalUnsortConfiguration } from "unsort";

updateGlobalUnsortConfiguration({
  useGlobalEdgeCache: false,
});
```

##### set options for single call

```ts
const sorted = await unsort([300, 100, 200], {
  useGlobalEdgeCache: false,
});
```

## development

This package is a deno package which is built with
[`dnt`](https://github.com/denoland/dnt) to be able to use it in Node.js.

It also contains a supabase edge function which is inside of the supabase
folder. The code there is deno as well, because supabase edge functions are
built with deno as well.

### commands

#### build package

To build the package to a node compatible one, run `deno run -A build.ts` from
the repository root.

#### build edge function

The edge function is built with the supabase cli. run
`supabase functions deploy unsort-global-edge-cache` from the repository root to
deploy a new version of the edge function to the supabase instance.

#### format

To format the code, run the deno formatter `deno fmt` from the project root.
