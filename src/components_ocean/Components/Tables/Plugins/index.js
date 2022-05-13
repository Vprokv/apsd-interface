import selectPlugin from './selectable'
import compose from 'lodash/fp/compose'
import {useMemo} from "react";

const pluginDictionary = {
  selectPlugin
}

export const ApplyPlugins = (Components) => {
  const TableWithPlugins = ({ settings, ...props}) => {
    const Comp = useMemo(() => {
      const plugins = []
      for (const pluginKey in pluginDictionary) {
        if (settings[pluginKey]) {
          plugins.push(pluginDictionary[pluginKey])
        }
      }
      return compose(...plugins)(Components)
    }, [settings])
    return <Comp {...props} settings={settings}/>
  }

  return TableWithPlugins
}

export default ApplyPlugins