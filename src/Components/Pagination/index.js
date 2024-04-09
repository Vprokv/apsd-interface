import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { PaginationButton } from './styles'
import Icon from '@Components/Components/Icon'
import angleIcon from '../../Icons/angleIcon'
import doubleAngleIcon from '../../Icons/doubleAngleIcon'

const Pagination = ({
  children,
  className,
  setLimit,
  limit,
  page,
  setPage,
  total,
  disabled, // TODO в поиске нет лимита и нужно ограничить переход
}) => {
  const onSetLimit = useCallback(
    (limit) => () => {
      setLimit(limit)
    },
    [setLimit],
  )

  const goToPage = useCallback(
    (nextPage) => () => {
      let result = page + nextPage
      result = result > 1 ? result : 1
      if (result * limit >= total) {
        result = Math.ceil(total / limit)
      }
      if (result !== page) {
        setPage(result > 1 ? result : 1)
      }
    },
    [limit, page, setPage, total],
  )

  const buttons = useMemo(() => {
    const arr = []
    const nextPageValue = Math.ceil((total - page * limit) / limit) || 0
    // ищем есть ли справа 2 значения от текущего положения
    // если есть оставляем 0, если нет
    // может нам надо проверить еще и, если есть справа налево два?
    const gap =
      nextPageValue - page - 2 >= 0 || nextPageValue - page - 2 <= -2
        ? 1
        : nextPageValue - page - 2
    // console.log(page, 'page')
    // console.log(gap, 'gap')
    const startValue = page - 2 - gap > 0 ? page - 2 - gap : 0
    // console.log(startValue, 'str')
    for (let i = startValue; i < startValue + 5 && i < total / limit; i++) {
      arr.push(
        <PaginationButton
          className="mr-1.5"
          active={page === i + 1}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </PaginationButton>,
      )
    }

    return arr
  }, [limit, page, setPage, total])

  return (
    <div className={`${className} flex item-center`}>
      <div className="flex item-center mr-auto">
        <PaginationButton
          className="mr-2"
          active={limit === 10}
          onClick={onSetLimit(10)}
        >
          10
        </PaginationButton>
        <PaginationButton
          className="mr-2"
          active={limit === 25}
          onClick={onSetLimit(25)}
        >
          25
        </PaginationButton>
        <PaginationButton
          className="mr-2"
          active={limit === 50}
          onClick={onSetLimit(50)}
        >
          50
        </PaginationButton>
        <PaginationButton
          className="mr-2"
          active={limit === 100}
          onClick={onSetLimit(100)}
        >
          100
        </PaginationButton>
      </div>
      <div className="flex items-center justify-center color-text-secondary">
        <button type="button" onClick={goToPage(-10)}>
          <Icon icon={doubleAngleIcon} className="rotate-180 mr-1.5" />
        </button>
        <button type="button" onClick={goToPage(-1)}>
          <Icon icon={angleIcon} className="rotate-90 mr-1.5" size={11} />
        </button>
        {/* <PaginationButton className="mr-1.5" active>*/}
        {/*  {page}*/}
        {/* </PaginationButton>*/}
        {buttons}
        <button type="button" onClick={goToPage(1)}>
          <Icon icon={angleIcon} size={11} className="mr-1.5 rotate-270" />
        </button>
        <button type="button" onClick={goToPage(10)} disabled={disabled}>
          <Icon icon={doubleAngleIcon} />
        </button>
      </div>
      <div className="ml-auto color-text-secondary font-size-12">
        {children}
      </div>
    </div>
  )
}

Pagination.propTypes = {
  setLimit: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  limit: PropTypes.number,
  page: PropTypes.number,
  total: PropTypes.number,
}

Pagination.defaultProps = {
  className: '',
  page: 1,
  limit: 10,
  total: 0,
  disabled: false,
}

export default Pagination
