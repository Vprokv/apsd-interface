import React from 'react'

export const LoadContext = React.createContext({
  loadData: () => null,
})

export const TypeContext = React.createContext({
  type: '',
})

export const CanAddContext = React.createContext({
  canAdd: false,
})

export const PermitDisableContext = React.createContext({
  permit: false,
})

export const responseData = [
  {
    type: 'apsd_prepare',
    name: 'Подготовка',
    canAdd: false,
    stages: [
      {
        id: '0000000300039zav',
        globalId: '0000000300039zav',
        documentId: '0000000300039xog',
        index: 1,
        name: 'Подготовка тома к согласованию',
        iteration: 1,
        status: 'finished',
        stageType: 'apsd_prepare',
        term: 2,
        endDate: null,
        finishDate: '10.07.2023 18:19:37',
        creator: 'master',
        approvers: [
          //- передается как и раньше список согласующихся этапа
          {
            id: '0000000300039zaw', //- id записи согласующего
            parentId: null,
            creatorName: 'master',
            stageId: '0000000300039zav', //- id стадии к которой привязан
            documentId: '0000000300039xog',
            status: 'Согласовано', //- статус
            statusName: 'approved', //- статус системный
            approverName: 'Testov', //- логин согласующего
            approverId: '000000030002s6hc', //- id карточки сотрудника
            approverFio: 'Тестов Василий Иванович', //- фио
            approverPosition: 'Специалист по ПСД', //- должность
            approverDep: 'Тестовый отдел', //- отдел
            approverBranch: 'Тестовый филиал', // - филиал
            approverOrganization: 'ПАО «Россети Московский регион»', //- организация
            initDate: '10.07.2023 18:19:07', //- дата Рассылки
            dueDate: '13.07.2023 09:00:00', //- контрольная дата
            decisionDate: '10.07.2023 06:19:14',
            comment: null, //- коммент, может задаваться при рассылке например доп согласующим, что с ним делать и как выводить не видел
            additional: false, //- является ли согласующий доп согласющим
            reports: [], // - отчеты, теперь будет приходить сразу список распишу по блоку ниже
            permit: null,
            additionalStage: {
              //- доп согласующиеся теперь все в этом блоке
              approvers: [
                {
                  id: '0000000300039zaw', //- id записи согласующего
                  parentId: null,
                  creatorName: 'master',
                  stageId: '0000000300039zav', //- id стадии к которой привязан
                  documentId: '0000000300039xog',
                  status: 'Согласовано', //- статус
                  statusName: 'approved', //- статус системный
                  approverName: 'Testov', //- логин согласующего
                  approverId: '000000030002s6hc', //- id карточки сотрудника
                  approverFio: 'Тестов Василий Иванович', //- фио
                  approverPosition: 'Специалист по ПСД', //- должность
                  approverDep: 'Тестовый отдел', //- отдел
                  approverBranch: 'Тестовый филиал', // - филиал
                  approverOrganization: 'ПАО «Россети Московский регион»', //- организация
                  initDate: '10.07.2023 18:19:07', //- дата Рассылки
                  dueDate: '13.07.2023 09:00:00', //- контрольная дата
                  decisionDate: '10.07.2023 06:19:14',
                  comment: null, //- коммент, может задаваться при рассылке например доп согласующим, что с ним делать и как выводить не видел
                  additional: false, //- является ли согласующий доп согласющим
                  reports: [], // - отчеты, теперь будет приходить сразу список распишу по блоку ниже
                  permit: null,
                  additionalStage: {
                    //- доп согласующиеся теперь все в этом блоке
                    approvers: [],
                    permit: {
                      delete: false,
                      addApprover: false,
                    },
                  },
                },
              ],
              permit: {
                delete: false,
                addApprover: false,
              },
            },
          },
        ],
        reworkInfo: null, //- информация о доработке
        editable: false,
        deletable: false,
      },
    ],
  },
  {
    type: 'apsd_approve',
    name: 'Согласование',
    canAdd: true,
    stages: [
      {
        id: '000000030003a084',
        globalId: '000000030003a084',
        documentId: '0000000300039xog',
        index: 1,
        name: 'Тестов',
        iteration: 4,
        status: 'on_work',
        stageType: 'apsd_approve',
        term: 3,
        endDate: null,
        finishDate: null,
        creator: 'Testov',
        approvers: [
          {
            id: '000000030003a085',
            parentId: null,
            creatorName: 'Testov',
            stageId: '000000030003a084',
            documentId: '0000000300039xog',
            status: 'Принято к исполнению',
            statusName: 'acquired',
            approverName: 'Testov',
            approverId: '000000030002s6hc',
            approverFio: 'Тестов Василий Иванович',
            approverPosition: 'Специалист по ПСД',
            approverDep: 'Тестовый отдел',
            approverBranch: 'Тестовый филиал',
            approverOrganization: 'ПАО «Россети Московский регион»',
            initDate: '10.07.2023 18:19:38',
            dueDate: '14.07.2023 09:00:00',
            decisionDate: '17.07.2023 01:51:37',
            comment: null,
            additional: false,
            reports: [],
            permit: null,
            additionalStage: {
              permit: {
                delete: true,
                addApprover: true,
              },
              approvers: [
                {
                  id: '000000030003wqtk',
                  parentId: '000000030003a085',
                  creatorName: 'master',
                  stageId: '000000030003a084',
                  documentId: '0000000300039xog',
                  status: 'Принято к исполнению',
                  statusName: 'acquired',
                  approverName: 'Boss11',
                  approverId: '000000030002s7ag',
                  approverFio: 'Босс11 Б Б',
                  approverPosition: 'Ведущий специалист',
                  approverDep: 'Департамент 1',
                  approverBranch: 'Тестовый филиал',
                  approverOrganization: 'ПАО «Россети Московский регион»',
                  initDate: '27.07.2023 14:01:17',
                  dueDate: '28.07.2023 14:01:17',
                  decisionDate: '01.08.2023 01:44:15',
                  comment: null,
                  additional: true,
                  reports: [],
                  permit: {
                    revoke: true,
                    send: false,
                    deleteApprover: true,
                  },
                  additionalStage: {
                    permit: {
                      delete: false,
                      addApprover: false,
                    },
                    approvers: [
                      {
                        id: '0000000300040qsw',
                        parentId: '000000030003wqtk',
                        creatorName: 'master',
                        stageId: '000000030003a084',
                        documentId: '0000000300039xog',
                        status: 'Простаивает',
                        statusName: 'stand_idle',
                        approverName: 'Boss22',
                        approverId: '000000030002s7am',
                        approverFio: 'Босс22 Б Б',
                        approverPosition: 'Ведущий специалист',
                        approverDep: 'Департамент 2',
                        approverBranch: 'Тестовый филиал',
                        approverOrganization: 'ПАО «Россети Московский регион»',
                        initDate: '01.08.2023 13:44:24',
                        dueDate: '02.08.2023 13:44:24',
                        decisionDate: '01.08.2023 13:44:24',
                        comment: 'dd',
                        additional: true,
                        reports: [],
                        permit: {
                          revoke: true,
                          send: false,
                          deleteApprover: false,
                        },
                        additionalStage: {
                          approvers: [],
                        },
                      },
                    ],
                  },
                },
                {
                  id: '000000030003x15s',
                  parentId: '000000030003a085',
                  creatorName: 'master',
                  stageId: '000000030003a084',
                  documentId: '0000000300039xog',
                  status: 'Простаивает',
                  statusName: 'stand_idle',
                  approverName: 'Boss12',
                  approverId: '000000030002s7ai',
                  approverFio: 'Босс12 Б Б',
                  approverPosition: 'Ведущий специалист',
                  approverDep: 'Департамент 1',
                  approverBranch: 'Тестовый филиал',
                  approverOrganization: 'ПАО «Россети Московский регион»',
                  initDate: '27.07.2023 19:47:54',
                  dueDate: '31.07.2023 09:00:00',
                  decisionDate: '27.07.2023 19:47:54',
                  comment: 'kk',
                  additional: true,
                  reports: [],
                  permit: {
                    revoke: true,
                    send: false,
                    deleteApprover: true,
                  },
                  additionalStage: {
                    approvers: [],
                    permit: {
                      delete: false,
                      addApprover: false,
                    },
                  },
                },
              ],
            },
          },
        ],
        reworkInfo: null,
        editable: true,
        deletable: true,
      },
    ],
  },
]
