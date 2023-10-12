import { forwardRef } from 'react'

const useStagesHooksWrapper = (hooks, Component) =>
  forwardRef((props, ref) => (
    <Component
      ref={ref}
      {...hooks.reduce((acc, h) => ({ ...acc, ...h(acc) }), {
        ...props,
      })}
    />
  ))
export default useStagesHooksWrapper
