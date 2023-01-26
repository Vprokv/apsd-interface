import React, { useCallback, useState } from 'react'
import Icon from '@Components/Components/Icon'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import Form from '@Components/Components/Forms'
import Button, { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import editIcon from '@/Icons/editIcon'
import InputComponent from '@Components/Components/Inputs/Input'

const fieldMap = [
  {
    label: 'Наименование этапа',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
  {
    label: 'Срок в рабочих днях',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
]

const rules = {}

const EditStageWindow = () => {
  const [values, setValues] = useState({})
  const [open, setOpenState] = useState(false)
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )
  const onSave = useCallback(() => {
    changeModalState(false)()
  }, [changeModalState])
  const onClose = useCallback(() => {
    changeModalState(false)()
  }, [changeModalState])
  return (
    <>
      <Button className="color-blue-1" onClick={changeModalState(true)}>
        <Icon icon={editIcon} />
      </Button>
      <StandardSizeModalWindow
        title="Редактировать этап"
        open={open}
        onClose={changeModalState(false)}
      >
        <Form
          className="mb-10"
          inputWrapper={InputWrapper}
          value={values}
          onInput={setValues}
          fields={fieldMap}
          rules={rules}
        />
        <div className="flex items-center justify-end mt-8">
          <Button
            className="bg-light-gray flex items-center w-60 rounded-lg mr-4 font-weight-normal justify-center"
            onClick={onClose}
          >
            Закрыть
          </Button>
          <LoadableBaseButton
            className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center font-weight-normal"
            onClick={onSave}
          >
            Сохранить
          </LoadableBaseButton>
        </div>
      </StandardSizeModalWindow>
    </>
  )
}

export default EditStageWindow
