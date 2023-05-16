import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'
import { useCallback, useContext, useState } from 'react'
import { ApiContext } from '@/contants'
import { useParams } from 'react-router-dom'
import { URL_TITLE_CONTAIN_SAVE } from '@/ApiList'
import PropTypes from 'prop-types'
import Input from '@/Components/Fields/Input'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import { WithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import CheckBox from '@/Components/Inputs/CheckBox'

export const MiniModalWindow = styled(ModalWindow)`
  width: 28.22%;
  min-height: 26.56%;
  margin: auto;
`

const fields = [
  {
    id: 'name',
    label: 'Наименование',
    placeholder: 'Введите наименование',
    component: Input,
  },
  {
    id: 'code',
    label: 'Код',
    placeholder: 'Введите код',
    component: Input,
  },
  {
    id: 'availableProjector',
    component: CheckBox,
    className: 'font-size-12',
    text: 'Доступно проектировщику',
  },
]

const rules = {
  name: [{ name: VALIDATION_RULE_REQUIRED }],
  code: [{ name: VALIDATION_RULE_REQUIRED }],
}

const NewTitle = ({ onClose, parentId, closeParent, open }) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [value, onInput] = useState({})
  const getNotification = useOpenNotification()

  const handleClick = useCallback(async () => {
    try {
      const { data } = await api.post(URL_TITLE_CONTAIN_SAVE, {
        titleId: id,
        parentId,
        ...value,
      })
      onInput('')
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
      <>
        <WithValidationForm
          value={value}
          onInput={onInput}
          fields={fields}
          inputWrapper={DefaultWrapper}
          rules={rules}
          onSubmit={handleClick}
        >
          <UnderButtons
            // className="justify-around w-full"
            leftStyle="width-min mr-2"
            rightStyle="width-min"
            leftFunc={onClose}
            leftLabel="Отменить"
            rightLabel="Сохранить"
          />
        </WithValidationForm>
      </>
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
