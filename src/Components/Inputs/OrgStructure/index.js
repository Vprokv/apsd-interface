import React, {useCallback, useContext, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {userAtom} from '@Components/Logic/UseTokenAndUserStorage'
import Icon from '@Components/Components/Icon'
import searchIcon from "@/Icons/searchIcon"
import styled from "styled-components"
import {ApiContext, WINDOW_ADD_EMPLOYEE} from "@/contants"
import {URL_EMPLOYEE_LIST} from "../../../ApiList"
import {useRecoilValue} from "recoil"
import usePagination from "../../../components_ocean/Logic/usePagination"
import AddEmployee from "./UserSearchWindow"
import UserSelect from "./BaseUserSelect"

export const AddUserOptionsFullName = (v) => ({ ...v, fullName:  `${v.firstName} ${v.middleName} ${v.lastName}` })

export const SearchButton = styled.button.attrs({type: "button"})`
  background-color: var(--light-blue);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: var(--form--elements_height);
  width: var(--form--elements_height);
`

const OrgStructure = ({options, ...props}) => {
  const api = useContext(ApiContext)
  const [modalWindowOptions, setModalWindowOptions] = useState([])
  const [sortQuery, onSort] = useState({})
  const [paginationStateComp, setPaginationStateComp] = useState({})
  const {
    organization: [{
      r_object_id: organization = "",
      branches: [{r_object_id: branchId = ""}] = [{}]
    }] = [{}],
  } = useRecoilValue(userAtom)
  const [addEmployeeWindow, setAddEmployeeWindowState] = useState(false)
  const openEmployeeWindow = useCallback(() => setAddEmployeeWindowState(true), [])
  const closeEmployeeWindow = useCallback(() => setAddEmployeeWindowState(false), [])
  const [filter, setFilter] = useState({organization, branchId})

  const pagination = usePagination({
    stateId: WINDOW_ADD_EMPLOYEE,
    state: paginationStateComp,
    setState: setPaginationStateComp,
    defaultLimit: 10
  })

  const sort = useMemo(() => {
    const {key, direction} = sortQuery
    if (!key || !direction) {
      return []
    }

    return [{
      property: sortQuery.key,
      direction: sortQuery.direction
    }]
  }, [sortQuery])

  const loadRef = useCallback(async (search) => {
    const {limit, offset} = pagination.paginationState
    const {data: {content}} = await api.post(
      URL_EMPLOYEE_LIST,
      {
        filter,
        limit,
        offset,
        sort
      }
    )
    content.forEach(AddUserOptionsFullName)
    setModalWindowOptions(content)
  }, [api, filter, pagination.paginationState, sort])

  return (
    <div className="flex items-center w-full">
      <UserSelect
        {...props}
        options={useMemo(() => [...modalWindowOptions, ...options], [modalWindowOptions, options])}
      />
      <SearchButton
        className="ml-1"
        onClick={openEmployeeWindow}
      >
        <Icon icon={searchIcon}/>
      </SearchButton>
      <AddEmployee
        {...props}
        options={modalWindowOptions}
        open={addEmployeeWindow}
        onClose={closeEmployeeWindow}
        pagination={pagination}
        loadFunction={loadRef}
        onSort={onSort}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  )
}

OrgStructure.propTypes = {}
OrgStructure.defaultProps = {
  loadFunction: (api) => (filter) => async (search) => {
    const {data: {content}} = await api.post(URL_EMPLOYEE_LIST, {
      filter
    })
    return content
  },
  valueKey: "emplId",
  labelKey: "fullDescription",
  widthButton: true
}

export default OrgStructure