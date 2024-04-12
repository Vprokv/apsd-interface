import { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import { SecondaryBlueButton } from '@/Components/Button'
import { ApiContext, TASK_ITEM_REMARKS } from '@/contants'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_REMARK_ANSWER } from '@/ApiList'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import useTabItem from '@Components/Logic/Tab/TabItem'
import ScrollBar from '@Components/Components/ScrollBar'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import { rules, useFormFieldsConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Ответ на замечание добавлен успешно',
    }
  },
}

const CreateAnswer = ({
  permits: { editAuthor } = {},
  setSelected,
  ...filter
}) => {
  const [validationState, setValidationState] = useState({})
  const { member, remarkId } = filter
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const getNotification = useOpenNotification()
  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })

  const fields = useFormFieldsConfig(api, editAuthor)

  const onClose = useCallback(() => {
    setSelected()
  }, [setSelected])

  const onSave = useCallback(async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { remarkText, ndtLinks, member, ...other } = filter
      const { status } = await api.post(URL_REMARK_ANSWER, {
        documentId: id,
        memberId: member.emplId,
        memberName: member.userName,
        ndtLinks: ndtLinks && ndtLinks.map((val) => ({ ...val, id: null })),
        remarkId,
        ...other,
      })
      getNotification(customMessagesFuncMap[status]())
      setTabState(setUnFetchedState())
      setSelected(undefined)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [filter, api, id, remarkId, getNotification, setTabState, setSelected])

  return (
    <div>
      <StandardSizeModalWindow
        title="Добавить ответ на замечание"
        open={member}
        onClose={() => setSelected()}
      >
        <div className="flex flex-col overflow-hidden h-full">
          <div className="flex flex-col py-4 h-full grow">
            <ScrollBar>
              <Validator
                rules={rules}
                value={filter}
                onSubmit={onSave}
                validationState={validationState}
                setValidationState={useCallback(
                  (s) =>
                    setValidationState((prevState) => ({ ...prevState, ...s })),
                  [],
                )}
              >
                {({ onSubmit }) => (
                  <>
                    <Form
                      className="form-element-sizes-40 grid"
                      value={filter}
                      onInput={setSelected}
                      fields={fields}
                      inputWrapper={WithValidationStateInputWrapper}
                    />
                    <div className="mt-10">
                      <SecondaryBlueButton className="ml-4 form-element-sizes-32 w-64 mb-2">
                        Скачать шаблон таблицы
                      </SecondaryBlueButton>
                      <div className="flex items-center">
                        <SecondaryBlueButton className="ml-4 form-element-sizes-32 w-48 mr-auto">
                          Импорт значений
                        </SecondaryBlueButton>
                        <UnderButtons leftFunc={onClose} rightFunc={onSubmit} />
                      </div>
                    </div>
                  </>
                )}
              </Validator>
            </ScrollBar>
          </div>
        </div>
      </StandardSizeModalWindow>
    </div>
  )
}

CreateAnswer.propTypes = {
  remarkText: PropTypes.string,
  remarkId: PropTypes.string,
  permits: PropTypes.object,
}

export default CreateAnswer
