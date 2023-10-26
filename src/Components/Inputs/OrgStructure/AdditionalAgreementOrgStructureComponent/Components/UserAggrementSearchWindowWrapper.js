import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { ApiContext, WINDOW_ADD_EMPLOYEE } from '@/contants'
import useDefaultFilter from '@/Components/Inputs/OrgStructure/useDefaultFilter'
import { useOpenNotification } from '@/Components/Notificator'
import usePagination from '@Components/Logic/usePagination'
import { URL_EMPLOYEE_LIST } from '@/ApiList'
import { AddUserOptionsFullName } from '@/Components/Inputs/UserSelect'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { OrgStructureWindowComponent } from '@/Components/Inputs/OrgStructure/style'
import { OrgStructureWindow } from '@/Components/Inputs/OrgStructure/UserSearchWindow'

OrgStructureWindow.propTypes = {
  setFilter: PropTypes.func,
  onClose: PropTypes.func,
  onSort: PropTypes.func,
  filter: PropTypes.shape({}),
  sortQuery: PropTypes.shape({}),
  loadFunction: PropTypes.func,
  setModalWindowOptions: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.shape({
    paginationState: PropTypes.any,
    setLimit: PropTypes.func,
    setPage: PropTypes.func,
  }),
}
const UserAggrementSearchWindowWrapper = ({
  onClose,
  open,
  filter: baseFilter,
  loadFunction,
  ...props
}) => {
  const api = useContext(ApiContext)
  const [paginationStateComp, setPaginationStateComp] = useState({})
  const [modalWindowOptions, setModalWindowOptions] = useState([])
  const defaultFilter = useDefaultFilter({ baseFilter })
  const [filter, setFilter] = useState(useDefaultFilter({ baseFilter }))
  const [sortQuery, onSort] = useState({})
  const getNotification = useOpenNotification()

  const pagination = usePagination({
    stateId: WINDOW_ADD_EMPLOYEE,
    state: paginationStateComp,
    setState: setPaginationStateComp,
    defaultLimit: 10,
  })

  const sort = useMemo(() => {
    const { key, direction } = sortQuery
    if (!key || !direction) {
      return []
    }

    return [
      {
        property: sortQuery.key,
        direction: sortQuery.direction,
      },
    ]
  }, [sortQuery])

  const loadRef = useCallback(async () => {
    try {
      const { limit, offset } = pagination.paginationState

      const data = await loadFunction(api)(filter)({
        limit,
        offset,
        sort,
      })

      const content = data.map(AddUserOptionsFullName)

      setModalWindowOptions(content)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    filter,
    getNotification,
    loadFunction,
    pagination.paginationState,
    sort,
  ])

  const closeFunc = useCallback(() => {
    onClose()
    setFilter({ ...defaultFilter, ...baseFilter })
  }, [onClose, defaultFilter, baseFilter])

  return (
    <OrgStructureWindowComponent
      onClose={closeFunc}
      open={open}
      title="Добавление сотрудника"
      index={1001}
    >
      <OrgStructureWindow
        {...props}
        filter={filter}
        setFilter={setFilter}
        onSort={onSort}
        sortQuery={sortQuery}
        loadFunction={loadRef}
        pagination={pagination}
        options={modalWindowOptions}
        setModalWindowOptions={setModalWindowOptions}
        onClose={closeFunc}
      />
    </OrgStructureWindowComponent>
  )
}

UserAggrementSearchWindowWrapper.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  filter: PropTypes.object,
  loadFunction: PropTypes.func,
}

export default UserAggrementSearchWindowWrapper
