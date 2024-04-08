# Задача: Не используя UI (проверяем отделимость) реализовать и протестировать связи

## Сторы
- `mapBounds`: Хранит информацию о границах карты.
- `searchQuery`: Хранит строку запроса для поиска.
- `placemarks`: Хранит массив меток на карте.

## Фетчеры
- `fetchPlacemarks`: фетчит и сохраняет результат в placemarks
  
  **Параметры**: `mapBounds`, `searchQuery`, `useSavedFilter: boolean`
  

- `fetchSnippets`


  **Параметры**: `mapBounds`, `cluster?: {}`, `useSavedFilter?: boolean`
  

- `loadData`: вызывает `fetchPlacemarks` и `fetchSnippets`, дожидается результата обоих и отправляет результат в аналитику.


  **Парметры**: `useSavedFilter`

## Связи:
- При изменении mapBounds вызывается `loadData` с `useSavedFilter = true` и  актуальными значениями `mapBounds`, `searchQuery`
- При изменении `searchQuery` вызывается `loadData` с `useSavedFilter = false` и актуальным значением `mapBounds`
- При вызове `onClusterClick(cluster)` вызывается `fetchSnippets` с `cluster` и актуальным значением `mapBounds`
