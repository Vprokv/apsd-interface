import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { SecondaryBlueButton } from '@/Components/Button'
import LoadableSelect from '@/Components/Inputs/Select'
import Input from '@/Components/Fields/Input'
import { LinkContainer, InputLabel, Container } from './styles'
import { URL_ENTITY_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'
import { InputLabelStart } from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import Icon from '@Components/Components/Icon'
import DocumentShowIcon from '@/Icons/DocumentShowIcon'
import { ShowDocumentButton } from '@/Components/Inputs/DocumentSelect/Component/ShowDocumentComponent'
import styled from 'styled-components'
import closeIcon from '@/Icons/closeIcon'
import ViewIcon from '@/Icons/ViewIcon'
import log from 'tailwindcss/lib/util/log'

export const DocumentButton = styled.button.attrs({ type: 'button' })`
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: var(--form--elements_height);
  width: var(--form--elements_height);
  min-width: var(--form--elements_height);

  &:disabled {
    background: var(--text-secondary);
    color: var(--form-elements-border-color);
  }
`

const Field = ({ onInput, prevValue, notFirstElement, deleteLink, id }) => {
  const api = useContext(ApiContext)

  const options = useMemo(() => {
    return [
      {
        dss_name: prevValue?.name,
        r_object_id: prevValue?.id,
      },
    ]
  }, [prevValue])

  return (
    <LinkContainer>
      <div className="flex ">
        <LoadableSelect
          placeholder="Выберите значение"
          id="id"
          options={options}
          value={prevValue.id}
          onInput={onInput}
          valueKey="r_object_id"
          labelKey="dss_name"
          loadFunction={async (query) => {
            const { data } = await api.post(URL_ENTITY_LIST, {
              type: 'ddt_dict_ndt',
              query,
            })
            return data
          }}
        />
        <DocumentButton className="ml-2 bg-light-gray color-text-secondary">
          <Icon className="color-text-secondary" size={24} icon={ViewIcon} />
        </DocumentButton>
      </div>
      <div className="flex">
        <Input
          id="comment"
          placeholder="Добавьте комментарий"
          value={prevValue?.comment}
          className="ml-2"
          onInput={onInput}
        />
        {notFirstElement && (
          <DocumentButton
            onClick={deleteLink(id)}
            className="ml-2 bg-color-red"
          >
            <Icon icon={closeIcon} />
          </DocumentButton>
        )}
      </div>
    </LinkContainer>
  )
}

const LinkNdt = (props) => {
  const { onInput, value } = props

  const addLink = useCallback(() => {
    onInput(({ nthLinks, ...prev }) => {
      const prevNth = [...nthLinks]
      prevNth.push({})
      return { ...prev, nthLinks: prevNth }
    })
  }, [onInput])

  const deleteLink = useCallback(
    (index) => () => {
      onInput(({ nthLinks, ...prev }) => {
        const prevNth = [...nthLinks]
        prevNth.splice(index, 1)
        return { ...prev, nthLinks: prevNth }
      })
    },
    [onInput],
  )

  const onBaseInput = useCallback(
    (index) => (val, key) => {
      onInput(({ nthLinks, ...prev }) => {
        const prevNth = [...nthLinks]

        const el = { ...prevNth[index] }
        el[key] = val
        prevNth.splice(index, 1, el)

        return { ...prev, nthLinks: prevNth }
      })
    },
    [onInput],
  )

  const renderFields = useMemo(() => {
    const arr = []

    for (let i = 0; i < value.length; i++) {
      const onInput = onBaseInput(i)
      const prevValue = value[i]

      arr.push(
        <Field
          deleteLink={deleteLink}
          id={i}
          notFirstElement={i > 0}
          onInput={onInput}
          prevValue={prevValue}
          key={i}
        />,
      )
    }

    return arr
  }, [deleteLink, onBaseInput, value])

  return (
    <div className="w-full">
      {renderFields}
      <div className="flex mt-4">
        <SecondaryBlueButton
          onClick={addLink}
          className="w-64 form-element-sizes-32"
        >
          Добавить ссылку
        </SecondaryBlueButton>
      </div>
    </div>
  )
}

LinkNdt.propTypes = {}
LinkNdt.defaultProps = {
  label: 'Ссылка на НДТ',
  isRequired: true,
}

export default LinkNdt
