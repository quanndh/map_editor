import React, { FC, useState } from 'react'
import Drawer from 'react-modern-drawer'
import Button from '../Button'

interface Props {
  open: boolean
  onImport: (value: string) => void
  onClose: () => void
}

const ImportDataModal: FC<Props> = ({ open, onImport, onClose }) => {
  const [value, setValue] = useState('')

  const handleImport = () => {
    onImport(value)
    handleClose()
  }

  const handleClose = () => {
    setValue('')
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      direction="right"
      style={{ width: '25rem' }}>
      <div className="p-4 w-full space-y-4">
        <div className="font-semibold text-lg">Import data</div>
        <textarea
          value={value}
          className="w-full border p-2 rounded-sm"
          rows={20}
          placeholder="Input import data"
          onChange={(e) => {
            setValue(e.target.value)
          }}
        />
        <Button onClick={handleImport}>Import</Button>
      </div>
    </Drawer>
  )
}

export default ImportDataModal
