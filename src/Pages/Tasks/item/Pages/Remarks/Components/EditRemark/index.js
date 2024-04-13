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
import { setUnFetchedState, useTabItem } from '@Components/Logic/Tab'
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
    >
      <div className="flex flex-col overflow-hidden h-full py-4 flex-auto">
        <Validator
          rules={rules}
          onSubmit={onSave}
          value={filter}
          validationState={validationState}
          setValidationState={useCallback(
            (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
            [],
          )}
        >
          {({ onSubmit }) => (
            <>
              <ScrollBar className="h-full">
                <Form
                  className="form-element-sizes-40 h-full mb-10"
                  value={filter}
                  onInput={setFilterValue}
                  fields={fields}
                  inputWrapper={WithValidationStateInputWrapper}
                />
              </ScrollBar>
              <div className="mt-auto">
                <UnderButtons leftFunc={onClose} rightFunc={onSubmit} />
              </div>
            </>
          )}
        </Validator>
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
