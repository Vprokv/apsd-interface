import { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'

import { ApiContext, TASK_ITEM_REMARKS } from '@/contants'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_REMARK_UPDATE } from '@/ApiList'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import useTabItem from '@Components/Logic/Tab/TabItem'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import { rules, useFormFieldsConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Замечание откорректировано успешно',
    }
  },
}

const ScrollBar = styled(SimpleBar)`
  min-height: 400px;
`

const EditRemark = ({
  onClose,
  open,
  remarkText,
  ndtLinks = [],
  remarkId,
  remarkTypeId,
  permits: { editAuthor },
  remarkAuthor: { memberFullName, memberPosition, memberId },
}) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [validationState, setValidationState] = useState({})
  const [filter, setFilterValue] = useState({
    text: remarkText,
    ndtLinks,
    remarkTypeId: remarkTypeId,
    member: {
      emplId: memberId,
      fullDescription: `${memberFullName}, ${memberPosition}`,
    },
  })

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })

  const fields = useFormFieldsConfig(editAuthor, ndtLinks)

  const onSave = useCallback(async () => {
    try {
      const { ndtLinks, member, ...other } = filter
      const { status } = await api.post(URL_REMARK_UPDATE, {
        remarkId,
        memberId: member.emplId,
        memberName: member.userName,
        ndtLinks: ndtLinks.map(({ id, ndtId, comment }) => ({
          id,
          comment,
          ndtId,
        })),
        ...other,
      })
      setTabState(setUnFetchedState())
      getNotification(customMessagesFuncMap[status]())
      onClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [filter, api, remarkId, setTabState, getNotification, onClose])

  return (
    <StandardSizeModalWindow
      title="Откорректировать замечание"
      open={open}
      onClose={onClose}
      index={1005}
    >
      <div className="flex flex-col overflow-hidden h-full">
        <div className="flex flex-col py-4 h-full">
          <ScrollBar>
            <Validator
              rules={rules}
              onSubmit={onSave}
              value={filter}
              validationState={validationState}
              setValidationState={useCallback(
                (s) =>
                  setValidationState((prevState) => ({ ...prevState, ...s })),
                [],
              )}
            >
              {({ onSubmit }) => (
                <Form
                  className="form-element-sizes-40 grid"
                  value={filter}
                  onInput={setFilterValue}
                  fields={fields}
                  onSubmit={onSubmit}
                  inputWrapper={WithValidationStateInputWrapper}
                >
                  <div className="mt-10">
                    <UnderButtons leftFunc={onClose} />
                  </div>
                </Form>
              )}
            </Validator>
          </ScrollBar>
        </div>
      </div>
    </StandardSizeModalWindow>
  )
}

EditRemark.propTypes = {
  onClose: PropTypes.func,
  permits: PropTypes.object,
  remarkAuthor: PropTypes.object,
  remarkId: PropTypes.string,
  remarkTypeId: PropTypes.string,
  remarkType: PropTypes.string,
  ndtLinks: PropTypes.array,
  remarkText: PropTypes.string,
  open: PropTypes.bool,
}

export default EditRemark
