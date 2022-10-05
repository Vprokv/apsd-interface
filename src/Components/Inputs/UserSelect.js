import React, {useCallback, useContext, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {userAtom} from '@Components/Logic/UseTokenAndUserStorage'
import Select from './Select'
import Icon from '@Components/Components/Icon'
import Loadable from '@Components/Components/Inputs/Loadable'
import searchIcon from "@/Icons/searchIcon";
import styled from "styled-components";
import AddEmployee from "./OrgStructure/UserSearchWindow"
import {ApiContext, WINDOW_ADD_EMPLOYEE} from "@/contants";
import {URL_EMPLOYEE_LIST} from "../../ApiList";
import {useRecoilValue} from "recoil";
import usePagination from "../../components_ocean/Logic/usePagination";

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

const UserSelect = props => {
  const {loadFunction, widthButton, options } = props
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

  const customSelectFilter = useMemo(() => {
      return {organization, branchId}
    }, [organization, branchId])

  const loadRefSelectFunc = useCallback(async (search) => {
    const {limit, offset} = pagination.paginationState
    const data = await loadFunction(api)(customSelectFilter)(search)
    console.log(data, 'data select')
    return data
  }, [api, customSelectFilter, loadFunction, pagination.paginationState])

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
      <Select
        {...props}
        options={useMemo(() => [...modalWindowOptions, ...options], [modalWindowOptions, options])}
        loadFunction={loadRefSelectFunc}
      />
      {widthButton &&
      <>
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
      </>
      }
    </div>
  );
};

UserSelect.propTypes = {};
UserSelect.defaultProps = {
  loadFunction: (api) => (filter) => async (search) => {
    const {data: {content}} = await api.post(URL_EMPLOYEE_LIST, {
      filter
    })
    return content
  },
  valueKey: "emplId",
  labelKey: "fullName",
  widthButton: true
};
export default UserSelect;