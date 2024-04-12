import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import { CustomSizeModalWindow } from './styles'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import {
  URL_ADDITIONAL_AGREEMENT_USER_LIST,
  URL_APPROVAL_SHEET_CREATE,
  URL_ENTITY_LIST,
} from '@/ApiList'
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
import { setUnFetchedState, useTabItem } from '@Components/Logic/Tab'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { WithValidationForm } from '@Components/Components/Forms'
import AdditionalAgreementOrgStructureComponent from '@/Components/Inputs/OrgStructure/AdditionalAgreementOrgStructureComponent'

export { CustomSizeModalWindow }
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

const CreateApprovalSheetWindow = ({ stageType, onClose }) => {
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const [typicalStage, setTypicalStage] = useState()
  const [filterValue, setFilterValue] = useState({})
  const getNotification = useOpenNotification()
  const ref = useRef(filterValue?.name)
  const [loading, setLoadingState] = useState(false)
  const documentId = useContext(DocumentIdContext)

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })

  const initialFilterState = useMemo(() => {
    const state = (typicalStage || []).find(({ dsb_default }) => dsb_default)

    if (state) {
      const { dss_name, dsi_work_day, dsb_curator = false } = state
      return {
        name: dss_name,
        term: dsi_work_day,
        stageCurator: dsb_curator,
      }
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

        return {
          ...value,
          term: res?.dsi_work_day,
          stageCurator: res.dsb_curator,
        }
      })
    }
    ref.current = filterValue.name
  }, [filterValue, typicalStage])

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
          component: AdditionalAgreementOrgStructureComponent,
          loadFunction: (api) => (filter) => async (query) => {
            const { data } = await api.post(
              URL_ADDITIONAL_AGREEMENT_USER_LIST,
              {
                stageCurator: filterValue.stageCurator,
                documentId,
                filter: {
                  ...filter,
                  ...query,
                },
              },
            )
            return data
          },
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
    [api, documentId, filterValue.stageCurator, typicalStage, visible],
  )

  const stage = useMemo(() => {
    const { approvers = [], name, show, ...other } = filterValue
    return {
      ...other,
      name: visible ? show : name,
      documentId: id,
      stageType,
      autoApprove: false,
      performers: approvers,
    }
  }, [filterValue, id, stageType, visible])

  const onSave = useCallback(async () => {
    try {
      setLoadingState(true)
      const response = await api.post(URL_APPROVAL_SHEET_CREATE, { stage })
      setTabState(setUnFetchedState())
      onClose()
      setFilterValue(initialFilterState)
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    } finally {
      setLoadingState(false)
    }
  }, [api, stage, setTabState, onClose, initialFilterState, getNotification])

  return (
    <div className="flex flex-col overflow-hidden h-full grow">
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
              <br className="ml-6" />* Согласование служб - 3 раб. дн. <br />*
              Согласование куратора филиала - 1 раб. дн. <br />* Согласование
              куратора ИА - 1 раб. дн. <br />* Визирование - 10 раб. дн
            </div>
            <div className="flex items-center justify-end mt-4">
              <UnderButtons
                leftLabel="Закрыть"
                leftFunc={onClose}
                rightLabel="Сохранить"
                disabled={loading}
              />
            </div>
          </WithValidationForm>
        </div>
      </ScrollBar>
    </div>
  )
}

CreateApprovalSheetWindow.propTypes = {
  stageType: PropTypes.string.isRequired,
  onClose: PropTypes.bool.isRequired,
}

export default CreateApprovalSheetWindow
