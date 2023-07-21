import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { SecondaryBlueButton } from '@/Components/Button'
import { ApiContext, TASK_ITEM_REMARKS } from '@/contants'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { CustomInput } from './styles'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect from '@/Components/Inputs/Select'
import LinkNdt from '@/Pages/Tasks/item/Pages/Remarks/Components/LinkNdt'
import { URL_ENTITY_LIST, URL_REMARK_CREATE } from '@/ApiList'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import UserSelect from '@/Components/Inputs/UserSelect'
import {
  VALIDATION_RULE_MAX,
  VALIDATION_RULE_REQUIRED,
} from '@Components/Logic/Validator/constants'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'
import Form, {
  returnChildren,
  WithValidationForm,
} from '@Components/Components/Forms'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import {
  RowInputWrapperRefactor,
  ValidationProvider,
} from '@/Components/InputWrapperRefactor'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { remarkValidator } from '@/Pages/Tasks/item/Pages/Remarks/constans'
import RemarkWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/RemarkWrapper'
import { Validation } from '@Components/Logic/Validator'

const ScrollBar = styled(SimpleBar)`
  min-height: 400px;
`

const rules = {
  member: [{ name: VALIDATION_RULE_REQUIRED }],
  remarkTypeId: [{ name: VALIDATION_RULE_REQUIRED }],
  text: [
    {
      name: VALIDATION_RULE_MAX,
      args: {
        max: 1024,
        text: 'Превышено допустимое количество символов для замечания ',
      },
    },
    { name: VALIDATION_RULE_REQUIRED },
  ],
  'ndtLinks.*.id': [{ name: VALIDATION_RULE_REQUIRED }],
  'ndtLinks.*.comment': [{ name: VALIDATION_RULE_REQUIRED }],
  ndtLinks: [{ name: VALIDATION_RULE_REQUIRED }],
}

const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 61.6%;
  min-height: 60.65%;
  //max-height: 80vh;
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

export const NdtLinkWrapper = ValidationProvider(RowInputWrapperRefactor)

const CreateRemark = ({ tabPermit: { createRemark, editAuthor } = {} }) => {
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

  const { setTabState } = useTabItem({
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

  const fields = useMemo(
    () => [
      {
        id: 'member',
        label: 'Автор',
        disabled: !editAuthor,
        returnOption: true,
        returnObjects: true,
        options: [initialUserValue.member],
        component: UserSelect,
      },
      {
        id: 'remarkTypeId',
        component: LoadableSelect,
        placeholder: 'Выберите тип',
        label: 'Тип замечания',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        options,
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_type_remark',
            query,
          })
          return data
        },
      },
      {
        id: 'text',
        label: 'Текст замечания',
        inputWrapper: RemarkWrapper,
        component: CustomInput,
        placeholder: 'Введите текст замечания',
      },
      {
        id: 'ndtLinks',
        label: 'Ссылка нa НДТ',
        component: LinkNdt,
        placeholder: 'Выберите значение',
        inputWrapper: returnChildren,
        InputUiContext: NdtLinkWrapper,
      },
    ],
    [api, editAuthor, initialUserValue.member, options],
  )

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const onSave = useCallback(async () => {
    try {
      const { member, ...other } = filter
      const { status } = await api.post(URL_REMARK_CREATE, {
        documentId: id,
        memberId: member.emplId,
        memberName: member.userName,
        ...other,
      })
      getNotification(customMessagesFuncMap[status]())
      setTabState({ loading: false, fetched: false })
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
        <div className="flex flex-col overflow-hidden h-full">
          <div className="flex flex-col py-4 h-full grow">
            <ScrollBar className="grow">
              <Validation
                fields={fields}
                value={filter}
                onInput={setFilterValue}
                rules={rules}
                onSubmit={onSave}
                validators={remarkValidator}
              >
                {(validationProps) => {
                  return (
                    <>
                      <Form
                        className="form-element-sizes-40"
                        inputWrapper={InputWrapper}
                        {...validationProps}
                      />
                      <div className="mt-10">
                        <SecondaryBlueButton className="ml-4 form-element-sizes-32 w-64 mb-2">
                          Скачать шаблон таблицы
                        </SecondaryBlueButton>
                        <div className="flex items-center">
                          <SecondaryBlueButton className="ml-4 form-element-sizes-32 w-48 mr-auto">
                            Импорт значений
                          </SecondaryBlueButton>
                          <UnderButtons
                            disabled={!validationProps.formValid}
                            leftFunc={onClose}
                            rightFunc={validationProps.onSubmit}
                          />
                        </div>
                      </div>
                    </>
                  )
                }}
              </Validation>
            </ScrollBar>
          </div>
        </div>
      </StandardSizeModalWindow>
    </div>
  )
}

CreateRemark.propTypes = {
  tabPermit: PropTypes.object,
}

export default CreateRemark
