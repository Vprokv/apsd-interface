import { forwardRef } from 'react'

// обвертка оптимизирующая кол-во декораторов
// хуки внутри мемоизированны и сами знают, какие им зависимости брать, менять и тд
// если хуки не пересчитались, пропсы остались те же дальше не будет ререндеров
// предоставляем возможность модифировать оригинальный компонент декораторами
const useStagesHooksWrapper = (hooks, Component) =>
  forwardRef((props, ref) => {
    // получаем изменненные хуками пропсы и завернутые в декораторы компоненты
    const { component: ResolvedComponent, ...resolvedProps } = hooks.reduce(
      (acc, h) => ({ ...acc, ...h(acc) }),
      {
        ...props, // передаем оригинальные пропсы в хуки
        component: Component, // передаем оригинальный компонент в хуки
      },
    )
    // отрисовываем модифицированный компонент и пропсы
    return <ResolvedComponent ref={ref} {...resolvedProps} />
  })
export default useStagesHooksWrapper
