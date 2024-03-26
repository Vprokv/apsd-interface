import { useCallback, useContext, useMemo, useState } from 'react'
import { LoadableSecondaryBlueButton } from '@/Components/Button'
import { ApiContext, TASK_ITEM_LINK } from '@/contants'
import { useParams } from 'react-router-dom'
import {
  URL_CONTENT_SEARCH,
  URL_ENTITY_LIST,
  URL_LINK_CREATE,
  URL_LINK_CREATE_RELATION,
} from '@/ApiList'
import LoadableSelect from '@/Components/Inputs/Select'
import {
  FilterRowForm,
  TableForm,
} from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/EAXD/styles'
import Input from '@/Components/Fields/Input'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { StateContext } from '@/Pages/Tasks/item/Pages/Links/constans'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'

const fields = [
  {
    key: 'dssNumber',
    id: 'dssNumber',
    label: 'Регистрационный номер',
    component: Input,
    disabled: true,
  },
  {
    key: 'dssDescription',
    id: 'dssDescription',
    label: 'Краткое содержание',
    component: Input,
    disabled: true,
  },
  {
    key: 'eehdBarcode',
    id: 'eehdBarcode',
    label: 'Штрихкод',
    component: Input,
    disabled: true,
  },
  {
    key: 'dsdtDocumentDate',
    id: 'dsdtDocumentDate',
    label: 'Дата регистрации',
    component: Input,
    disabled: true,
  },
  {
    key: 'dssAuthorFio',
    id: 'dssAuthorFio',
    label: 'Автор документа',
    component: Input,
    disabled: true,
  },
]

const STATUS_NOT_EXIST = 'NOT_EXIST'

const rules = {
  linkType: [{ name: VALIDATION_RULE_REQUIRED }],
}

const DocumentEAXD = () => {
  const api = useContext(ApiContext)
  const { id, type } = useParams()
  const parentId = useContext(DocumentIdContext)
  const [filter, setFilter] = useState({})
  const [search, setSearch] = useState('')
  const [searchFields, setSearchFields] = useState([])
  const { r_object_id, dss_user_name } = useRecoilValue(userAtom)
  const close = useContext(StateContext)
  const getNotification = useOpenNotification()

  const onClick = useCallback(async () => {
    try {
      const {
        data,
        data: { status, message },
      } = await api.post(URL_CONTENT_SEARCH, {
        eehdBarcode: search,
        documentId: id,
      })

      if (status === STATUS_NOT_EXIST) {
        return getNotification(defaultFunctionsMap[412](message))
      }

      setFilter(data)
      setSearchFields(fields)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, search, id, getNotification])

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_LINK,
  })

  const formFields = useMemo(
    () => [
      {
        id: 'regNumber',
        component: Input,
        label: 'Шифр/Рег.номер',
        placeholder: 'Укажите шифр/Рег.номер',
      },
      {
        id: 'linkType',
        component: LoadableSelect,
        label: 'Тип связи',
        placeholder: 'Укажите тип связи',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_link_type',
            query,
          })
          return data
        },
      },
      {
        id: 'comment',
        component: Input,
        label: 'Комментарий',
        placeholder: 'Введите комментарий',
      },
    ],
    [api],
  )

  const create = useCallback(async () => {
    try {
      const {
        comment,
        linkType,
        eehdBarcode,
        dssNumber,
        eehdDocumentType,
        eehdDocumentId,
        dssDescription,
        dsdtDocumentDate,
        dssAuthorFio,
        dssFilename,
        content,
        status,
      } = filter
      const {
        data: { id: contentId },
      } = await api.post(URL_LINK_CREATE_RELATION, {
        eehdBarcode,
        dssNumber,
        eehdDocumentType,
        eehdDocumentId,
        dssDescription,
        dsdtDocumentDate,
        dssAuthorFio,
        dssFilename,
        content,
        status,
        documentId: parentId,
        documentType: type,
      })

      const { status: respStatus } = await api.post(URL_LINK_CREATE, {
        linkObjects: [
          {
            parentId,
            contentId,
            documentType: eehdDocumentType,
            regNumber: dssNumber,
            regDate: dsdtDocumentDate,
            description: dssDescription,
            authorEmpl: r_object_id,
            authorName: dss_user_name,
            comment,
            linkType,
          },
        ],
      })

      getNotification(defaultFunctionsMap[respStatus]())

      setTabState(setUnFetchedState())
      close()
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    filter,
    api,
    parentId,
    type,
    r_object_id,
    dss_user_name,
    setTabState,
    close,
    getNotification,
  ])

  return (
    <>
      <div className="flex flex-col overflow-hidden h-full">
        <div className="flex flex-col my-4">
          <TableForm className="form-element-sizes-32">
            <InputWrapper label={'Штрихкод ЕЭХД'}>
              <Input value={search} onInput={setSearch} />
            </InputWrapper>
            <LoadableSecondaryBlueButton
              className="ml-4 w-64 h-min"
              onClick={onClick}
              disabled={!search}
            >
              Искать
            </LoadableSecondaryBlueButton>
          </TableForm>
          {!!Object.keys(filter).length && (
            <FilterRowForm
              className="my-4"
              fields={[...searchFields, ...formFields]}
              inputWrapper={InputWrapper}
              value={filter}
              onInput={setFilter}
              rules={rules}
            />
          )}
        </div>
      </div>
      <UnderButtons leftFunc={close} rightLabel="Связать" rightFunc={create} />
    </>
  )
}

DocumentEAXD.propTypes = {}

export default DocumentEAXD
