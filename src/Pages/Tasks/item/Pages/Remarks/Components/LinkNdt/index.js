import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { SecondaryBlueButton } from '@/Components/Button'
import LoadableSelect from '@/Components/Inputs/Select'
import Input from '@/Components/Fields/Input'
import { LinkContainer } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark/styles'

const Field = ({ onInput, prevValue }) => {
  console.log(prevValue, 'prevValue')

  return (
    <LinkContainer>
      <LoadableSelect
        placeholder="Выберите значение"
        id="id"
        value={prevValue?.id}
        onInput={onInput('id')}
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
  const [count, setCount] = useState(0)

  const onBaseInput = useCallback(
    (index) => (key) => (val) => {
      const { ndtLinks = [] } = links
      const el = [...ndtLinks][index]

      el[key] = val
      setLinks({ ...links, ndtLinks: ndtLinks.splice(index, 1, el) })
    },
    [links, setLinks],
  )

  const renderFields = useMemo(() => {
    const arr = []

    for (let i = 0; i < count; i++) {
      const onInput = onBaseInput(i)
      const prevValue = links.ndtLinks[i]
      arr.push(<Field onInput={onInput} prevValue={prevValue} />)
    }

    return arr
  }, [count, links.ndtLinks, onBaseInput])

  const addLink = useCallback(() => {
    const { ndtLinks = [] } = links
    const prevNdtLinks = [...ndtLinks]
    setCount(count + 1)
    prevNdtLinks.push({})
    setLinks({ ...links, ndtLinks: prevNdtLinks })
  }, [count, links, setLinks])

  return (
    <div className="flex flex-col w-4/5">
      {renderFields}
      <div className="flex mt-5 form-element-sizes-32">
        <SecondaryBlueButton
          onClick={addLink}
          className="w-64 form-element-sizes-32"
        >
          Добавить ссылку
        </SecondaryBlueButton>
        {children}
      </div>
    </div>
  )
}

LinkNdt.propTypes = {}

export default LinkNdt
