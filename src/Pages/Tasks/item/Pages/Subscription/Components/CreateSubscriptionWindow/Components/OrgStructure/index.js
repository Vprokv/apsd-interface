import {useRecoilValue} from "recoil";
import React, {useCallback, useContext, useMemo, useState} from "react";
import PropTypes from 'prop-types';
import {userAtom} from '@Components/Logic/UseTokenAndUserStorage'
import {ApiContext, WINDOW_ADD_EMPLOYEE} from "@/contants";
import Button from "../../../../../../../../../Components/Button";
import AddEmployee from "../../../../../../../../../Components/Inputs/OrgStructure";
import usePagination from "../../../../../../../../../components_ocean/Logic/usePagination";
import {URL_EMPLOYEE_LIST} from "../../../../../../../../../ApiList";
import useTabItem from "../../../../../../../../../components_ocean/Logic/Tab/TabItem";
import {WINDOW_ADD_SUBSCRIPTION} from "../../../../../../../../../contants";

const OrgStructure = props => {
  const {
    organization: [{
      r_object_id: organization = "",
      branches: [{r_object_id: branchId = ""}] = [{}]
    }] = [{}],
  } = useRecoilValue(userAtom)
  const api = useContext(ApiContext)

  const {tabState: {options = []}, setTabState} = useTabItem({
    stateId: WINDOW_ADD_SUBSCRIPTION
  })

  const [sortQuery, onSort] = useState({})
  const [paginationStateComp, setPaginationStateComp] = useState({})
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
    content.forEach((v) => {
      v.fullName = `${v.firstName} ${v.middleName} ${v.lastName}`
    })
    setTabState({options: content})
  }, [api, filter, pagination.paginationState, sortQuery])

  return (
    <>
      <Button
        className="bg-blue-5 color-blue-1 flex items-center justify-center text-sm font-weight-normal height-small leading-4 padding-medium"
        onClick={openEmployeeWindow}
      >
        Добавить пользователей
      </Button>
      <AddEmployee
        multiply={true}
        {...props}
        open={addEmployeeWindow}
        onClose={closeEmployeeWindow}
        pagination={pagination}
        onSort={onSort}
        setFilter={setFilter}
        filter={filter}
        remoteMethod={loadRef}
        options={options}
      />
    </>
  )
}

OrgStructure.defaultProps = {};
export default OrgStructure