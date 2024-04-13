import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import Icon from '@Components/Components/Icon'
import Button, { LoadableBaseButton } from '@/Components/Button'
import editIcon from '@/Icons/editIcon'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import { PermitDisableContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { URL_APPROVAL_SHEET_UPDATE, URL_ENTITY_LIST } from '@/ApiList'
import { CustomSizeModalWindow } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow/styles'
import { CustomButtonForIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CustomButtonForIcon'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { setUnFetchedState, useTabItem } from '@Components/Logic/Tab'
import Tips from '@/Components/Tips'
import { rules, useFormFieldsConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Этап изменен успешно',
    }
  },
}

const NAME = 'Указать наименование этапа вручную'

export const AddUserOptionsFullName = (v = {}) => ({
  emplId: v.dsidApproverEmpl,
  fullDescription: v.fullDescription
    ? v.fullDescription
    : `${v.dssApproverFio}, ${v.dssApproverDep}`,
})

const EditStageWindow = (props) => {
  const api = useContext(ApiContext)
  const [validationState, setValidationState] = useState({})
  const [open, setOpenState] = useState(false)
  const [typicalStage, setTypicalStage] = useState()
  const [filterValue, setFilterValue] = useState({})
  const getNotification = useOpenNotification()
  const ref = useRef(filterValue?.name)
  const permit = useContext(PermitDisableContext)

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })

  const initialFilterState = useMemo(() => {
    if (props) {
      const { term, approvers, name, globalId } = props

      return {
        term,
        name,
        approvers: approvers?.map(({ dsidApproverEmpl }) => dsidApproverEmpl),
        id: globalId,
      }
    }
  }, [props])

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

        return { ...value, term: res?.dsi_work_day || initialFilterState.term }
      })
    }
    ref.current = filterValue.name
  }, [filterValue, initialFilterState.term, typicalStage])

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const visible = useMemo(() => filterValue?.name === NAME, [filterValue?.name])

  const fields = useFormFieldsConfig(api, typicalStage, visible)

  const onSave = useCallback(async () => {
    const { name, show, term, id } = filterValue
    try {
      const response = await api.post(URL_APPROVAL_SHEET_UPDATE, {
        id,
        name: visible ? show : name,
        term,
      })
      setTabState(setUnFetchedState())
      changeModalState(false)()
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    filterValue,
    api,
    visible,
    setTabState,
    changeModalState,
    getNotification,
  ])

  const onClose = useCallback(() => {
    setFilterValue(initialFilterState)
    changeModalState(false)()
  }, [changeModalState, initialFilterState])

  return (
    <div className="flex items-center ml-auto">
      <Tips text="Редактировать этап">
        <CustomButtonForIcon
          className="color-blue-1"
          onClick={changeModalState(true)}
          disabled={permit}
        >
          <Icon icon={editIcon} />
        </CustomButtonForIcon>
      </Tips>
      <CustomSizeModalWindow
        title="Редактировать этап"
        open={open}
        onClose={changeModalState(false)}
      >
        <Validator
          rules={rules}
          value={filterValue}
          onSubmit={onSave}
          validationState={validationState}
          setValidationState={useCallback(
            (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
            [],
          )}
        >
          {({ onSubmit }) => (
            <>
              <div className="flex flex-col overflow-hidden h-full">
                <Form
                  className="flex py-4form-element-sizes-40"
                  fields={fields}
                  value={filterValue}
                  onInput={setFilterValue}
                  inputWrapper={WithValidationStateInputWrapper}
                ></Form>
                <div className="mt-2">
                  Контрольный срок согласования для томов ПД, РД:
                  <br className="ml-6" />* Согласование служб - 3 раб. дн.{' '}
                  <br />* Согласование куратора филиала - 1 раб. дн. <br />*
                  Согласование куратора ИА - 1 раб. дн. <br />* Визирование - 10
                  раб. дн
                </div>
              </div>
              <div className="flex items-center justify-end mt-8">
                <Button
                  className="bg-light-gray flex items-center w-60 rounded-lg mr-4 font-weight-normal justify-center"
                  onClick={onClose}
                >
                  Закрыть
                </Button>
                <LoadableBaseButton
                  className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center font-weight-normal"
                  onClick={onSubmit}
                >
                  Сохранить
                </LoadableBaseButton>
              </div>
            </>
          )}
        </Validator>
      </CustomSizeModalWindow>
    </div>
  )
}

export default EditStageWindow
