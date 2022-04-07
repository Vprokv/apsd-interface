import React, {useCallback, useState} from 'react'
import PropTypes from 'prop-types'
import {WithWithValidationForm} from '@Components/Components/Forms'
import Input from '@/Components/Fields/Input'
import DefaultWrapper from "@/Components/Fields/DefaultWrapper";
import Button from "@/Components/Button";
import {VALIDATION_RULE_REQUIRED, VALIDATION_RULE_SAME} from "@Components/Logic/Validator/constants";
import {Link} from "react-router-dom";
import LoginTemplate from "../Login/LoginTemplate";

import {LOGIN_PAGE_PATH} from "../../routePaths";

export const fieldMap = [
  {
    label: "Логин",
    id: "login",
    component: Input,
    placeholder: "Введите свой логин"
  },
  {
    label: "Пароль",
    id: "password",
    type: "password",
    component: Input,
    placeholder: "Введите свой пароль"
  },
  {
    label: "Подтверждение",
    id: "confirmation_password",
    type: "password",
    component: Input,
    placeholder: "Подтвердите пароль"
  }
]

const rules = {
  login: [{name: VALIDATION_RULE_REQUIRED}],
  password: [
    {name: VALIDATION_RULE_REQUIRED},
    { name: VALIDATION_RULE_SAME, args: { fieldKey: "confirmation_password", fieldKeyLabel: "пароль" } }
  ],
  confirmation_password: [
    {name: VALIDATION_RULE_REQUIRED},
    { name: VALIDATION_RULE_SAME, args: { fieldKey: "password", fieldKeyLabel: "пароль"}}
  ],
}


function Login() {
  const [state, setState] = useState({})

  const handleSubmit = useCallback(() => {

  }, [])

  return (
    <LoginTemplate backgroundUrlPath="./d67acfda04fca2473676bbd7ef137b44.png">
      <WithWithValidationForm
        className="mb-4"
        value={state}
        onInput={setState}
        fields={fieldMap}
        inputWrapper={DefaultWrapper}
        rules={rules}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col pt-9">
          <Button
            className="bg-blue-1 text-white mb-2"
            type="submit"
          >
            Вход
          </Button>
          <Link
            className="w-full"
            to={LOGIN_PAGE_PATH}
          >
            <Button
              className="bg-light-gray w-full"
            >
              Отмена
            </Button>
          </Link>
        </div>
      </WithWithValidationForm>
    </LoginTemplate>
  )
}

Login.propTypes = {}

export default Login
