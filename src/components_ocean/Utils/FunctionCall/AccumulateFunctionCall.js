export default function AccumulateFunctionCall (fn, time) {
  let timeout
  const args = []
  return function (...a) {
    clearTimeout(timeout)
    args.push(a)
    timeout = setTimeout(() => fn.apply(this, args.splice(0, args.length)), time)
  }
}
