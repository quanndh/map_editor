import React, { FC } from 'react'
import Button from '../Button'

interface Props {
  onGenerate: () => void
  onImport: () => void
  onExport: () => void
  onReset: () => void
}

const ToolPanel: FC<Props> = ({ onGenerate, onImport, onExport, onReset }) => {
  return (
    <div className="w-full h-[7vh] bg-gray-800 p-4 flex items-center space-x-4">
      <Button
        onClick={() => {
          onExport()
          alert('Exported data saved to clipboard')
        }}>
        Export
      </Button>
      <Button onClick={onImport}>Import</Button>
      <Button onClick={onGenerate}>Generate</Button>
      <Button onClick={onReset}>Reset</Button>
    </div>
  )
}

export default ToolPanel
