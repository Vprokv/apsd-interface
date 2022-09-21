import React, {useCallback, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {userAtom} from '@Components/Logic/UseTokenAndUserStorage'
import {Select} from './Select'
import Icon from '@Components/Components/Icon'
import Loadable from '@Components/Components/Inputs/Loadable'
import searchIcon from "@/Icons/searchIcon";
import styled from "styled-components";
import AddEmployee from "./OrgStructure"
import {ApiContext, WINDOW_ADD_EMPLOYEE} from "@/contants";
import {URL_EMPLOYEE_LIST} from "../../ApiList";
import {useRecoilValue} from "recoil";
import usePagination from "../../components_ocean/Logic/usePagination";

const RenderLoadable = Loadable(({children, ...props}) => children(props))

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
  const api = useContext(ApiContext)
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

  const loadRef = useCallback(async (search) => {
    const {limit, offset} = pagination.paginationState
    const {data: {content}} = await api.post(
      URL_EMPLOYEE_LIST,
      {
        filter,
        limit,
        offset,
        sort: [{
          property: sortQuery.key,
          direction: sortQuery.direction
        }]
      }
    )
    content.forEach((v) => {
      v.fullName = `${v.firstName} ${v.middleName} ${v.lastName}`
    })
    return content
  }, [api, filter, pagination.paginationState, sortQuery])

  return (
    <div className="flex items-center w-full">
      <RenderLoadable
        {...props}
        loadFunction={loadRef}
        filter={filter}
        setFilter={setFilter}
      >
        {(props) => (
          <>
            <Select
              {...props}
              valueKey="emplId"
              labelKey="fullName"
            />
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
              pagination={pagination}
              onSort={onSort}
            />
          </>
        )}
      </RenderLoadable>
    </div>
  );
};

UserSelect.propTypes = {};

export default UserSelect;