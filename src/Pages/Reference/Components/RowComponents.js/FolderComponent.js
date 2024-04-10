import React from 'react'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'

const FolderComponent = ({}) => {
  return (
    <div className={`flex flex-col w-full ${isDisplayed ? '' : 'mb-4'}`}>
      <button
        type="button"
        className="flex items-start w-full"
        onClick={() => {}}
      >
        <span className={selected ? 'color-blue-1 mr-auto' : 'mr-auto'}>
          {name}
        </span>
        <Icon
          icon={angleIcon}
          size={10}
          className={`${isDisplayed ? '' : 'rotate-180'} mt-1`}
        />
      </button>
      {isDisplayed && (
        <div className="flex flex-col mt-4 pl-4">
          {childs.map(renderEntities())}
        </div>
      )}
    </div>
  )
}

export default FolderComponent
