import React, { useCallback, useContext, useMemo, useState } from 'react'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_BUSINESS_DOCUMENT_ROUTE_CHANGE, URL_ENTITY_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { MiniModalWindow } from '@/Pages/Tasks/item/Pages/Contain/Components/DeleteContain'
import styled from 'styled-components'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { Validation } from '@Components/Logic/Validator'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateAnswer/styles'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import CheckBox from '@/Components/Inputs/CheckBox'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Изменение стадии прошло успешно',
    }
  },
}

export const ModalWindow = styled(ModalWindowWrapper)`
  width: 500px;
  margin: auto;
`

const rules = {
  stageId: [{ name: VALIDATION_RULE_REQUIRED }],
}

const ChangeRouteWindow = ({ open, onClose, documentId, reloadData }) => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({ pdInIa: false })
  const getNotification = useOpenNotification()
  const [openSmall, setOpenSmall] = useState(false)

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenSmall(nextState)
    },
    [],
  )

  const fields = useMemo(
    () => [
      {
        id: 'pdInIa',
        component: CheckBox,
        text: 'ПД в ИА',
      },
      {
        id: 'branchId',
        label: 'Филиал (Исполнителя)',
        placeholder: 'Выберите нову стадию тома',
        component: LoadableSelect,
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_branch',
            query,
          })
          return data
        },
      },
    ],
    [api],
  )

  const onSave = useCallback(async () => {
    try {
      const { status } = await api.post(URL_BUSINESS_DOCUMENT_ROUTE_CHANGE, {
        documentId,
        ...filter,
      })
      getNotification(customMessagesFuncMap[status]())
      reloadData()
      onClose()
    } catch (e) {
      const { response: { status = 500, data = '' } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, documentId, filter, getNotification, onClose, reloadData])

  return (
    <ModalWindow
      title="Смена маршрута рассмотрения"
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col overflow-hidden ">
        <Validation
          fields={fields}
          value={filter}
          onInput={setFilter}
          rules={rules}
          onSubmit={changeModalState(true)}
        >
          {(validationProps) => {
            return (
              <>
                <FilterForm
                  className="form-element-sizes-40"
                  {...validationProps}
                />
                <div className="mt-10">
                  <UnderButtons
                    disabled={!validationProps.formValid}
                    rightFunc={validationProps.onSubmit}
                    leftFunc={onClose}
                  />
                </div>
                <MiniModalWindow
                  сlassName="font-size-14"
                  open={openSmall}
                  onClose={changeModalState(false)}
                  title=""
                  index={10000}
                >
                  <>
                    <div className="flex flex-col overflow-hidden h-full mb-4">
                      Вы уверены, что хотите сменить маршрут согласования ?
                    </div>
                    <UnderButtons
                      className={'w-full'}
                      rightFunc={onSave}
                      rightLabel={'Да'}
                      leftFunc={changeModalState(false)}
                      leftLabel={'Нет'}
                      rightStyle={'w-full'}
                      leftStyle={'w-full mr-4'}
                    />
                  </>
                </MiniModalWindow>
              </>
            )
          }}
        </Validation>
      </div>
    </ModalWindow>
  )
}

ChangeRouteWindow.propTypes = {}

export default ChangeRouteWindow
