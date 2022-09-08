import React, {useCallback, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {ApiContext} from "@/contants";
import ScrollBar from '@Components/Components/ScrollBar'
import Icon from '@Components/Components/Icon'
import {URL_DOCUMENT_CREATION_OPTIONS} from "@/ApiList";
import {CreateDocumentWindowContainer, DocumentIcon, DocumentTypesContainer} from "./style";
import RadioButton from '@/Components/Inputs/RadioButton'
import Button from "@/Components/Button";
import WithToggleNavigationItem from "../withToggleNavigationItem";
import angleIcon from "@/Icons/angleIcon";
import NavigationDocumentIcon from "../../icons/NavigationDocumentIcon";

const FirstLevelHeaderComponent = ({children, selected}) => <div className="flex items-start font-size-14 w-full">
  <DocumentIcon
    icon={NavigationDocumentIcon}
    size={22}
    selected={selected}
  />
  <div className="mt-0.5 w-full">{children}</div>
</div>

const DefaultHeaderComponent = ({children}) => <div className="font-size-12">{children}</div>

const CreateDocumentWindow = props => {
  const api = useContext(ApiContext)
  const [documents, setDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState({})

  useEffect(() => {
    (async () => {
      const {data: {children}} = await api.post(URL_DOCUMENT_CREATION_OPTIONS)
      setDocuments(children)
    })()
  }, [])

  const handleSelectDocument = useCallback((obj) => () => setSelectedDocument(obj), [])

  const renderDocumentItem = useCallback((HeaderComponent) => ({data, data: {name, id}, children}) => {
    const selected = selectedDocument.name === name
    return children.length > 0
      ? (
        <WithToggleNavigationItem id={id}>
          {({isDisplayed, toggleDisplayedFlag}) => (
            <HeaderComponent>
              <div className={`flex flex-col w-full ${isDisplayed ? "" : "mb-4"}`}>
                <button
                  type="button"
                  className="flex items-start w-full"
                  onClick={toggleDisplayedFlag}
                >
                  <span className="mr-auto">{name}</span>
                  <Icon icon={angleIcon} size={10} className={`${isDisplayed ? "" : "rotate-180"} mt-1`}/>
                </button>
                {isDisplayed &&
                  <div
                    className="flex flex-col mt-4 pl-4">{children.map(renderDocumentItem(DefaultHeaderComponent))}</div>}
              </div>
            </HeaderComponent>
          )}
        </WithToggleNavigationItem>
      )
      : (
        <HeaderComponent selected={selected}>
          <button
            type="button"
            className="mb-4 text-left"
            onClick={handleSelectDocument(data)}
          >
            <span className={selected ? "color-blue-1" : ""}>{name}</span>
          </button>
        </HeaderComponent>
      )
  }, [selectedDocument, handleSelectDocument])

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex overflow-hidden mb-6 h-full">
        <DocumentTypesContainer className="flex flex-col h-full flex-0">
          <ScrollBar className="pr-6">
            {documents.map(renderDocumentItem(FirstLevelHeaderComponent))}
          </ScrollBar>
        </DocumentTypesContainer>
        <div className="pl-6 w-full h-full">
          <h2 className="font-medium text-2xl color-blue-1 mb-4">Титул</h2>
          <div className="separator rounded-md mb-6">
            <h3 className="bg-light-gray px-4 py-3 font-medium font-size-14 ">Контент</h3>
            <div className="p-4">
              <RadioButton label="использовать шаблон контента"/>
              <RadioButton label="не использовать шаблон контента"/>
            </div>
          </div>
          <div className="separator rounded-md mb-6">
            <h3 className="bg-light-gray px-4 py-3 font-medium font-size-14 ">Атрибуты</h3>
            <div className="p-4">
              <div className="font-size-14 bg-light-gray rounded-md p-2">
                Наименование тома = О согласовании ТЗ
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <Button
          className="bg-light-gray flex items-center w-60 rounded-lg mr-4 justify-center"
        >
          Закрыть
        </Button>
        <Button
          className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center"
        >
          Создать
        </Button>
      </div>
    </div>
  );
};

CreateDocumentWindow.propTypes = {};

const CrateDocumentWrapper = (props) => (
  <CreateDocumentWindowContainer
    {...props}
    title="Создание нового документа"
  >
    <CreateDocumentWindow/>
  </CreateDocumentWindowContainer>
)

export default CrateDocumentWrapper;