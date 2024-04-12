import styled from 'styled-components'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import ModalWindow from '@/Components/ModalWindow'
import { useCallback, useContext, useState } from 'react'
import { ApiContext } from '@/contants'
import { useParams } from 'react-router-dom'
import { URL_TITLE_CONTAIN_SAVE } from '@/ApiList'
import PropTypes from 'prop-types'

import UnderButtons from '@/Components/Inputs/UnderButtons'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import { fields, rules } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

export const MiniModalWindow = styled(ModalWindow)`
  width: 28.22%;
  min-height: 26.56%;
  margin: auto;
`

const NewTitle = ({ onClose, parentId, closeParent, open }) => {
  const [validationState, setValidationState] = useState({})
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [value, onInput] = useState({ availableProjector: true })
  const getNotification = useOpenNotification()

  const handleClick = useCallback(async () => {
    try {
      const { data } = await api.post(URL_TITLE_CONTAIN_SAVE, {
        titleId: id,
        parentId,
        ...value,
      })
      onInput({ availableProjector: true })
      onClose()
      closeParent(data)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, id, parentId, value, onClose, closeParent, getNotification])

  return (
    <MiniModalWindow
      open={open}
      onClose={onClose}
      title="Создание нового раздела"
    >
      <Validator
        rules={rules}
        onSubmit={handleClick}
        value={value}
        validationState={validationState}
        setValidationState={useCallback(
          (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
          [],
        )}
      >
        {({ onSubmit }) => (
          <Form
            value={value}
            onInput={onInput}
            fields={fields}
            onSubmit={onSubmit}
            inputWrapper={WithValidationStateInputWrapper}
          >
            <UnderButtons
              // className="justify-around w-full"
              leftStyle="width-min mr-2"
              rightStyle="width-min"
              leftFunc={onClose}
              leftLabel="Отменить"
              rightLabel="Сохранить"
            />
          </Form>
        )}
      </Validator>
    </MiniModalWindow>
  )
}

NewTitle.propTypes = {
  onClose: PropTypes.func.isRequired,
  closeParent: PropTypes.func.isRequired,
  parentId: PropTypes.string,
  open: PropTypes.bool,
}

NewTitle.defaultProps = {
  parentId: undefined,
  open: false,
}
export default NewTitle
