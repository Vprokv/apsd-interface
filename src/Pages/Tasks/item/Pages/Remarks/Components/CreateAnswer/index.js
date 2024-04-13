import { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { SecondaryBlueButton } from '@/Components/Button'
import { ApiContext, TASK_ITEM_REMARKS } from '@/contants'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { FilterForm } from './styles'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { AutoLoadableSelect } from '@/Components/Inputs/Select'
import LinkNdt from '@/Pages/Tasks/item/Pages/Remarks/Components/LinkNdt'
import { URL_ENTITY_LIST, URL_REMARK_ANSWER } from '@/ApiList'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { CustomInput } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark/styles'
import {
  VALIDATION_RULE_MAX,
  VALIDATION_RULE_REQUIRED,
} from '@Components/Logic/Validator/constants'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import UserSelect from '@/Components/Inputs/UserSelect'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import { returnChildren } from '@Components/Components/Forms'
import { NdtLinkWrapper } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark'
import { setUnFetchedState, useTabItem } from '@Components/Logic/Tab'
import RemarkWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/RemarkWrapper'
import { Validation } from '@Components/Logic/Validator'
import { remarkValidator } from '@/Pages/Tasks/item/Pages/Remarks/constans'
import ScrollBar from '@Components/Components/ScrollBar'

const rules = {
  solutionId: [{ name: VALIDATION_RULE_REQUIRED }],
  text: [
    {
      name: VALIDATION_RULE_MAX,
      args: {
        max: 2048,
        text: 'Превышено допустимое количество символов для ответа замечания ',
      },
    },
    { name: VALIDATION_RULE_REQUIRED },
  ],
  member: [{ name: VALIDATION_RULE_REQUIRED }],
  // 'ndtLinks.*.id': [{ name: VALIDATION_RULE_REQUIRED }],
  // 'ndtLinks.*.comment': [{ name: VALIDATION_RULE_REQUIRED }],
  // ndtLinks: [{ name: VALIDATION_RULE_REQUIRED }],
}

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Ответ на замечание добавлен успешно',
    }
  },
}

const CreateAnswer = ({
  permits: { editAuthor } = {},
  setSelected,
  ...filter
}) => {
  const { member, remarkId } = filter
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const getNotification = useOpenNotification()
  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })

  const fields = useMemo(
    () => [
      {
        id: 'remarkText',
        component: CustomInput,
        placeholder: 'Введите текст замечания',
        label: 'Текст замечания',
        disabled: true,
      },
      {
        id: 'member',
        label: 'Автор',
        disabled: !editAuthor,
        returnOption: true,
        returnObjects: true,
        component: UserSelect,
      },
      {
        id: 'solutionId',
        component: AutoLoadableSelect,
        placeholder: 'Выберите тип',
        isRequired: false,
        label: 'Решение',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_status_solution',
            query,
          })
          return data
        },
      },
      {
        id: 'text',
        label: 'Текст ответа',
        isRequired: true,
        inputWrapper: RemarkWrapper,
        className: '',
        component: CustomInput,
        max: 100,
        placeholder: 'Введите текст ответа',
      },
      {
        id: 'ndtLinks',
        label: 'Ссылка нa НТД',
        component: LinkNdt,
        placeholder: 'Выберите значение',
        inputWrapper: returnChildren,
        InputUiContext: NdtLinkWrapper,
      },
    ],
    [api, editAuthor],
  )

  const onClose = useCallback(() => {
    setSelected()
  }, [setSelected])

  const onSave = useCallback(async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { remarkText, ndtLinks, member, ...other } = filter
      const { status } = await api.post(URL_REMARK_ANSWER, {
        documentId: id,
        memberId: member.emplId,
        memberName: member.userName,
        ndtLinks: ndtLinks && ndtLinks.map((val) => ({ ...val, id: null })),
        remarkId,
        ...other,
      })
      getNotification(customMessagesFuncMap[status]())
      setTabState(setUnFetchedState())
      setSelected(undefined)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [filter, api, id, remarkId, getNotification, setTabState, setSelected])

  return (
    <div>
      <StandardSizeModalWindow
        title="Добавить ответ на замечание"
        open={member}
        onClose={() => setSelected()}
      >
        <div className="flex flex-col overflow-hidden h-full">
          <div className="flex flex-col py-4 h-full grow">
            <ScrollBar>
              <Validation
                fields={fields}
                value={filter}
                onInput={setSelected}
                rules={rules}
                onSubmit={onSave}
                validators={remarkValidator}
              >
                {(validationProps) => {
                  return (
                    <>
                      <FilterForm
                        className="form-element-sizes-40"
                        inputWrapper={InputWrapper}
                        {...validationProps}
                      />
                      <div className="mt-10">
                        <SecondaryBlueButton className="ml-4 form-element-sizes-32 w-64 mb-2">
                          Скачать шаблон таблицы
                        </SecondaryBlueButton>
                        <div className="flex items-center">
                          <SecondaryBlueButton className="ml-4 form-element-sizes-32 w-48 mr-auto">
                            Импорт значений
                          </SecondaryBlueButton>
                          <UnderButtons
                            disabled={!validationProps.formValid}
                            leftFunc={onClose}
                            rightFunc={validationProps.onSubmit}
                          />
                        </div>
                      </div>
                    </>
                  )
                }}
              </Validation>
            </ScrollBar>
          </div>
        </div>
      </StandardSizeModalWindow>
    </div>
  )
}

CreateAnswer.propTypes = {
  remarkText: PropTypes.string,
  remarkId: PropTypes.string,
  permits: PropTypes.object,
}

export default CreateAnswer
