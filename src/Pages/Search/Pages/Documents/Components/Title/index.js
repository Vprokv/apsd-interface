import React, { useContext, useState } from 'react'
import { ApiContext } from '@/contants'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_TYPE_CONFIG } from '@/ApiList'
// import { FilterForm } from '@/Pages/Search/Pages/Components/SearchFields/styles'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import styled from 'styled-components'
import Form from '@Components/Components/Forms'

export const FilterForm = styled(Form)`
  margin-top: 20px;
  display: grid;
  //grid-row-gap: 20px;
  grid-gap: 20px;
  align-items: flex-start;
  width: 100%;
  grid-template-columns: 3fr 1fr 1fr;
`

const Title = ({ value, onInput }) => {
  const api = useContext(ApiContext)

  // todo не понятный запрос
  // не чего не возвращает

  const fields = [
    {
      id: 1,
      label: 'Тип документа',
      component: LoadableSelect,
      valueKey: 'typeName',
      labelKey: 'typeLabel',
      options: [
        {
          typeName: 'ddt_project_calc_type_doc',
          typeLabel: 'Том',
        },
      ],
      loadFunction: async () => {
        const { data } = await api.post(URL_TYPE_CONFIG, {
          typeConfig: 'ddt_startup_complex_type_doc',
        })
        return data
      },
    },
  ]

  return (
    <FilterForm
      fields={fields}
      inputWrapper={InputWrapper}
      value={value}
      onInput={onInput}
    />
  )
}

export default Title
