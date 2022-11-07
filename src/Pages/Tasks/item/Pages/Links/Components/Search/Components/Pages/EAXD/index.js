import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import EmptyInput from '../../../../Input/style'
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
import { TableForm } from '@/Pages/Tasks/item/Pages/Links/Components/Search/Components/Pages/EAXD/styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import Input from '@/Components/Fields/Input'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { SaveContext } from '@/Pages/Tasks/item/Pages/Links/constans'

const fields = [
  {
    key: 'dssNumber',
    title: 'Шифр/Рег.номер',
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
  const [filter, setFilter] = useState({})
  const [search, setSearch] = useState('')
  const { r_object_id, dss_user_name } = useRecoilValue(userAtom)
  const setSave = useContext(SaveContext)
  console.log(setSave, 'setSave')

  const onClick = useCallback(() => {
    const { data } = api.post(URL_CONTENT_SEARCH, {
      eehdBarcode: search,
      documentId: id,
    })
    setFilter({
      dssNumber: 'Test/03/ВН-11', //- заполняем поле шифр/рег номер
      eehdDocumentType: 'ddt_12_06_03_type_doc',
      eehdDocumentId: '00000000000BDvDQ',
      dsidContentType: '00xxxxxx0000010d',
      dssDescription: 'ГА. Служебная записка (общий)', // - поле краткое содержание
      // SUCCESS: true,
      eehdBarcode: '0003232487418804', //- поле ШК
      dsdtDocumentDate: '13.05.2021 14:34:01', //- дата регистрации
      dssAuthorFio: 'Королев Иван Анатольевич', // - автором заполняем текущего пользователя, по идеи должен сходится с тем что в атрибуте
      dssFilename: 'Тестовый Вх.doc',
      content:
        'http://msk-dc-uhk.moesk.ru/ebox/content/download?documentType\u003dddt_12_06_03_type_doc\u0026documentId\u003d00000000000BDvDQ',
      status: 'OK',
    })
  }, [search, id, api])

  const formFields = useMemo(
    () => [
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
        loadFunction: async () => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_link_type',
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
    const { comment, linkType, ...item } = filter
    const {
      data: { id: contentId },
    } = await api.post(URL_LINK_CREATE_RELATION, {
      ...item,
      documentId: id,
      documentType: type,
    })

    await api.post(URL_LINK_CREATE, {
      linkObjects: [
        {
          parentId: id,
          contentId,
          regNumber: filter.dssNumber,
          regDate: filter.dssNumber,
          description: filter.dssDescription,
          authorEmpl: r_object_id, //- id текущего пользователя
          authorName: dss_user_name, //- логин текущего пользователя
          comment,
          linkType,
        },
      ],
    })
  }, [api, filter, id, type, r_object_id, dss_user_name])

  const clearState = useCallback(() => {
    setSearch('')
    setFilter({})
  }, [])

  useEffect(() => {
    setSave({ create, clearState })
  }, [setSave, create, clearState])

  return (
    <div className="flex flex-col my-4">
      <TableForm>
        <div className="flex items-center font-size-14 px-4">Штрихкод ЕЭХД</div>
        <Input value={search} onInput={setSearch} />
        <div className="w-64 mr-auto">
          <SecondaryBlueButton onClick={onClick} className="w-64">
            Искать
          </SecondaryBlueButton>
        </div>
      </TableForm>
      {disabledFields}
    </div>
  )
}

DocumentEAXD.propTypes = {}

export default DocumentEAXD
