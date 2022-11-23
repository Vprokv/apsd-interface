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
import Remarks from "@/Pages/Tasks/item/Pages/Remarks";

export const DocumentTypeContext = React.createContext(ITEM_DOCUMENT)

export const DocumentIdContext = React.createContext(null)

export const defaultPages = [
  {
    path: 'requisites',
    key: 'requisites',
    Component: Requisites,
  },
  {
    path: 'subscriptions',
    key: 'subscription',
    Component: Subscription,
  },
  {
    path: 'objects',
    key: 'technical_objects',
    Component: Objects,
  },
  {
    path: 'structure',
    key: 'title_structure',
    Component: Contain,
  },
  {
    path: 'history',
    key: 'audit',
    Component: History,
  },
  {
    path: 'content',
    key: 'content',
    Component: Content,
  },
  {
    path: 'links/*',
    key: 'links',
    Component: Links,
  },
  {
    path: 'handouts',
    key: 'handouts',
    Component: Handouts,
  },
  {
    path: 'approval-sheet/',
    key: 'approval-sheet',
    Component: ApprovalSheet,
  },
  {
    path: 'remarks',
    key: 'remarks',
    Component: Remarks,
  },
]

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
