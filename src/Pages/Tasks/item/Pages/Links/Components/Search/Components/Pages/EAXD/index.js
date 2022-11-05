import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Input from '@/Components/Fields/Input'
import { SecondaryBlueButton } from '@/Components/Button'
import { ApiContext } from '@/contants'
import { useParams } from 'react-router-dom'
import { URL_CONTENT_SEARCH } from '@/ApiList'

const DocumentEAXD = (props) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [filter, setFilter] = useState({})
  const [search, setSearch] = useState('')

  const onClick = useCallback(() => {
    const { data } = api.post(URL_CONTENT_SEARCH, {
      eehdBarcode: search,
      documentId: id,
    })
    setFilter(data)
  }, [search, id, api])

  return (
    <div className="flex my-4">
      <div className="w-64 flex items-center font-size-14">Штрихкод УЭХД</div>
      <Input value={search} onInput={setSearch} />
      <div className="w-64 ml-4">
        <SecondaryBlueButton onClick={onClick} className="w-64">
          Искать
        </SecondaryBlueButton>
      </div>
    </div>
  )
}

DocumentEAXD.propTypes = {}

export default DocumentEAXD
