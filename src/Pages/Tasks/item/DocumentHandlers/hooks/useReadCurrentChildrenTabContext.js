import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  TASK_ITEM_APPROVAL_SHEET,
  TASK_ITEM_CONTENT,
  TASK_ITEM_HANDOUTS,
  TASK_ITEM_HISTORY,
  TASK_ITEM_LIFE_CYCLE_HISTORY,
  TASK_ITEM_LINK,
  TASK_ITEM_OBJECTS,
  TASK_ITEM_REMARKS,
  TASK_ITEM_REQUISITES,
  TASK_ITEM_STRUCTURE,
  TASK_ITEM_SUBSCRIPTION,
} from '@/contants'

const childrenTabNamesMap = {
  requisites: TASK_ITEM_REQUISITES,
  subscriptions: TASK_ITEM_SUBSCRIPTION,
  objects: TASK_ITEM_OBJECTS,
  structure: TASK_ITEM_STRUCTURE,
  history: TASK_ITEM_HISTORY,
  content: TASK_ITEM_CONTENT,
  'links/*': TASK_ITEM_LINK,
  handouts: TASK_ITEM_HANDOUTS,
  'approval-sheet/': TASK_ITEM_APPROVAL_SHEET,
  remarks: TASK_ITEM_REMARKS,
  lifecycle_history: TASK_ITEM_LIFE_CYCLE_HISTORY,
}

const useReadCurrentChildrenTabContext = () => {
  const { ['*']: childrenTabName } = useParams()
  const { [childrenTabName]: tabName = childrenTabNamesMap.requisites } =
    childrenTabNamesMap

  const [tabItemState] = useTabItem({
    stateId: tabName,
  })

  return tabItemState
}

export default useReadCurrentChildrenTabContext
