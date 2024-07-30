import React, { FC, useState } from 'react'
import Drawer from 'react-modern-drawer'
import Button from '../Button'

interface Props {
  open: boolean
  onGenerate: (value: number) => void
  onClose: () => void
}

const GenerateModal: FC<Props> = ({ open, onGenerate, onClose }) => {
  const [value, setValue] = useState('')

  const handleGenerate = () => {
    onGenerate(Number(value))
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
        <div className="font-semibold text-lg">Generate map</div>
        <input
          value={value}
          className="w-full border p-2 rounded-sm"
          placeholder="Input number of room"
          onChange={(e) => {
            setValue(e.target.value)
          }}
        />
        <Button onClick={handleGenerate}>Generate</Button>
      </div>
    </Drawer>
  )
}

export default GenerateModal
