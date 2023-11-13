import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import { SearchButton } from '../UserSelect'
import Documents, { tableConfig } from '@/Pages/Search/Pages/DocumentSearch'
import { CreateLinkComponent } from '@/Pages/Tasks/item/Pages/Links/styles'
import { SelectedItemsContainer } from '@/Components/Inputs/DocumentSelect/styles'
import ScrollBar from '@Components/Components/ScrollBar'
import { URL_TYPE_CONFIG } from '@/ApiList'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import RowComponent from '@/Components/ListTableComponents/EmitValueRowComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import Button, { SecondaryBlueButton } from '@/Components/Button'
import closeIcon from '@/Icons/closeIcon'
import { useLoadableCache } from '@Components/Components/Inputs/Plugins/Loadable'
import Input from '../../Fields/Input'
import ShowDocumentComponent from '@/Components/Inputs/DocumentSelect/Component/ShowDocumentComponent'
import Tips from '@/Components/Tips'

const changeInput = () => {}

const DocumentSelect = ({
  className,
  filter,
  options,
  displayName,
  ...props
}) => {
  const { multiple, returnOption, valueKey, value, onInput, id } = props
  const [open, setOpen] = useState(false)
  const [searchState, setSearchState] = useState({})
  const [selectedState, setSelectedState] = useState(value)
  const [filterState, setFilterState] = useState(filter)
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpen(nextState)
    },
    [],
  )

  useEffect(() => {
    if (!selectedState) {
      setSelectedState(value)
    }
  }, [open, selectedState, value])

  const { cache } = useLoadableCache({
    ...props,
    optionsMap: useMemo(
      () =>
        [...options, ...(searchState.results || [])].reduce((acc, item) => {
          acc[item[valueKey]] = item
          return acc
        }, {}),
      [options, searchState.results, valueKey],
    ),
    value: selectedState,
  })

  const renderValue = useMemo(() => {
    if (selectedState) {
      const pattern = displayName?.match(/[A-z_]+/gi) || []
      const getLabel = (value) => {
        const obj = cache.get(value)
        return obj ? pattern.map((key) => obj.values[key]).join(' ') : ''
      }

      if (Array.isArray(selectedState)) {
        return selectedState.map(
          returnOption ? (v) => getLabel(v[valueKey]) : (v) => getLabel(v),
        )
      } else {
        return getLabel(returnOption ? selectedState[valueKey] : selectedState)
      }
    }
  }, [cache, displayName, returnOption, selectedState, valueKey])

  const openModalWindow = useCallback(() => {
    changeModalState(true)()
    setSelectedState(value)
  }, [changeModalState, value])
  const loadDocType = useCallback(
    (api) => async () => {
      const { data } = await api.post(URL_TYPE_CONFIG, {
        typeConfig: filter.type,
      })
      return data
    },
    [filter],
  )

  const handleSelectClick = useCallback(
    (obj) => () => {
      setSelectedState(returnOption ? obj : obj.id)
    },
    [setSelectedState, returnOption],
  )

  const onRemoveSelectedValue = useCallback(
    (id) => () =>
      setSelectedState((prevValue) => {
        if (multiple) {
          const nextValue = Array.isArray(prevValue) ? [...prevValue] : []
          const findIndexFunc = returnOption
            ? ({ [valueKey]: objValueKey }) => objValueKey === id
            : (objValueKey) => objValueKey === id
          nextValue.splice(nextValue.findIndex(findIndexFunc, 1))
          return nextValue
        }
        return undefined
      }),
    [multiple, returnOption, valueKey],
  )
  const handleClick = useCallback(() => {
    onInput(selectedState, id)
    changeModalState(false)()
  }, [onInput, selectedState, id, changeModalState])

  const onClose = useCallback(() => {
    changeModalState(false)()
    setSelectedState(undefined)
  }, [changeModalState])

  const tableSettings = useMemo(
    () =>
      multiple
        ? {
            plugins: {
              selectPlugin: {
                driver: FlatSelect,
                component: CheckBox,
                style: { margin: 'auto 0' },
                valueKey,
                returnObjects: returnOption,
              },
            },
          }
        : {
            rowComponent: (props) => (
              <RowComponent onClick={handleSelectClick} {...props} />
            ),
          },
    [handleSelectClick, multiple, returnOption, valueKey],
  )

  return (
    <div className={`${className} flex items-center w-full`}>
      <Input
        {...props}
        value={renderValue}
        onInput={changeInput}
        onFocus={openModalWindow}
      />
      <Tips text="Поиск по титулам">
        <SearchButton onClick={openModalWindow} className="ml-1">
          <Icon icon={searchIcon} />
        </SearchButton>
      </Tips>
      <ShowDocumentComponent className="ml-1" selectedState={selectedState} />
      <CreateLinkComponent
        open={open}
        onClose={changeModalState(false)}
        title="Поиск по документам"
      >
        <div className="flex-container overflow-hidden">
          <div className="flex h-full overflow-hidden">
            <SelectedItemsContainer>
              <ScrollBar className="pr-6 py-4">
                {useMemo(
                  () =>
                    (renderValue
                      ? Array.isArray(renderValue)
                        ? renderValue
                        : [renderValue]
                      : []
                    ).map((key) => (
                      <div
                        className="bg-form-input-color p-3 flex mb-2 min-"
                        key={value}
                      >
                        {key}
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
                    )),
                  [onRemoveSelectedValue, renderValue, value],
                )}
              </ScrollBar>
            </SelectedItemsContainer>
            <Documents
              documentTypeLoadFunction={loadDocType}
              setSearchState={setSearchState}
              filter={filterState}
              setFilter={setFilterState}
            >
              {(closeTable) => (
                <>
                  <SecondaryBlueButton
                    onClick={closeTable}
                    className="ml-auto form-element-sizes-32"
                  >
                    Изменить условие
                  </SecondaryBlueButton>
                  <ScrollBar className="px-4">
                    <ListTable
                      {...tableSettings}
                      headerCellComponent={HeaderCell}
                      columns={tableConfig}
                      value={searchState.results}
                      selectState={selectedState}
                      onSelect={setSelectedState}
                    />
                  </ScrollBar>
                </>
              )}
            </Documents>
          </div>
          <div className="flex items-center justify-end">
            <Button
              className="bg-light-gray flex items-center w-60 rounded-lg mr-4 justify-center"
              onClick={onClose}
            >
              Закрыть
            </Button>
            <Button
              className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center"
              onClick={handleClick}
            >
              Выбрать
            </Button>
          </div>
        </div>
      </CreateLinkComponent>
    </div>
  )
}

DocumentSelect.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.object,
  displayName: PropTypes.string,
  onInput: PropTypes.func,
  id: PropTypes.string,
  multiple: PropTypes.bool,
  returnOption: PropTypes.bool,
  valueKey: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.string,
}

DocumentSelect.defaultProps = {
  className: '',
  filter: { type: 'ddt_startup_complex_type_doc' },
  onInput: () => null,
  displayName: '',
  valueKey: '',
  id: '',
  options: [],
}

export default DocumentSelect
