import { useCallback, useContext, useState } from 'react'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import PropTypes from 'prop-types'
import { ApiContext, TASK_ITEM_CONTENT } from '@/contants'
import { URL_UPDATE_VERSION } from '@/ApiList'
import ScrollBar from '@Components/Components/ScrollBar'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import useTabItem from '@Components/Logic/Tab/TabItem'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import { rules, useFormFieldConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const EditVersionWindow = ({ onClose, formData }) => {
  const [values, setValues] = useState(formData)
  const [validationState, setValidationState] = useState({})
  const api = useContext(ApiContext)

  const { setTabState } = useTabItem({
    stateId: TASK_ITEM_CONTENT,
  })

  const onSave = useCallback(async () => {
    const { contentTypeId, comment, regNumber, versionDate, contentId } = values
    await api.post(URL_UPDATE_VERSION, {
      file: {
        contentId,
        contentType: contentTypeId,
        comment,
        regNumber,
        versionDate,
      },
    })
    setTabState(setUnFetchedState())
    onClose()
  }, [api, onClose, setTabState, values])

  const fields = useFormFieldConfig(api, values)
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <ScrollBar className="flex flex-col">
        <Validator
          rules={rules}
          onSubmit={onSave}
          value={values}
          validationState={validationState}
          setValidationState={useCallback(
            (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
            [],
          )}
        >
          {({ onSubmit }) => (
            <Form
              className="mb-10 flex flex-col h-full"
              value={values}
              onInput={setValues}
              fields={fields}
              onSubmit={onSubmit}
              inputWrapper={WithValidationStateInputWrapper}
            >
              <UnderButtons
                className="mt-auto"
                leftFunc={onClose}
                rightLabel={'Сохранить'}
                leftLabel={'Закрыть'}
              />
            </Form>
          )}
        </Validator>
      </ScrollBar>
    </div>
  )
}

EditVersionWindow.propTypes = {
  onClose: PropTypes.func,
  formData: PropTypes.object,
  setChange: PropTypes.func,
}
EditVersionWindow.defaultProps = {
  onClose: () => null,
}

const EditVersionWindowWrapper = (props) => (
  <StandardSizeModalWindow {...props} title="Редактирование версии">
    <EditVersionWindow {...props} />
  </StandardSizeModalWindow>
)

export default EditVersionWindowWrapper
