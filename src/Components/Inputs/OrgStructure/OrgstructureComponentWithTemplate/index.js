import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import {
  OrgStructureWindowComponent,
  SelectedEmployeeContainer,
} from '@/Components/Inputs/OrgStructure/style'
import UserListTab from '@/Components/Inputs/OrgStructure/OrgstructureComponentWithTemplate/Components/UserListTab'
import TemplateTab from '@/Components/Inputs/OrgStructure/OrgstructureComponentWithTemplate/Components/TemplateTab'
import styled from 'styled-components'
import ScrollBar from '@Components/Components/ScrollBar'
import { Button } from '@Components/Components/Button'
import { useLoadableCache } from '@Components/Components/Inputs/Loadable'
import UserCard from "@/Components/Inputs/OrgStructure/Components/UserCard";
import Icon from "@Components/Components/Icon";
import closeIcon from "@/Icons/closeIcon";

const windowTabs = {
  user_list: UserListTab,
  default: UserListTab,
  template_list: TemplateTab,
}

export const NavigationButton = styled(Button)`
  font-weight: 500;
  font-size: 14px;
  padding: 8px 16px 8px;

  color: ${({ active }) =>
    active ? 'var(--blue-1)' : ' var(--text-secondary)'};
`

const OrgStructureComponentWithTemplateWindowWrapper = (props) => {
  const { onClose, open, value, multiple, valueKey, returnOption } = props
  const [navigation, setNavigation] = useState('user_list')
  const [selectState, setSelectState] = useState(value)
  const [modalWindowOptions, setModalWindowOptions] = useState([])

  const { valueKeys, cache } = useLoadableCache({
    ...props,
    optionsMap: useMemo(
      () =>
        modalWindowOptions.reduce((acc, item) => {
          acc[item[valueKey]] = item
          return acc
        }, {}),
      [valueKey, modalWindowOptions],
    ),
    value: selectState,
  })

  const RenderTabComponent = useMemo(() => {
    const { [navigation]: Component = windowTabs.default } = windowTabs
    return Component
  }, [navigation])

  const onRemoveSelectedValue = useCallback(
    (id) => () =>
      setSelectState((prevValue) => {
        if (multiple) {
          const nextValue = Array.isArray(prevValue) ? [...prevValue] : []
          const findIndexFunc = returnOption
            ? ({ [valueKey]: objValueKey }) => objValueKey === id
            : (objValueKey) => objValueKey === id
          nextValue.splice(nextValue.findIndex(findIndexFunc), 1)
          return nextValue
        }
        return undefined
      }),
    [multiple, returnOption, valueKey],
  )

  const renderEmployee = useMemo(
    () =>
      valueKeys.map((value) => {
        const obj = cache.get(value)
        if (obj) {
          return (
            <div className="bg-form-input-color p-3 flex mb-2 min-" key={value}>
              <UserCard {...obj} widthDepartment={true} />
              <Button
                onClick={onRemoveSelectedValue(value)}
                type="button"
                className="ml-auto padding-null mb-auto height-small"
              >
                <Icon
                  icon={closeIcon}
                  size={10}
                  className="color-text-secondary"
                />
              </Button>
            </div>
          )
        }
      }),
    [valueKeys, cache, onRemoveSelectedValue],
  )

  return (
    <OrgStructureWindowComponent
      onClose={onClose}
      open={open}
      title="Добавление сотрудника"
      index={1001}
    >
      <div className="flex flex-col overflow-hidden h-full">
        <div className="flex  overflow-hidden  h-full">
          <SelectedEmployeeContainer>
            <ScrollBar className="pr-6 py-4">{renderEmployee}</ScrollBar>
          </SelectedEmployeeContainer>
          <div className="flex-container w-full">
            <div className="border-b-2 color-secondary h-10 w-full mx-4">
              <NavigationButton
                active={navigation === 'user_list'}
                onClick={() => setNavigation('user_list')}
              >
                Выбор из справочника
              </NavigationButton>
              <NavigationButton
                active={navigation === 'template_list'}
                onClick={() => setNavigation('template_list')}
              >
                Выбор из шаблона
              </NavigationButton>
            </div>
            <RenderTabComponent
              {...props}
              options={modalWindowOptions}
              setModalWindowOptions={setModalWindowOptions}
              selectState={selectState}
              setSelectState={setSelectState}
              valueKeys={valueKeys}
              cache={cache}
            />
          </div>
        </div>
      </div>
    </OrgStructureWindowComponent>
  )
}

OrgStructureComponentWithTemplateWindowWrapper.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  filter: PropTypes.object,
  type: PropTypes.string,
  docId: PropTypes.string,
}

OrgStructureComponentWithTemplateWindowWrapper.defaultProps = {
  open: () => null,
  onClose: () => null,
  type: undefined,
  docId: undefined,
  filter: {},
}

export default OrgStructureComponentWithTemplateWindowWrapper
