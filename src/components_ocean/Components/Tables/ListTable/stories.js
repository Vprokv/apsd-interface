import React from "react"
import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks"
import Switch from "@/Components/Fields/Switch"
import ListTable from "./index"

export default {
  title: "Components/ListTable",
  component: ListTable,
  argTypes: {
    value: {
      description: ""
    },
    columns: {
      description: "Конфиг колонок таблицы"
    },
    subTable: {
      description: "Уровень наследования строк"
    },
    snapshot: {
      description: "Изначальное значение таблицы"
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <div>
            <h3>Настройки таблицы - props settings</h3>
            <div className="p-b-20">
              <h4 className="m-b-10">columns: массив настроек колонок</h4>
              <p className="m-l-10">
                <div>label - Лабель колонки.</div>
                <div>id - id колонки.</div>
                <div>props - Пропсы компонента колонки.</div>
                <div>keepNestingPadding - Отступ слева, зависит от уровня наследования.</div>
                <div>sizes - Ширина колонки.</div>
                <div>component - Компоннент ячейки.</div>
                <div>filter - Фильтр колонки.</div>
                <div>collapsibleGroup - Конфиг сворачивания колонок.</div>
              </p>
            </div>
          </div>
          <Stories />
        </>
      ),
    }
  }
}

const Template = (args) => <ListTable {...args} />

export const Default = Template.bind({})
Default.args = {
  settings: {
    columns: [
      {
        id: "NAME",
        label: "NAME",
        filter: true,
        keepNestingPadding: true,
        sizes: "380px",
      },
      {
        id: "LOGIN",
        collapsibleGroup: ["GRANT_TYPE", "STATUS"],
        label: "LOGIN",
        keepNestingPadding: true,
        sizes: "189px"
      },
      {
        id: "GRANT_TYPE",
        label: "GRANT TYPE",
        keepNestingPadding: true,
        sizes: "315px"
      },
      {
        id: "STATUS",
        label: "STATUS",
        props: {
          renderIcon: false,
          appendix: {
            on: "Active",
            off: "Inactive"
          }
        },
        collapsibleGroup: ["GRANT_TYPE", "STATUS"],
        keepNestingPadding: true,
        component: Switch,
        sizes: "175px"
      },
      {
        id: "DATE_CREATED",
        label: "DATE CREATED",
        keepNestingPadding: true,
        sizes: "200px"
      },
      {
        id: "DATE_MODIFY",
        label: "DATE MODIFY",
        keepNestingPadding: true,
        sizes: "200px"
      },
    ]
  },
  value: [{
    ID: 1,
    NAME: "Example 1",
    LOGIN: "publicis@gmail.com",
    GRANT_TYPE: "password",
    STATUS: 1,
    LIFE_TIME: 86123,
    DATE_CREATED: "24.09.20",
    DATE_MODIFY: "04.04.21",
    SYSTEM_ERROR: "",
  },
  {
    ID: 2,
    NAME: "Example 2",
    LOGIN: "publicis@gmail.com",
    GRANT_TYPE: "password",
    STATUS: 1,
    LIFE_TIME: 53529,
    DATE_CREATED: "24.09.20",
    DATE_MODIFY: "04.04.21",
    SYSTEM_ERROR: "",
  }
  ]
}
