import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import styled from 'styled-components'
import IterationRemarks from '@/Pages/Tasks/item/Pages/Remarks/Components/RowComponent'

const Row = styled.div`
  background-color: var(--notifications);
  height: 50px;
  font-size: 12px;
  border-bottom: 1px solid var(--separator);
  align-content: center;
  justify-content: flex-start;
`

const IterationComponent = ({
  iterations,
  stageName,
  isDisplayed,
  toggleDisplayedFlag,
}) => {
  const [show, setShow] = useState({})

  const toggleIterationDisplayedFlag = useCallback(
    (id) =>
      setShow(({ [id]: current = false, ...map }) => {
        const prev = { ...map }

        return { ...prev, [id]: !current }
      }),
    [setShow],
  )

  return (
    <>
      <button type={'button'} onClick={toggleDisplayedFlag}>
        <Row className="h-12 flex items-center">
          <div className="pl-2">
            <Icon
              icon={angleIcon}
              size={10}
              className={`color-text-secondary ${
                !isDisplayed ? '' : 'rotate-180'
              }`}
            />
          </div>
          <div className="ml-4 font-medium flex items-center ">
            {`${stageName}`}
          </div>
        </Row>
      </button>
      {!isDisplayed &&
        iterations
          .map(({ number, remarks }) => (
            <>
              <button
                type={'button'}
                onClick={() => toggleIterationDisplayedFlag(number)}
              >
                <Row className="h-12 flex items-center">
                  <div className="pl-2">
                    <Icon
                      icon={angleIcon}
                      size={10}
                      className={`color-text-secondary ${
                        !show[number] ? '' : 'rotate-180'
                      }`}
                    />
                  </div>
                  <div className="ml-4 font-medium flex items-center ">
                    {`${stageName} (Итерация ${number})`}
                  </div>
                </Row>
              </button>
              {!show[number] && <IterationRemarks remarks={remarks} />}
            </>
          ))
          .reverse()}
    </>
  )
}

IterationComponent.propTypes = {
  iterations: PropTypes.array,
  stageName: PropTypes.string,
  isDisplayed: PropTypes.bool,
  toggleDisplayedFlag: PropTypes.func,
}

export default IterationComponent
