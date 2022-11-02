import { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import Select from '../Select'
import { ApiContext } from '@/contants'
import { URL_EMPLOYEE_LIST } from '@/ApiList'
import { useRecoilValue } from 'recoil'

export const AddUserOptionsFullName = (v) => ({
  ...v,
  fullName: `${v.firstName} ${v.middleName} ${v.lastName}`,
})

const UserSelect = ({ loadFunction, filter, ...props }) => {
  const api = useContext(ApiContext)
  const {
    organization: [
      {
        r_object_id: organization = '',
        branches: [{ r_object_id: branchId = '' }] = [{}],
      },
    ] = [{}],
  } = useRecoilValue(userAtom)

  const customSelectFilter = useMemo(() => {
    return { organization, branchId, ...filter }
  }, [organization, branchId, filter])

  const loadRefSelectFunc = useCallback(
    async (search) => {
      const data = await loadFunction(api)(customSelectFilter)(search)
      return data.map(AddUserOptionsFullName)
    },
    [api, customSelectFilter, loadFunction],
  )
  return <Select {...props} loadFunction={loadRefSelectFunc} />
}

UserSelect.propTypes = {
  filter: PropTypes.object,
  loadFunction: PropTypes.func,
}
UserSelect.defaultProps = {
  loadFunction: (api) => (filter) => async (search) => {
    const {
      data: { content },
    } = await api.post(URL_EMPLOYEE_LIST, {
      filter,
    })
    content.forEach(AddUserOptionsFullName)
    return content
  },
  valueKey: 'emplId',
  labelKey: 'fullName',
  widthButton: true,
  filter: {},
}
export default UserSelect
