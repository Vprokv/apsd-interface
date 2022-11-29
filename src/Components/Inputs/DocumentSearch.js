import React, { useCallback, useState } from 'react'
import Documents from '@/Pages/Search/Pages/Documents'
import { SearchButton } from './UserSelect'
import Select from './Select'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import { CreateLinkComponent } from '@/Pages/Tasks/item/Pages/Links/styles'

const DocumentSearch = (props) => {
  const [open, setOpen] = useState(false)

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpen(nextState)
    },
    [],
  )
  return (
    <div>
      <div className="flex items-center w-full">
        <Select {...props} />
        <SearchButton onClick={changeModalState(true)} className="ml-1">
          <Icon icon={searchIcon} />
        </SearchButton>
      </div>
      <DocumentSearchWindowWrapper
        open={open}
        onClose={changeModalState(false)}
      />
    </div>
  )
}

export default DocumentSearch

const DocumentSearchWindowWrapper = (props) => (
  <CreateLinkComponent {...props} title="Поиск по документам">
    <Documents {...props} />
  </CreateLinkComponent>
)
