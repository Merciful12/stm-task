import { suite } from "uvu";
import * as assert from "uvu/assert";
import { mockFn } from './test-utils'
import { fork, allSettled } from 'effector';
import { placemarks, mapBounds, onClusterClick, searchQuery, fetchMapPlacemarksFx, fetchSnippetsFx, loadData } from './effector'

const effectorSuite = suite<{ server: ReturnType<typeof mockFn>, placemarksMock: Array<number> }>(
  "effectorSuite",
);

effectorSuite.before(context => {
  const placemarksMock = [1, 2, 3, 4, 5]
  context.placemarksMock = placemarksMock
  context.server = mockFn(() => Promise.resolve(placemarksMock))
})

effectorSuite.after.each(({ server }) => {
  server.clear();
})

effectorSuite('mapBounds changed', async ({ server }) => {
  const searchQueryMock = "123";

  const fetchMapPlacemarksMock = mockFn((sources, useFilter) => server({
    ...sources,
    useFilter,
    url: 'placemarks'
  }));
  const fetchSnippetsMock = mockFn((source, params) => server({
    ...source,
    useFilter: params.useSavedFilter,
    url: 'snippets'
  }));
  const scope = fork({
    values: [
      [searchQuery, searchQueryMock]
    ],
    handlers: [
      [fetchMapPlacemarksFx, fetchMapPlacemarksMock],
      [fetchSnippetsFx, fetchSnippetsMock]
    ]
  });
  const mapBoundsMock = { lat: 2, lon: 3 };

  await allSettled(mapBounds, { scope, params: mapBoundsMock })

  assert.equal(server.inputs()[0], {
    searchQuery: "123",
    mapBounds: mapBoundsMock,
    useFilter: true,
    url: 'placemarks'
  })
  assert.equal(server.inputs()[1], {
    ...mapBoundsMock,
    url: 'snippets',
    useFilter: true
  })
})

effectorSuite("searchQuery changed", async ({ server, placemarksMock }) => {
  const mapBoundsMock = { lat: 1, lon: 2 };
  const fetchMapPlacemarksMock = mockFn((sources, useFilter) => server({
    ...sources,
    useFilter,
    url: 'placemarks'
  }));
  const fetchSnippetsMock = mockFn((source, params) => server({
    ...source,
    useFilter: params.useSavedFilter,
    url: 'snippets'
  }));
  const scope = fork({
    values: [
      [mapBounds, mapBoundsMock]
    ],
    handlers: [
      [fetchMapPlacemarksFx, fetchMapPlacemarksMock],
      [fetchSnippetsFx, fetchSnippetsMock]
    ]
  });
  assert.equal(scope.getState(placemarks), [])
  await allSettled(searchQuery, { scope, params: "123" })

  assert.equal(server.inputs()[0], {
    searchQuery: "123",
    mapBounds: mapBoundsMock,
    useFilter: false,
    url: 'placemarks'
  })
  assert.equal(server.inputs()[1], {
    ...mapBoundsMock,
    url: 'snippets',
    useFilter: false
  })

  assert.equal(scope.getState(placemarks), placemarksMock)
});

effectorSuite.run();
