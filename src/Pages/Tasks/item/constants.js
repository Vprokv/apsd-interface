import Requisites from '@/Pages/Tasks/item/Pages/Requisites'
import Subscription from '@/Pages/Tasks/item/Pages/Subscription'
import Objects from '@/Pages/Tasks/item/Pages/Objects'
import Contain from '@/Pages/Tasks/item/Pages/Contain'
import History from '@/Pages/Tasks/item/Pages/History'
import Content from '@/Pages/Tasks/item/Pages/Content'
import Links from '@/Pages/Tasks/item/Pages/Links'
import Handouts from '@/Pages/Tasks/item/Pages/Handouts'
import ApprovalSheet from '@/Pages/Tasks/item/Pages/ApprovalSheet'
import React from 'react'
import { ITEM_DOCUMENT } from '@/contants'
import PrintIcon from './Icons/PrintIcon.svg'
import NextIcon from './Icons/NextIcon.svg'
import FinishApproveIcon from './Icons/FinishApproveIcon.svg'
import RejectApproveIcon from './Icons/RejectApproveIcon.svg'
import AnnulIcon from './Icons/AnnulIcon.svg'
import StrelkaRight from './Icons/StrelkaRight.svg'
import SendToCheck from './Icons/SendToCheck.svg'
import RejectWithRemarks from './Icons/RejectWithRemarks.svg'
import Repeat from './Icons/Repeat.svg'
import ExchangeIcon from './Icons/ExchangeIcon.svg'
import Remarks from '@/Pages/Tasks/item/Pages/Remarks'
import UploadDoc from './Icons/UploadDoc.svg'
import LifeCycleHistory from '@/Pages/Tasks/item/Pages/LifeCycleHistory'

export const DocumentTypeContext = React.createContext(ITEM_DOCUMENT)

export const DocumentIdContext = React.createContext(null)

export const defaultPages = {
  requisites: {
    path: 'requisites',
    key: 'requisites',
    Component: Requisites,
  },
  subscription: {
    path: 'subscriptions',
    key: 'subscription',
    Component: Subscription,
  },
  technical_objects: {
    path: 'objects',
    key: 'technical_objects',
    Component: Objects,
  },
  title_structure: {
    path: 'structure',
    key: 'title_structure',
    Component: Contain,
  },
  audit: {
    path: 'history',
    key: 'audit',
    Component: History,
  },
  content: {
    path: 'content',
    key: 'content',
    Component: Content,
  },
  links: {
    path: 'links/*',
    key: 'links',
    Component: Links,
  },
  handouts: {
    path: 'handouts',
    key: 'handouts',
    Component: Handouts,
  },
  'approval-sheet': {
    path: 'approval-sheet/',
    key: 'approval-sheet',
    Component: ApprovalSheet,
  },
  remarks: {
    path: 'remarks',
    key: 'remarks',
    Component: Remarks,
  },
  lifecycle_history: {
    path: 'lifecycle_history',
    key: 'lifecycle_history',
    Component: LifeCycleHistory,
  },
}

export const defaultTaskIcon = {
  finish_approve: FinishApproveIcon,
  on_approved: FinishApproveIcon,
  finish_simple_approve: FinishApproveIcon,
  finish_prepare: FinishApproveIcon,
  apsd_prepare_reject: FinishApproveIcon,
  finish_approval: FinishApproveIcon,
  revision_finish: FinishApproveIcon,
  reject_approve: RejectApproveIcon,
  reject_prepare: RejectApproveIcon,
  reject_approval: RejectApproveIcon,
  on_cancel: AnnulIcon,
  sent_to_curator: StrelkaRight,
  on_approve: StrelkaRight,
  on_prepare: StrelkaRight,
  apsd_sap_prepare: SendToCheck,
  apsd_sap_prepare_reject: RejectWithRemarks,
  finish_consider: FinishApproveIcon,
  reject_consider: RejectApproveIcon,
  apsd_consolidate: FinishApproveIcon,
  apsd_consolidate_reject: RejectApproveIcon,
  reject_sap_prepare: RejectApproveIcon,
  apsd_all_consider: Repeat,
  onward: NextIcon,
  additional_agreement: UploadDoc,
  finish_sap_prepare: FinishApproveIcon,
  reject_sap_approve: RejectApproveIcon,
  on_consider: Repeat,
  print_card: PrintIcon,
  change_stage: ExchangeIcon,
}
