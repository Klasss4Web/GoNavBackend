export function getNextItem(arr, key, value) {
  const index = arr.findIndex((item) => item[key] === value);
  if (index === -1 || index === arr.length - 1) {
    return null; // not found or no next item
  }
  return arr[index + 1];
}

export function countItemsLeft(arr, key, value) {
  const index = arr.findIndex((item) => item[key] === value);
  if (index === -1) return null; // not found
  return arr.length - (index + 1);
}
