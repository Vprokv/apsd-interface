import React, {useCallback, useContext, useMemo} from 'react'
import {userAtom} from '@Components/Logic/UseTokenAndUserStorage'
import Select from '../Select'
import {ApiContext} from "../../../contants"
import {URL_EMPLOYEE_LIST} from "../../../ApiList"
import {useRecoilValue} from "recoil"

export const AddUserOptionsFullName = (v = {}) => ({ 
  ...v,
  fullName: `${v.firstName} ${v.middleName} ${v.lastName}`,
  fullDescription:  v.fullDescription ? v.fullDescription : `${v.firstName} ${v.middleName} ${v.lastName}, ${v.position}, ${v.department}`
})

const UserSelect = ({ loadFunction, ...props }) => {
  const api = useContext(ApiContext)
  const {
    organization: [{
      r_object_id: organization = "",
      branches: [{r_object_id: branchId = ""}] = [{}]
    }] = [{}],
  } = useRecoilValue(userAtom)

  const customSelectFilter = useMemo(() => {
    return {organization, branchId}
  }, [organization, branchId])

  const loadRefSelectFunc = useCallback(async (search) => {
    const data = await loadFunction(api)(customSelectFilter)(search)
    return data.map(AddUserOptionsFullName)
  }, [api, customSelectFilter, loadFunction])

  return (
    <Select
      {...props}
      loadFunction={loadRefSelectFunc}
    />
  )
}

UserSelect.propTypes = {};
UserSelect.defaultProps = {
  loadFunction: (api) => (filter) => async (search) => {
    const {data: {content}} = await api.post(URL_EMPLOYEE_LIST, {
      filter: {query: search, ...filter}
    })
    return content.map(AddUserOptionsFullName)
  },
  valueKey: "emplId",
  labelKey: "fullDescription",
  widthButton: true
}

export default UserSelect