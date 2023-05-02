import {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { SecondaryBlueButton } from '@/Components/Button'
import LoadableSelect from '@/Components/Inputs/Select'
import Input from '@/Components/Fields/Input'
import { LinkContainer } from './styles'
import { URL_ENTITY_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'
import Icon from '@Components/Components/Icon'
import styled from 'styled-components'
import closeIcon from '@/Icons/closeIcon'
import pureDeleteItems from '@Components/Utils/Arrays/PureDeleteItems'
import pureUpdateArrayItems from '@Components/Utils/Arrays/PureUpdateArrayItems'
import { returnChildren } from '@Components/Components/Forms'
import { ValidationConsumer } from '@/Components/InputWrapperRefactor'

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
const baseFieldValue = {}
const Field = ({
  onInput,
  value = baseFieldValue,
  index,
  valueIndex,
  deleteLink,
  className,
  options,
}) => {
  const api = useContext(ApiContext)

  return (
    <LinkContainer className={className}>
      <ValidationConsumer path={`${valueIndex}.id`}>
        <LoadableSelect
          options={options}
          placeholder="Выберите значение"
          id={`${index}_id`}
          value={value.id}
          onInput={onInput('id')}
          valueKey="r_object_id"
          labelKey="dss_name"
          refKey="ddt_dict_ndt"
          loadFunction={useCallback(
            async (query) => {
              const { data } = await api.post(URL_ENTITY_LIST, {
                type: 'ddt_dict_ndt',
                query,
              })
              return data
            },
            [api],
          )}
        />
      </ValidationConsumer>
      <div className="flex">
        <ValidationConsumer path={`${index}.comment`}>
          <Input
            id={`${index}_comment`}
            placeholder="Раздел/Статья/Пункт НТД"
            value={value.comment}
            className="ml-2"
            onInput={onInput('comment')}
          />
        </ValidationConsumer>
        {index !== 0 && (
          <DocumentButton onClick={deleteLink} className="ml-2 bg-color-red">
            <Icon icon={closeIcon} />
          </DocumentButton>
        )}
      </div>
    </LinkContainer>
  )
}

Field.propTypes = {
  onInput: PropTypes.func,
  className: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.object,
  index: PropTypes.string,
  valueIndex: PropTypes.object,
  deleteLink: PropTypes.func,
}
Field.defaultProps = {
  value: {},
}
const baseValue = []
const LinkNdt = ({ InputUiContext = returnChildren, ...props }) => {
  const { onInput, value = baseValue, id, options } = props
  const [fields, setFields] = useState(1)
  const [isTouchedFieldMap, setTouchedState] = useState({})
  const valueRef = useRef()

  const handleInput = useCallback(
    (v) => {
      onInput(v, id)
      valueRef.current = v
    },
    [id, onInput],
  )

  const addLink = useCallback(() => setFields((s) => s + 1), [])

  const deleteLink = useCallback(
    (index, valueIndex) => () => {
      if (valueIndex !== undefined) {
        handleInput(pureDeleteItems(value, valueIndex))
        setTouchedState(({ [index]: _, ...nextState }) => nextState)
      }
      setTouchedState((prevState) => {
        const nextState = {}
        for (let i = 0; i < fields; i++) {
          if (i > index) {
            if (prevState[i]) {
              nextState[i - 1] = prevState[i]
            }
          } else if (prevState[i]) {
            nextState[i] = prevState[i]
          }
        }
        return nextState
      })
      setFields((s) => s - 1)
    },
    [fields, handleInput, value],
  )

  useLayoutEffect(() => {
    if (valueRef.current !== value) {
      if (value.length > 0) {
        setFields(value.length)
        const touchedState = {}
        for (let i = 0; i < value.length; i++) {
          touchedState[i] = true
          setTouchedState(touchedState)
        }
      }
    }
  }, [value])

  const handleFieldInput = useCallback(
    (index, valueIndex, prevValueIndex) => (key) => (val) => {
      if (valueIndex !== undefined) {
        handleInput(
          pureUpdateArrayItems(value, valueIndex, {
            ...value[valueIndex],
            [key]: val,
          }),
        )
      } else {
        let nextVal = [...value]
        nextVal.splice(prevValueIndex, 0, { [key]: val })
        handleInput(nextVal)
        setTouchedState((nextState) => ({ ...nextState, [index]: true }))
      }
    },
    [handleInput, value],
  )

  const renderFields = useMemo(() => {
    const arr = []
    let vIndex = 0

    for (let i = 0; i < fields; i++) {
      let v
      let valueIndex
      if (isTouchedFieldMap[i]) {
        v = value[vIndex]
        valueIndex = vIndex
        vIndex += 1
      }
      arr.push(
        <Field
          options={options}
          className={i !== fields - 1 ? 'mb-6' : ''}
          deleteLink={deleteLink(i, valueIndex)}
          index={i}
          onInput={handleFieldInput(i, valueIndex, vIndex)}
          value={v}
          valueIndex={valueIndex}
          key={i}
        />,
      )
    }

    return arr
  }, [deleteLink, fields, handleFieldInput, isTouchedFieldMap, value])

  return (
    <div className="w-full">
      <InputUiContext {...props}>{renderFields}</InputUiContext>
      <div className="flex ml-auto mt-4">
        <SecondaryBlueButton
          onClick={addLink}
          className="w-64 form-element-sizes-32 ml-auto"
        >
          Добавить ссылку
        </SecondaryBlueButton>
      </div>
    </div>
  )
}

LinkNdt.propTypes = {
  value: PropTypes.array,
  onInput: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  options: PropTypes.array,
  InputUiContext: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}
LinkNdt.defaultProps = {
  label: 'Ссылка на НДТ',
  isRequired: true,
}

export default LinkNdt
