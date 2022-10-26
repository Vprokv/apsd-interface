import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import PropTypes from 'prop-types'
import {
  ApiContext,
  DocumentTypeContext,
  TASK_ITEM_DOCUMENT,
  TASK_ITEM_NEW_DOCUMENT,
  TASK_ITEM_REQUISITES,
} from '../../../contants'
import useTabItem from '../../../components_ocean/Logic/Tab/TabItem'
import { URL_DOCUMENT_CLASSIFICATION, URL_TASK_ITEM } from '@/ApiList'
import { useParams } from 'react-router-dom'
import { BaseItem } from './baseItem'

const NewTaskItem = (props) => {
  const api = useContext(ApiContext)
  const { classificationId } = useParams()
  const {
    tabState: {
      data: { values: { dss_work_number = 'Новый документ' } = {} } = {},
    },
    initialState,
  } = useTabItem({ stateId: TASK_ITEM_NEW_DOCUMENT })

  const {
    shouldReloadDataFlag,
    loadDataHelper,
    tabState: { data = { documentTabs: [] } },
  } = useTabItem({
    setTabName: useCallback(() => dss_work_number, [dss_work_number]),
    stateId: TASK_ITEM_NEW_DOCUMENT,
  })

  const loadDataFunction = useMemo(() => {
    return loadDataHelper(async () => {
      const { valuesCustom, values } = initialState || {}
      const { data } = await api.post(URL_DOCUMENT_CLASSIFICATION, {
        classificationId,
      })
      return {
        ...data,
        values: { ...data.values, ...values },
        valuesCustom: { ...data.valuesCustom, ...valuesCustom },
      }
    })
  }, [classificationId, api, loadDataHelper, initialState])

  const refLoadDataFunction = useRef(loadDataFunction)

  useEffect(() => {
    if (
      shouldReloadDataFlag ||
      loadDataFunction !== refLoadDataFunction.current
    ) {
      loadDataFunction()
    }
    refLoadDataFunction.current = loadDataFunction
  }, [loadDataFunction, shouldReloadDataFlag])

  return (
    <DocumentTypeContext.Provider value={TASK_ITEM_NEW_DOCUMENT}>
      <BaseItem documentTabs={data.documentTabs} />;
    </DocumentTypeContext.Provider>
  )
}

NewTaskItem.propTypes = {}

export default NewTaskItem
