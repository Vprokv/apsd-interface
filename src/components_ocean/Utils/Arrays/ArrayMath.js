import preciseRounding from "../Math/preciseRounding"

export const arraySum = (array) => preciseRounding(array.reduce((acc, item) => acc + item))
export const arrayAverage = (array) => preciseRounding(arraySum(array) / array.length)
