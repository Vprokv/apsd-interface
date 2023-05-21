import { useState } from 'react'
import {
  AlwaysShowMultipleSelectedValuesSelect,
  Select,
} from '@/Components/Inputs/Select'
import DatePicker from '@/Components/Inputs/DatePicker'
import TextArea from '@Components/Components/Inputs/TextArea'
import Input from '@Components/Components/Inputs/Input'

const InputTest = () => {
  const [state, setState] = useState({})
  const onInput = (v, id) => setState((pS) => ({ ...pS, [id]: v }))
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '350px 170px 550px',
        gridGap: '15px',
      }}
    >
      <Select
        id="3"
        value={state['3']}
        onInput={onInput}
        placeholder="test"
        multiple
        // disabled
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          {
            value: '4',
            label: '4',
          },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          {
            value: '8',
            label: '8',
          },
          { value: '9', label: '9' },
          { value: '10', label: '10' },
          { value: '11', label: '11' },
          {
            value: '12',
            label: '12',
          },
          { value: '13', label: '13' },
          { value: '14', label: '14' },
          { value: '15', label: '15' },
        ]}
        valueKey="value"
        labelKey="label"
      />
      <AlwaysShowMultipleSelectedValuesSelect
        id="2"
        value={state['2']}
        onInput={onInput}
        placeholder="test"
        multiple
        // disabled
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          {
            value: '4',
            label: '4',
          },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          {
            value: '8',
            label: '8',
          },
          { value: '9', label: '9' },
          { value: '10', label: '10' },
          { value: '11', label: '11' },
          {
            value: '12',
            label: '12',
          },
          { value: '13', label: '13' },
          { value: '14', label: '14' },
          { value: '15', label: '15' },
        ]}
        valueKey="value"
        labelKey="label"
      />
      <Select
        id="1"
        value={state['1']}
        onInput={onInput}
        placeholder="test"
        // disabled
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          {
            value: '4',
            label: '4',
          },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          {
            value: '8',
            label: '8',
          },
          { value: '9', label: '9' },
          { value: '10', label: '10' },
          { value: '11', label: '11' },
          {
            value: '12',
            label: '12',
          },
          { value: '13', label: '13' },
          { value: '14', label: '14' },
          { value: '15', label: '15' },
        ]}
        valueKey="value"
        labelKey="label"
      />
      <AlwaysShowMultipleSelectedValuesSelect
        id="2"
        value={state['2']}
        onInput={onInput}
        placeholder="test"
        multiple
        disabled
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          {
            value: '4',
            label: '4',
          },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          {
            value: '8',
            label: '8',
          },
          { value: '9', label: '9' },
          { value: '10', label: '10' },
          { value: '11', label: '11' },
          {
            value: '12',
            label: '12',
          },
          { value: '13', label: '13' },
          { value: '14', label: '14' },
          { value: '15', label: '15' },
        ]}
        valueKey="value"
        labelKey="label"
      />

      <Select
        id="1"
        value={state['1']}
        onInput={onInput}
        placeholder="test"
        disabled
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          {
            value: '4',
            label: '4',
          },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          {
            value: '8',
            label: '8',
          },
          { value: '9', label: '9' },
          { value: '10', label: '10' },
          { value: '11', label: '11' },
          {
            value: '12',
            label: '12',
          },
          { value: '13', label: '13' },
          { value: '14', label: '14' },
          { value: '15', label: '15' },
        ]}
        valueKey="value"
        labelKey="label"
      />
      <Select
        id="2"
        value={state['2']}
        onInput={onInput}
        placeholder="test"
        disabled
        multiple
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          {
            value: '4',
            label: '4',
          },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          {
            value: '8',
            label: '8',
          },
          { value: '9', label: '9' },
          { value: '10', label: '10' },
          { value: '11', label: '11' },
          {
            value: '12',
            label: '12',
          },
          { value: '13', label: '13' },
          { value: '14', label: '14' },
          { value: '15', label: '15' },
        ]}
        valueKey="value"
        labelKey="label"
      />

      <Select
        id="1"
        value={state['1']}
        onInput={onInput}
        placeholder="test"
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          {
            value: '4',
            label: '4',
          },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          {
            value: '8',
            label: '8',
          },
          { value: '9', label: '9' },
          { value: '10', label: '10' },
          { value: '11', label: '11' },
          {
            value: '12',
            label: '12',
          },
          { value: '13', label: '13' },
          { value: '14', label: '14' },
          { value: '15', label: '15' },
        ]}
        valueKey="value"
        labelKey="label"
      />
      <Select
        id="2"
        value={state['2']}
        onInput={onInput}
        placeholder="test"
        multiple
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          {
            value: '4',
            label: '4',
          },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          {
            value: '8',
            label: '8',
          },
          { value: '9', label: '9' },
          { value: '10', label: '10' },
          { value: '11', label: '11' },
          {
            value: '12',
            label: '12',
          },
          { value: '13', label: '13' },
          { value: '14', label: '14' },
          { value: '15', label: '15' },
        ]}
        valueKey="value"
        labelKey="label"
      />
      <AlwaysShowMultipleSelectedValuesSelect
        id="2"
        value={state['2']}
        onInput={onInput}
        placeholder="test"
        multiple
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          {
            value: '4',
            label: '4',
          },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          {
            value: '8',
            label: '8',
          },
          { value: '9', label: '9' },
          { value: '10', label: '10' },
          { value: '11', label: '11' },
          {
            value: '12',
            label: '12',
          },
          { value: '13', label: '13' },
          { value: '14', label: '14' },
          { value: '15', label: '15' },
        ]}
        valueKey="value"
        labelKey="label"
      />
      <DatePicker
        id="datePicker"
        value={state['datePicker']}
        onInput={onInput}
      />
      <TextArea
        autosize
        id="textArea"
        value={state['textArea']}
        onInput={onInput}
        maxlength={1500}
      />

      <Input
        id="input"
        value={state['input']}
        onInput={onInput}
        maxlength={150}
      />

      <Input
        id="input"
        value={state['input']}
        onInput={onInput}
        maxlength={150}
      />
      <DatePicker
        id="datePicker"
        value={state['datePicker']}
        onInput={onInput}
      />
      <TextArea
        autosize
        id="textArea"
        value={state['textArea']}
        onInput={onInput}
        maxlength={1500}
      />

      <TextArea
        autosize
        id="textArea"
        value={state['textArea']}
        onInput={onInput}
        maxlength={1500}
      />
      <Input
        id="input"
        value={state['input']}
        onInput={onInput}
        maxlength={150}
      />
      <DatePicker
        id="datePicker"
        value={state['datePicker']}
        onInput={onInput}
      />
    </div>
  )
}

export default InputTest
