import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import {FilterForm, SearchInput} from "../../styles";
import Switch from "../../../../../Components/Inputs/Switch";
import Select from "../../../../../Components/Inputs/Select";
import Icon from '@Components/Components/Icon'
import searchIcon from "@/Icons/searchIcon"
import {ApiContext} from "../../../../../contants";
import {URL_ENTITY_LIST} from "../../../../../ApiList";
import {DOCUMENT_TYPE, TASK_TYPE} from "../../constants";

const getFilterFormConfig=(catalogs)=>{
    return [
        {
            id: "1",
            component: Switch,
            label: "Непросмотренные"
        },
        {
            id: "2",
            component: Select,
            placeholder: "Тип задания",
            options: catalogs[TASK_TYPE]
        },
        {
            id: "3",
            component: Select,
            placeholder: "Вид тома",
            options: catalogs[DOCUMENT_TYPE]
        },
        {
            id: "4",
            component: Select,
            placeholder: "Этап",
            options: [
                {
                    ID: "ASD",
                    SYS_NAME: "TT"
                },
                {
                    ID: "ASD1",
                    SYS_NAME: "TT2"
                },
            ]
        },
        {
            id: "5",
            component: Select,
            placeholder: "Статус",
            options: [
                {
                    ID: "ASD",
                    SYS_NAME: "TT"
                },
                {
                    ID: "ASD1",
                    SYS_NAME: "TT2"
                },
            ]
        },
        {
            id: "6",
            component: SearchInput,
            placeholder: "Поиск",
            children: <Icon icon={searchIcon} size={10} className="color-text-secondary mr-2.5"/>
        }
    ]
}

const emptyWrapper = (({children}) => children)

function Filter({value, onInput}) {
    console.log(value, 'value')
    const api = useContext(ApiContext)
    const [catalogs, setCatalogs] = useState({})

    useEffect(async()=>{
        const [{data: entityData}, {data: documentData}] = await Promise.all([
            api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`),
            api.post(`${URL_ENTITY_LIST}/${DOCUMENT_TYPE}`)
        ])
        setCatalogs({
            [TASK_TYPE]: entityData.map(({dss_name})=>{
            return {
                ID: `${dss_name}`,
                SYS_NAME: dss_name
            }
            }),
            [DOCUMENT_TYPE]: documentData.map(({dss_type_name, dss_type_label})=>{
                return {
                    ID: `${dss_type_name}`,
                    SYS_NAME: dss_type_label
                }
            })
        })
    }, [])

    return <FilterForm
        fields={getFilterFormConfig(catalogs)}
        inputWrapper={emptyWrapper}
        value={value}
        onInput={onInput}
    >
    </FilterForm>
}

Filter.propTypes = {}

export default Filter