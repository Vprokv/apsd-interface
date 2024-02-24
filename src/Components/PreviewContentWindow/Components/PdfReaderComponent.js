import React from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import ru_RU from '@react-pdf-viewer/locales/lib/ru_RU.json'

import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

GlobalWorkerOptions.workerSrc = pdfjsWorker

const PdfReaderComponent = ({ url }) => {
  const renderToolbar = (Toolbar) => {
    return (
      <Toolbar>
        {(slots) => {
          const {
            CurrentPageInput,
            EnterFullScreen,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            Print,
            ShowSearchPopover,
            Zoom,
            ZoomIn,
            ZoomOut,
            SwitchTheme,
          } = slots
          return (
            <div className="flex items-center w-full">
              <div className="py-2">
                <ShowSearchPopover />
              </div>
              <div className="py-2">
                <ZoomOut />
              </div>
              <div className="py-2">
                <Zoom />
              </div>
              <div className="py-2">
                <ZoomIn />
              </div>
              <div className="flex items-center ml-auto">
                <div className="py-2">
                  <GoToPreviousPage />
                </div>
                <CurrentPageInput />
                <div className="bg-secondary py-2 h-full px-2 rounded-sm">
                  /
                  <NumberOfPages />
                </div>
                <div className="py-2">
                  <GoToNextPage />
                </div>
              </div>

              <div className="ml-auto py-2">
                <EnterFullScreen />
              </div>
              <div className="py-2">
                <Print />
              </div>
              <div className="py-2">
                <SwitchTheme />
              </div>
            </div>
          )
        }}
      </Toolbar>
    )
  }

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
  })

  return (
    <Worker>
      <Viewer
        fileUrl={url}
        plugins={[defaultLayoutPluginInstance]}
        localization={ru_RU}
        theme="dark"
      />
    </Worker>
  )
}

export default PdfReaderComponent
