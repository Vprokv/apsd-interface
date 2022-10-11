import React, {useCallback, useContext, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import Select from './Select'
import Icon from '@Components/Components/Icon'
import searchIcon from "@/Icons/searchIcon";
import styled from "styled-components";
import AddEmployee from "./OrgStructure/UserSearchWindow"
import {ApiContext} from "@/contants";
import {URL_EMPLOYEE_LIST} from "../../ApiList";
import useDefaultFilter from "./OrgStructure/useDefaultFilter";

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
  const {loadFunction} = props
  const api = useContext(ApiContext)
  const {organization, branchId} = useDefaultFilter()
  const [addEmployeeWindow, setAddEmployeeWindowState] = useState(false)
  const openEmployeeWindow = useCallback(() => setAddEmployeeWindowState(true), [])
  const closeEmployeeWindow = useCallback(() => setAddEmployeeWindowState(false), [])

  const customSelectFilter = useMemo(() => {
      return {organization, branchId}
    }, [organization, branchId])

  const loadRefSelectFunc = useCallback(async (search) => {
    const data = await loadFunction(api)(customSelectFilter)(search)
    return data.map(AddUserOptionsFullName)
  }, [api, customSelectFilter, loadFunction])

  return (
    <div className="flex items-center w-full">
      <Select
        {...props}
        loadFunction={loadRefSelectFunc}
      />
      <>
        <SearchButton
          className="ml-1"
          onClick={openEmployeeWindow}
        >
          <Icon icon={searchIcon}/>
        </SearchButton>
        <AddEmployee
          {...props}
          open={addEmployeeWindow}
          onClose={closeEmployeeWindow}
        />
      </>
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
  options: []
};
export default UserSelect;