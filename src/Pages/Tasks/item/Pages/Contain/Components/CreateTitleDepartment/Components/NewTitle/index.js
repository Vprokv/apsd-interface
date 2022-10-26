import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'
import { useCallback, useContext, useState } from 'react'
import Button from '@/Components/Button'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { ApiContext } from '@/contants'
import { useParams } from 'react-router-dom'
import { URL_TITLE_CONTAIN_SAVE } from '@/ApiList'
import PropTypes from 'prop-types'

export const MiniModalWindow = styled(ModalWindow)`
  width: 28.22%;
  height: 26.56%;
  margin: auto;
`

const NewTitle = ({ onClose, parentId, closeParent, setChange, open }) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [value, onInput] = useState('')

  const handleClick = useCallback(async () => {
    await api.post(URL_TITLE_CONTAIN_SAVE, {
      titleId: id,
      parentId,
      name: value,
      code: value,
    })
    onInput('')
    setChange()
    onClose()
    closeParent()
  }, [api, id, parentId, value, setChange, onClose, closeParent])

  return (
    <MiniModalWindow
      open={open}
      onClose={onClose}
      title="Создание нового раздела"
    >
      <>
        <div className="mt-8">
          <SearchInput
            value={value}
            onInput={onInput}
            placeholder="Введите название"
          />
        </div>
        <div className="flex items-center justify-end mt-8">
          <Button
            className="bg-light-gray flex items-center w-60 rounded-lg mr-4 font-weight-normal justify-center"
            onClick={onClose}
          >
            Отменить
          </Button>
          <Button
            className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center font-weight-normal"
            onClick={handleClick}
          >
            Сохранить
          </Button>
        </div>
      </>
    </MiniModalWindow>
  )
}

NewTitle.propTypes = {
  onClose: PropTypes.func,
  closeParent: PropTypes.func,
  setChange: PropTypes.func,
  parentId: PropTypes.string,
  open: PropTypes.bool,
}
export default NewTitle
