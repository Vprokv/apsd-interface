import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { TabStateContext } from '@/Pages/Search/Pages/constans'

const Index = () => {
  const {
    tabState: { data = [] },
  } = useContext(TabStateContext)

  const titles = useMemo(
    () =>
      data.map(({ dss_attr_label }) => (
        <div
          key={dss_attr_label}
          className="flex h-10 font-size-14 items-center mb-5"
        >
          {dss_attr_label}
        </div>
      )),
    [data],
  )

  return <div className="flex flex-col">{titles}</div>
}

Index.propTypes = {}

export default Index