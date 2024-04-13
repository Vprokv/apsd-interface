import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import PropTypes from 'prop-types'
import { SecondaryBlueButton } from '@/Components/Button'
import { ApiContext, TASK_ITEM_REMARKS } from '@/contants'
import ModalWindowWrapper from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_ENTITY_LIST, URL_REMARK_CREATE } from '@/ApiList'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
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

const ScrollBar = styled(SimpleBar)`
  min-height: 400px;
`

const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 61.6%;
  min-height: 60.65%;
  max-height: 72.65%;
  margin: auto;
`

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Замечание создано успешно',
    }
  },
}

const CreateRemark = ({ tabPermit: { createRemark, editAuthor } = {} }) => {
  const [validationState, setValidationState] = useState({})
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const [open, setOpenState] = useState(false)
  const [options, setOptions] = useState([])
  const getNotification = useOpenNotification()

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_ENTITY_LIST, {
        type: 'ddt_dict_type_remark',
      })
      setOptions(data)
    })()
  }, [api])

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })

  const {
    r_object_id,
    dss_user_name,
    dss_last_name,
    dss_first_name,
    dss_middle_name,
    department_name,
    position_name,
  } = useRecoilValue(userAtom)

  const remarkType = useMemo(
    () => options.find(({ dss_name }) => dss_name === 'Внешнее'),
    [options],
  )

  const initialUserValue = useMemo(() => {
    return {
      member: {
        firstName: dss_first_name,
        lastName: dss_last_name,
        middleName: dss_middle_name,
        position: position_name,
        department: department_name,
        emplId: r_object_id,
        fullDescription: `${dss_last_name} ${dss_first_name},${dss_middle_name}, ${position_name}, ${department_name}`,
        userName: dss_user_name,
      },
    }
  }, [
    department_name,
    dss_first_name,
    dss_last_name,
    dss_middle_name,
    dss_user_name,
    position_name,
    r_object_id,
  ])

  const [filter, setFilterValue] = useState(initialUserValue)

  useEffect(() => {
    if (!filter.remarkTypeId && remarkType) {
      setFilterValue((prev) => ({
        ...prev,
        remarkTypeId: remarkType.r_object_id,
      }))
    }
  }, [filter.remarkTypeId, remarkType])

  const changeModalState = useCallback(
    (nextState) => () => {
      setValidationState({})
      setOpenState(nextState)
    },
    [],
  )

  const onSave = useCallback(async () => {
    try {
      const { member, ndtLinks, ...other } = filter
      const { status } = await api.post(URL_REMARK_CREATE, {
        documentId: id,
        memberId: member.emplId,
        memberName: member.userName,
        ndtLinks: ndtLinks.map((val) => ({ ...val, id: null })),
        ...other,
      })
      getNotification(customMessagesFuncMap[status]())
      setTabState(setUnFetchedState())
      changeModalState(false)()
      setFilterValue(initialUserValue)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    changeModalState,
    filter,
    getNotification,
    id,
    initialUserValue,
    setTabState,
  ])

  const onClose = useCallback(() => {
    changeModalState(false)()
    setFilterValue(initialUserValue)
  }, [changeModalState, initialUserValue])

  const fields = useFormFieldsConfig(api, editAuthor, initialUserValue, options)
  // todo поправить верстку
  return (
    <div>
      <SecondaryBlueButton
        disabled={!createRemark} // TODO Жми меня, чтобы разблочить окно
        onClick={changeModalState(true)}
      >
        Добавить замечание
      </SecondaryBlueButton>
      <StandardSizeModalWindow
        // className="h-full"
        title="Добавить замечание"
        open={open}
        onClose={onClose}
      >
        <div className="flex flex-col overflow-hidden h-full py-4 flex-auto">
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
                <ScrollBar className="grow h-full">
                  <Form
                    className="form-element-sizes-40 h-full mb-10"
                    value={filter}
                    onInput={setFilterValue}
                    fields={fields}
                    inputWrapper={WithValidationStateInputWrapper}
                  />
                </ScrollBar>
                <div className="mt-auto">
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
        </div>
      </StandardSizeModalWindow>
    </div>
  )
}

CreateRemark.propTypes = {
  tabPermit: PropTypes.object,
}

export default CreateRemark
