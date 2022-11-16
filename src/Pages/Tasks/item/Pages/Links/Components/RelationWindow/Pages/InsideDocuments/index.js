import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { SearchComponent } from '@/Pages/Search'
import ScrollBar from '@Components/Components/ScrollBar'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import CreateRelationTable from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/InsideDocuments/Сomponents/CreateRelationTable'
import { StateContext } from '@/Pages/Tasks/item/Pages/Links/constans'

const InsideDocument = (props) => {
  const [selected, setSelected] = useState()
  const [value, setValue] = useState([])
  const close = useContext(StateContext)

  return (
    <>
      <div className="flex flex-col overflow-hidden h-full">
        <ScrollBar className="my-4">
          <SearchComponent
            multiple={true}
            setSelected={setSelected}
            selected={selected}
          />
          <CreateRelationTable selected={selected} value={value} />
        </ScrollBar>
      </div>
      <UnderButtons
        leftFunc={close}
        rightLabel="Добавить связь"
        rightFunc={useCallback(() => setValue(selected), [selected])}
      />
    </>
  )
}

InsideDocument.propTypes = {}

export default InsideDocument
