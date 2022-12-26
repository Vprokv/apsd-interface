import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { SecondaryBlueButton } from '@/Components/Button'
import LoadableSelect from '@/Components/Inputs/Select'
import Input from '@/Components/Fields/Input'
import { LinkContainer, InputLabel, Container } from './styles'
import { URL_ENTITY_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'
import { InputLabelStart } from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'

const Label = ({ label, isRequired }) => (
  <InputLabel>
    {label} {isRequired && <InputLabelStart>*</InputLabelStart>}
  </InputLabel>
)
Label.defaultProps = {
  label: 'Ссылка на НДТ',
  isRequired: true,
}

const Field = ({ onInput, prevValue }) => {
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
      <Label />
      <LoadableSelect
        placeholder="Выберите значение"
        id="id"
        options={options}
        value={prevValue?.id}
        onInput={onInput('id')}
        valueKey="r_object_id"
        labelKey="dss_name"
        loadFunction={async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_ndt',
            query
          })
          return data
        }}
      />
      <Input
        id="comment"
        placeholder="Добавьте комментарий"
        value={prevValue?.comment}
        className="ml-2"
        onInput={onInput('comment')}
      />
    </LinkContainer>
  )
}

const LinkNdt = ({ links, setLinks, children }) => {
  const [count, setCount] = useState(links?.ndtLinks?.length || 0)
  const onBaseInput = useCallback(
    (index) => (key) => (val) => {
      const { ndtLinks = [] } = links
      const prevValue = [...ndtLinks]
      const el = { ...prevValue[index] }

      el[key] = val
      prevValue.splice(index, 1, el)

      setLinks({
        ...links,
        ndtLinks: prevValue,
      })
    },
    [links, setLinks],
  )

  const renderFields = useMemo(() => {
    const arr = []

    for (let i = 0; i < count; i++) {
      const onInput = onBaseInput(i)
      const { ndtLinks = [] } = links
      const prevValue = ndtLinks[i]
      arr.push(<Field onInput={onInput} prevValue={prevValue} key={i} />)
    }

    return arr
  }, [count, links, onBaseInput])

  const addLink = useCallback(() => {
    const { ndtLinks = [] } = links
    const prevNdtLinks = [...ndtLinks]
    setCount(count + 1)
    prevNdtLinks.push({})
    setLinks({ ...links, ndtLinks: prevNdtLinks })
  }, [count, links, setLinks])

  return (
    <Container>
      {renderFields}
      <LinkContainer>
        <Label label={!count ? 'Ссылка нв НДТ' : ''} isRequired={!count} />
        <div className="flex">
          <SecondaryBlueButton
            onClick={addLink}
            className="w-64 form-element-sizes-32"
          >
            Добавить ссылку
          </SecondaryBlueButton>
          {children}
        </div>
      </LinkContainer>
    </Container>
  )
}

LinkNdt.propTypes = {}
LinkNdt.defaultProps = {
  label: 'Ссылка на НДТ',
  isRequired: true,
}

export default LinkNdt
