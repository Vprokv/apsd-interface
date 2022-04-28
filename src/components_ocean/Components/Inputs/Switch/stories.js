import React from "react"

import Switch from "./index"

export default {
  title: "Components/Fields/Switch",
  component: Switch,
  argTypes: {
    value: {
      description: "Буллевское значение, строка, число",
    },
    style: {
      description: "пропс эквивалентый HTML аттрибуту",
    },
    className: {
      description: "пропс эквивалентый HTML аттрибуту",
    },
    id: {
      description: "id компонента"
    },
    fieldLabel: {
      description: "Лабель компонента"
    },
    appendix: {
      description: "Название кнопок свитча"
    },
    showInactivity: {
      description: "Показывает ошибку"
    },
    onInput: {
      description: "HTML свойство обработчик события"
    },
    stringOutput: {
      description: "Массив для чего то?"
    },
  }
}

const Template = (args) => (
  <div className="display-flex fd-column j-c-start">
    <div className="p-b-10"><Switch {...args} /></div>
    <div className="p-b-10"><Switch {...args} value="1" fieldLabel="Switch" /></div>
    <div className="p-b-10"><Switch
      {...args}
      value="1"
      fieldLabel="Switch"
      appendix={{
        on: "вкл",
        off: "выкл"
      }}
    />
    </div>
    <div className="p-b-10"><Switch {...args} showInactivity /></div>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  appendix: {
    on: "on",
    off: "off"
  },
  showInactivity: false,
  value: ""
}
