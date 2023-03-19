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
import UploadDoc from './Icons/UploadDoc.svg'
import FinishApproveIcon from './Icons/FinishApproveIcon.svg'
import RejectApproveIcon from './Icons/RejectApproveIcon.svg'
import AnnulIcon from './Icons/AnnulIcon.svg'
import StrelkaRight from './Icons/StrelkaRight.svg'
import Remarks from '@/Pages/Tasks/item/Pages/Remarks'

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
}

export const defaultDocumentHandlers = {
  print_card: {
    icon: PrintIcon,
    handler: () => alert('Функционал не реализован'),
  },
  export_doc: {
    icon: UploadDoc,
    handler: () => alert('Функционал не реализован'),
  },
}

export const defaultTaskIcon = {
  finish_approve: FinishApproveIcon,
  on_approved: FinishApproveIcon,
  finish_prepare: FinishApproveIcon,
  finish_approval: FinishApproveIcon,
  revision_finish: FinishApproveIcon,
  reject_approve: RejectApproveIcon,
  reject_prepare: RejectApproveIcon,
  reject_approval: RejectApproveIcon,
  on_cancel: AnnulIcon,
  sent_to_curator: StrelkaRight,
  on_approve: StrelkaRight,
}
