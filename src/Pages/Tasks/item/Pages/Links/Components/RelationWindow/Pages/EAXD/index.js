import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import EmptyInput from '../../../Input/style'
import { SecondaryBlueButton } from '@/Components/Button'
import { ApiContext } from '@/contants'
import { useParams } from 'react-router-dom'
import {
  URL_CONTENT_SEARCH,
  URL_ENTITY_LIST,
  URL_LINK_CREATE,
  URL_LINK_CREATE_RELATION,
} from '@/ApiList'
import LoadableSelect from '@/Components/Inputs/Select'
import { TableForm } from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/EAXD/styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import Input from '@/Components/Fields/Input'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import {
  SaveContext,
  StateContext,
  UpdateContext,
} from '@/Pages/Tasks/item/Pages/Links/constans'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'

const fields = [
  {
    key: 'dssNumber',
    title: 'Регистрационный номер',
  },
  {
    key: 'dssDescription',
    title: 'Краткое содержание',
  },
  {
    key: 'eehdBarcode',
    title: 'Штрихкод',
  },
  {
    key: 'dsdtDocumentDate',
    title: 'Дата регистрации',
  },
  {
    key: 'dssAuthorFio',
    title: 'Автор документа',
  },
]

const DocumentEAXD = (props) => {
  const api = useContext(ApiContext)
  const { id, type } = useParams()
  const parentId = useContext(DocumentIdContext)
  const [filter, setFilter] = useState({})
  const [search, setSearch] = useState('')
  const { r_object_id, dss_user_name } = useRecoilValue(userAtom)
  const close = useContext(StateContext)
  const update = useContext(UpdateContext)

  const onClick = useCallback(async () => {
    const { data } = await api.post(URL_CONTENT_SEARCH, {
      eehdBarcode: search,
      documentId: id,
    })
    setFilter(data)
  }, [search, id, api])

  const formFields = useMemo(
    () => [
      {
        id: '0',
        component: EmptyInput,
        value: 'Шифр/Рег.номер',
        disabled: true,
      },
      {
        id: 'reg2',
        component: Input,
      },
      {
        id: '00',
        component: EmptyInput,
        disabled: true,
      },
      {
        id: '1',
        component: EmptyInput,
        value: 'Тип связи *',
        disabled: true,
      },
      {
        id: 'linkType',
        component: LoadableSelect,
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
        id: '2',
        component: EmptyInput,
        disabled: true,
      },
      {
        id: '3',
        component: EmptyInput,
        disabled: true,
        value: 'Комментарий',
      },
      {
        id: 'comment',
        component: Input,
        placeholder: 'Введите комментарий',
      },
      {
        id: '4',
        component: EmptyInput,
        disabled: true,
      },
    ],
    [api],
  )

  const disabledFields = useMemo(() => {
    return (
      !!Object.keys(filter).length && (
        <>
          <TableForm className="my-4">
            {fields.map(({ key, title }) => {
              if (filter[key]) {
                return (
                  <>
                    <div className="flex items-center font-size-14 px-4">
                      {title}
                    </div>
                    <Input disabled={true} value={filter[key]} />
                    <div>{''}</div>
                  </>
                )
              }
            })}
          </TableForm>
          <TableForm
            fields={formFields}
            inputWrapper={EmptyInputWrapper}
            value={filter}
            onInput={setFilter}
          />
        </>
      )
    )
  }, [filter, formFields])

  const create = useCallback(async () => {
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

    await api.post(URL_LINK_CREATE, {
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
    update()
    close()
  }, [api, filter, id, type, r_object_id, dss_user_name])

  return (
    <>
      <div className="flex flex-col overflow-hidden h-full">
        <div className="flex flex-col my-4">
          <TableForm>
            <div className="flex items-center font-size-14 px-4">
              Штрихкод ЕЭХД
            </div>
            <Input value={search} onInput={setSearch} />
            <div className="w-64 mr-auto">
              <SecondaryBlueButton onClick={onClick} className="w-64">
                Искать
              </SecondaryBlueButton>
            </div>
          </TableForm>
          {disabledFields}
        </div>
      </div>
      <UnderButtons leftFunc={close} rightLabel="Связать" rightFunc={create} />
    </>
  )
}

DocumentEAXD.propTypes = {}

export default DocumentEAXD
