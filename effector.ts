import { createEffect, createStore, createEvent, sample, attach, restore } from "effector";

export const mapBounds = createStore({});
export const searchQuery = createStore("");

export const onClusterClick = createEvent<Record<string, string>>()

export const fetchMapPlacemarksFx = attach({
  source: { mapBounds, searchQuery },
  effect: ({ mapBounds, searchQuery }, useSavedFilter: boolean) => {
    return Promise.resolve(new Array<number>());
  }
});

export const placemarks = restore(fetchMapPlacemarksFx.doneData, []);

export const fetchSnippetsFx = attach({
  source: mapBounds,
  effect: async (
    mapBounds,
    {
      cluster,
      useSavedFilter,
    }: { useSavedFilter?: boolean; cluster?: Record<string, string> }
  ) => {
    return Promise.resolve({ mapBounds, useSavedFilter, cluster });
  }
});

export const loadData = createEffect(async (useSavedFilter: boolean) => {
  const data = await Promise.all([
    fetchMapPlacemarksFx(useSavedFilter),
    fetchSnippetsFx({ useSavedFilter }),
  ])
  return fetch('', {
    body: JSON.stringify({
      analytics1: data[0],
      analytics2: data[1]
    })
  })
});

sample({
  clock: onClusterClick,
  target: fetchSnippetsFx,
})

sample({
  clock: mapBounds,
  fn: () => true,
  target: loadData,
})
sample({
  clock: searchQuery,
  fn: () => false,
  target: loadData,
})
