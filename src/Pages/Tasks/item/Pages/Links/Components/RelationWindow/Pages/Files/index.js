import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import FileInput from '@/Components/Inputs/FileInput'
import Option from '@Components/Components/Inputs/FileInput/Option'
import ListTable from '@Components/Components/Tables/ListTable'
import Input from '@/Components/Fields/Input'
import TextArea from '@Components/Components/Inputs/TextArea'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST, URL_LINK_CREATE } from '@/ApiList'
import { ApiContext } from '@/contants'
import ScrollBar from 'react-perfect-scrollbar'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import {
  StateContext,
  UpdateContext,
} from '@/Pages/Tasks/item/Pages/Links/constans'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Связь добавлена успешно',
    }
  },
}

const Files = (props) => {
  const userObject = useRecoilValue(userAtom)
  const api = useContext(ApiContext)
  const close = useContext(StateContext)
  const update = useContext(UpdateContext)
  const parentId = useContext(DocumentIdContext)
  const [files, setFiles] = useState([])
  const getNotification = useOpenNotification()
  const onFileInput = useCallback(
    (file) => {
      setFiles([{ file }, ...files])
    },
    [files],
  )

  const save = useCallback(async () => {
    try {
      const response = await api.post(URL_LINK_CREATE, {
        linkObjects: files.map(
          ({
            file: [{ dsc_content, dss_content_name }],
            ...documentPayload
          }) => ({
            ...documentPayload,
            parentId,
            documentType: dss_content_name,
            contentId: dsc_content,
            authorEmpl: userObject.r_object_id,
            authorName: userObject.dss_user_name,
          }),
        ),
      })
      update()
      close()
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    files,
    update,
    close,
    getNotification,
    parentId,
    userObject.r_object_id,
    userObject.dss_user_name,
  ])
  const columns = useMemo(
    () => [
      {
        id: 'file',
        label: 'Файл',
        component: Option,
        sizes: 270,
      },
      {
        id: 'regNumber',
        label: 'Шифр/Рег. номер',
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        component: Input,
        sizes: 200,
      },
      {
        label: 'Тип файла',
        id: 'documentType',
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        component: (props) => (
          <LoadableSelect
            {...props}
            valueKey="r_object_id"
            labelKey="dss_name"
            placeholder="Выберите тип файла"
            loadFunction={async (query) => {
              const { data } = await api.post(URL_ENTITY_LIST, {
                type: 'ddt_dict_type_content',
                query,
              })
              return data
            }}
          />
        ),
        sizes: 220,
      },
      {
        id: 'comment',
        label: 'Комментарий',
        component: TextArea,
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        sizes: 200,
      },
      {
        label: 'Тип связи',
        id: 'linkType',
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        component: (props) => (
          <LoadableSelect
            {...props}
            valueKey="r_object_id"
            labelKey="dss_name"
            placeholder="Выберите тип связи"
            loadFunction={async () => {
              const { data } = await api.post(URL_ENTITY_LIST, {
                type: 'ddt_dict_link_type',
              })
              return data
            }}
          />
        ),
        sizes: 220,
      },
    ],
    [api],
  )
  return (
    <div className="p-4 flex-container">
      <FileInput onInput={onFileInput} />
      <ScrollBar>
        <ListTable
          columns={columns}
          onInput={setFiles}
          value={files}
          headerCellComponent={HeaderCell}
        />
      </ScrollBar>
      <UnderButtons leftFunc={close} rightLabel="Cвязать" rightFunc={save} />
    </div>
  )
}

Files.propTypes = {}

export default Files
