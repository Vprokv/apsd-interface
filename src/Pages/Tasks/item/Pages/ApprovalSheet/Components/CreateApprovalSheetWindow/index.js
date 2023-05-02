import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import Button from '@/Components/Button'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import { CustomSizeModalWindow, FilterForm } from './styles'
import UserSelect from '@/Components/Inputs/UserSelect'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { URL_APPROVAL_SHEET_CREATE, URL_ENTITY_LIST } from '@/ApiList'
import {
  PermitDisableContext,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import {
  VALIDATION_RULE_INTEGER,
  VALIDATION_RULE_REQUIRED,
} from '@Components/Logic/Validator/constants'
import LoadableSelect from '@/Components/Inputs/Select'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import NumericInput from '@Components/Components/Inputs/NumericInput'
import ScrollBar from 'react-perfect-scrollbar'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { WithValidationForm } from '@Components/Components/Forms'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Этап добавлен успешно',
    }
  },
}

const NAME = 'Указать наименование этапа вручную'

const CreateApprovalSheetWindow = ({ stageType }) => {
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const [open, setOpenState] = useState(false)
  const [typicalStage, setTypicalStage] = useState()
  const [filterValue, setFilterValue] = useState({})
  const getNotification = useOpenNotification()
  const ref = useRef(filterValue?.name)
  const permit = useContext(PermitDisableContext)

  const { setTabState } = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })

  const initialFilterState = useMemo(() => {
    const state = (typicalStage || []).find(({ dsb_default }) => dsb_default)

    if (state) {
      return { name: state.dss_name, term: state.dsi_work_day }
    }
    return {}
  }, [typicalStage])

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_ENTITY_LIST, {
        type: 'ddt_dict_typical_stage',
      })
      setTypicalStage(data)
    })()
  }, [api])

  useEffect(() => {
    setFilterValue((value) => {
      if (Object.keys(value) < 1) {
        return initialFilterState
      }
      return value
    })
  }, [initialFilterState])

  useEffect(() => {
    if (ref.current !== filterValue?.name) {
      setFilterValue((value) => {
        const res = (typicalStage || []).find(
          ({ dss_name }) => dss_name === value.name,
        )

        return { ...value, term: res?.dsi_work_day }
      })
    }
    ref.current = filterValue.name
  }, [filterValue, typicalStage])

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const visible = useMemo(() => filterValue?.name === NAME, [filterValue?.name])

  const rules = useMemo(() => {
    const rules = {
      name: [{ name: VALIDATION_RULE_REQUIRED }],
      term: [
        { name: VALIDATION_RULE_INTEGER },
        { name: VALIDATION_RULE_REQUIRED },
      ],
    }
    if (visible) {
      rules['show'] = [{ name: VALIDATION_RULE_REQUIRED }]
    }
    return rules
  }, [visible])

  const fields = useMemo(
    () =>
      [
        {
          id: 'name',
          label: 'Наименование',
          component: LoadableSelect,
          required: true,
          placeholder: 'Наименование этапа',
          valueKey: 'dss_name',
          labelKey: 'dss_name',
          className: 'font-size-12',
          options: typicalStage,
          loadFunction: async (query) => {
            const { data } = await api.post(URL_ENTITY_LIST, {
              type: 'ddt_dict_typical_stage',
              query,
            })
            return data
          },
        },
        {
          id: 'show',
          component: SearchInput,
          visible: visible,
          multiple: true,
          returnOption: false,
          className: 'font-size-12',
          placeholder: 'Наименование этапа',
          label: 'Наименование этапа',
        },
        {
          id: 'approvers',
          component: UserSelect,
          multiple: true,
          returnOption: false,
          className: 'font-size-12',
          placeholder: 'Выберите участников',
          label: 'Участники',
        },
        {
          id: 'term',
          component: NumericInput,
          placeholder: 'Срок в рабочих днях',
          label: 'Укажите в рабочих днях',
        },
      ].filter(({ visible }) => visible !== false),
    [api, typicalStage, visible],
  )

  const stage = useMemo(() => {
    const { approvers = [], name, show, ...other } = filterValue
    return {
      ...other,
      name: visible ? show : name,
      documentId: id,
      stageType,
      autoApprove: false,
      approvers: approvers?.map((val) => {
        return { dsidApproverEmpl: val }
      }),
    }
  }, [filterValue, id, stageType, visible])

  const onSave = useCallback(async () => {
    try {
      const response = await api.post(URL_APPROVAL_SHEET_CREATE, { stage })
      setTabState({ loading: false, fetched: false })
      changeModalState(false)()
      setFilterValue(initialFilterState)
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    stage,
    setTabState,
    changeModalState,
    initialFilterState,
    getNotification,
  ])

  const onClose = useCallback(() => {
    setFilterValue(initialFilterState)
    changeModalState(false)()
  }, [changeModalState, initialFilterState])

  return (
    <div className="flex items-center ml-auto ">
      <Button
        disabled={permit}
        onClick={changeModalState(true)}
        className={`${permit ? 'color-text-secondary' : 'color-blue-1'}`}
      >
        Добавить этап
      </Button>
      <CustomSizeModalWindow
        title="Добавить этап"
        open={open}
        onClose={changeModalState(false)}
      >
        <div className="flex flex-col overflow-hidden h-full">
          <ScrollBar>
            <div className="flex py-4">
              <WithValidationForm
                className="form-element-sizes-40 w-full "
                fields={fields}
                value={filterValue}
                onInput={setFilterValue}
                inputWrapper={InputWrapper}
                rules={rules}
                onSubmit={onSave}
              >
                <div className="mt-2 font-size-12">
                  Контрольный срок согласования для томов ПД, РД:
                  <br className="ml-6" />* Согласование служб - 3 раб. дн.{' '}
                  <br />* Согласование куратора филиала - 1 раб. дн. <br />*
                  Согласование куратора ИА - 1 раб. дн. <br />* Визирование - 10
                  раб. дн
                </div>
                <div className="flex items-center justify-end mt-4">
                  <UnderButtons
                    leftLabel="Закрыть"
                    leftFunc={onClose}
                    rightLabel="Сохранить"
                  />
                </div>
              </WithValidationForm>
            </div>
          </ScrollBar>
        </div>
      </CustomSizeModalWindow>
    </div>
  )
}

CreateApprovalSheetWindow.propTypes = {}

export default CreateApprovalSheetWindow
