import React, { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import CheckBox from '@/Components/Inputs/CheckBox'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import log from 'tailwindcss/lib/util/log'

const CheckBoxes = () => {
  const {
    tabState: { data = [] },
    checked = new Map(),
    setChecked,
  } = useContext(TabStateContext)

  const onInput = useCallback(
    (val) => (a) => {
      const prevChecked = new Map(checked)
      return checked.get(val)
        ? setChecked(prevChecked.set(val, false))
        : setChecked(prevChecked.set(val, a))
    },
    [checked, setChecked],
  )

  return (
    <div className="flex flex-col items-center">
      {data?.map(({ dss_attr_name }) => {
        return (
          <div key={dss_attr_name} className="flex items-center h-10 mb-5">
            <div className=" mr-4 font-size-14 flex items-center ">
              Частичное совпадение
            </div>
            <CheckBox
              value={checked.get(dss_attr_name)}
              className="flex flex-center"
              onInput={onInput(dss_attr_name)}
            />
          </div>
        )
      })}
    </div>
  )
}

CheckBoxes.propTypes = {}

export default CheckBoxes
