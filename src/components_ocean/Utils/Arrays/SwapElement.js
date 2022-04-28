export default function (array, initialIndex, destinationIndex) {
  const tempArray = Array.from(array)
  const target = tempArray[initialIndex]
  const destination = tempArray[destinationIndex]
  tempArray.splice(destinationIndex, 1, target)
  tempArray.splice(initialIndex, 1, destination)

  return tempArray
}
