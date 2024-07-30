import React, { FC, useMemo } from 'react'
import classNames from 'classnames'
import { BaseRoomStyle, RoomActiveStyle } from '../../utils/style'
import { Room } from '../../assets/Room'
import { twMerge } from 'tailwind-merge'

interface Props {
  data: Room | null
  colIndex: number
  rowIndex: number
  isSelecting: boolean
  mode: 'edit' | 'view'
  isShowedInfo: boolean
  handleClickOnCell: (colIndex: number, rowIndex: number) => void

  //longpress event
  onMouseDown: (e: React.MouseEvent) => void
  onMouseUp: (e: React.MouseEvent) => void
  onMouseLeave: (e: React.MouseEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
}

const MapRoom: FC<Props> = ({
  data,
  colIndex,
  rowIndex,
  isSelecting = false,
  mode,
  isShowedInfo,
  handleClickOnCell,
  onMouseLeave,
  ...rest
}) => {
  const directions = useMemo(() => {
    return Object.values(data?.connects_to ?? {})
  }, [data?.connects_to])

  return (
    <div
      id={`${Room.getRoomId(colIndex, rowIndex)}${
        mode === 'view' ? 'view' : ''
      }`}
      onClick={() => handleClickOnCell(colIndex, rowIndex)}
      className={twMerge(
        classNames(BaseRoomStyle, {
          [RoomActiveStyle]: !!data,
          [directions.join(' ')]: directions.length,
          'bg-slate-400 scale-110': isSelecting,
          'w-20 h-20': mode === 'view',
          'bg-black': mode === 'view' && !!data,
          'bg-teal-400': isShowedInfo,
        }),
      )}
      {...rest}></div>
  )
}

export default MapRoom
