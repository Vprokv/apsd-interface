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
import { LinkContainer, OptionsContainer150px } from './styles'
import { URL_ENTITY_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'
import Icon from '@Components/Components/Icon'
import styled from 'styled-components'
import closeIcon from '@/Icons/closeIcon'
import pureDeleteItems from '@Components/Utils/Arrays/PureDeleteItems'
import pureUpdateArrayItems from '@Components/Utils/Arrays/PureUpdateArrayItems'
import { useFieldValidationStateConsumer } from '@/Components/Forms/Validation/useFieldValidationStateConsumer'
import LabelLessValidationUi from '@/Components/Forms/ValidationStateUi/LabelLessValidationUi'

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
  id,
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
      <LabelLessValidationUi
        value={value.ndtId}
        options={options}
        placeholder="Выберите значение"
        onInput={onInput('ndtId')}
        valueKey="r_object_id"
        labelKey="dss_name"
        refKey="ddt_dict_ndt"
        id={`${id}.${valueIndex}.ndtId`}
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
        inputComponent={LoadableSelect}
      />
      <div className="flex">
        <LabelLessValidationUi
          value={value.comment}
          placeholder="Раздел/Статья/Пункт НТД"
          className="ml-2"
          onInput={onInput('comment')}
          inputComponent={Input}
          id={`${id}.${valueIndex}.comment`}
        />
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
  id: PropTypes.string,
  valueIndex: PropTypes.object,
  deleteLink: PropTypes.func,
}
Field.defaultProps = {
  value: {},
}
const baseValue = []
const LinkNdt = (props) => {
  const { onInput, value = baseValue, id, options } = props
  const [fields, setFields] = useState(1)
  const [isTouchedFieldMap, setTouchedState] = useState({})
  const valueRef = useRef()
  const { onBlur, onFocus } = useFieldValidationStateConsumer(id)
  const handleInput = useCallback(
    (v) => {
      onInput(v, id)
      valueRef.current = v
    },
    [id, onInput],
  )

  const addLink = useCallback(() => setFields((s) => s + 1), [])

  const updateTouchedValidationState = useCallback(
    (nextVal) => {
      // в ручную пересоздаем состояние полей к которым дотронулся пользователь, чтобы избежать случайных подсветок
      nextVal.forEach(({ id, comment }, index) => {
        onFocus(!!id, `${id}.${index}.id`)
        onBlur(!!id, `${id}.${index}.id`)
        onFocus(!!comment, `${id}.${index}.comment`)
        onBlur(!!comment, `${id}.${index}.comment`)
      })
    },
    [onBlur, onFocus],
  )

  const deleteLink = useCallback(
    (index, valueIndex) => () => {
      if (valueIndex !== undefined) {
        const nextValue = pureDeleteItems(value, valueIndex)
        handleInput(nextValue)
        updateTouchedValidationState(nextValue)
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
    [fields, handleInput, updateTouchedValidationState, value],
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
        updateTouchedValidationState(nextVal)
        setTouchedState((nextState) => ({ ...nextState, [index]: true }))
      }
    },
    [handleInput, updateTouchedValidationState, value],
  )

  return (
    <div className="w-full">
      {useMemo(() => {
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
              id={id}
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
      }, [
        deleteLink,
        fields,
        handleFieldInput,
        id,
        isTouchedFieldMap,
        options,
        value,
      ])}
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
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
}
LinkNdt.defaultProps = {
  label: 'Ссылка на НДТ',
  isRequired: true,
}

export default LinkNdt
