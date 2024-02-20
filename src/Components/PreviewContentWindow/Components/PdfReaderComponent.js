import React from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import ru_RU from '@react-pdf-viewer/locales/lib/ru_RU.json'

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
              <div className="" style={{ padding: '0px 2px' }}>
                <ShowSearchPopover />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <ZoomOut />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <Zoom />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <ZoomIn />
              </div>
              <div className="flex items-center ml-auto">
                <div style={{ padding: '0px 2px' }}>
                  <GoToPreviousPage />
                </div>
                <CurrentPageInput />
                <div className="bg-secondary py-2 h-full px-2">
                  /
                  <NumberOfPages />
                </div>
                <div style={{ padding: '0px 2px' }}>
                  <GoToNextPage />
                </div>
              </div>

              <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                <EnterFullScreen />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <Print />
              </div>
              <div style={{ padding: '0px 2px' }}>
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
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
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
