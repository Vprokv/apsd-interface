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
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import {StateContext} from "@/Pages/Tasks/item/Pages/Links/constans";

const Files = (props) => {
  const userObject = useRecoilValue(userAtom)
  const { id } = useParams()
  const api = useContext(ApiContext)
  const close = useContext(StateContext)
  const [files, setFiles] = useState([])
  const onFileInput = useCallback(
    (file) => {
      setFiles([{ file }, ...files])
    },
    [files],
  )

  const save = useCallback(() => {
    api.post(URL_LINK_CREATE, {
      linkObjects: files.map(
        ({ file: [{ dsc_content }], ...documentPayload }) => ({
          parentId: id,
          contentId: dsc_content,
          authorEmpl: userObject.r_object_id,
          authorName: userObject.dss_user_name,
          ...documentPayload,
        }),
      ),
    })
  }, [api, files, id, userObject])
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
        sizes: 170,
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
            placeholder="Тип файла"
            loadFunction={async () => {
              const { data } = await api.post(URL_ENTITY_LIST, {
                type: 'ddt_dict_type_content',
              })
              return data
            }}
          />
        ),
        sizes: 170,
      },
      {
        id: 'comment',
        label: 'Комментарий',
        component: TextArea,
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        sizes: 170,
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
            placeholder="Тип файла"
            loadFunction={async () => {
              const { data } = await api.post(URL_ENTITY_LIST, {
                type: 'ddt_dict_link_type',
              })
              return data
            }}
          />
        ),
        sizes: 170,
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
