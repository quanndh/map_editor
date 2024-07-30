import React, { FC, useEffect, useRef, useState } from 'react'
import { Coord, type Grid } from '../../interfaces'
import MapRoom from '../MapRoom'
import { useLongPress } from '@uidotdev/usehooks'
import { Room } from '../../assets/Room'

interface Props {
  isPanning: boolean
  grid: Grid
  mode: 'edit' | 'view'
  selectedRoom: Room | undefined
  addRoom: (colIndex: number, rowIndex: number) => void
  paintOver: (cellCoords: Coord[]) => void
}

const Grid: FC<Props> = ({
  grid,
  isPanning = false,
  mode = 'view',
  selectedRoom,
  addRoom,
  paintOver,
}) => {
  const cellsIndex = useRef<number[][]>([])
  const [selecting, setSelecting] = useState(false)

  // TODO: resolve unpaint issue
  const handlePaintOver = (e: any) => {
    const target = e?.target
    if (!selecting || !target?.id) return
    const [colIndex, rowIndex] = Room.getRoomIndex(target.id)
    const tempCellsIndex = [...cellsIndex.current]
    cellsIndex.current = [...tempCellsIndex, [colIndex, rowIndex]]
    target.className += ' active bg-slate-400 scale-110 border'
  }

  const handleFinishPaintOver = (
    lastColIndex: number,
    lastRowIndex: number,
  ) => {
    const tempCellCoords: Coord[] = [
      ...cellsIndex.current,
      [lastColIndex, lastRowIndex],
    ]
    paintOver(tempCellCoords)
    setSelecting(false)
    cellsIndex.current = []
  }

  useEffect(() => {
    const cells = window.document.getElementsByClassName('cell')
    for (const cell of cells) {
      if (selecting) {
        cell.addEventListener('mouseover', handlePaintOver)
      } else {
        cell.removeEventListener('mouseover', handlePaintOver)
      }
    }

    return () => {
      for (const cell of cells) {
        cell.removeEventListener('mouseover', handlePaintOver)
      }
    }
  }, [selecting])

  const attrs = useLongPress(
    (e: any) => {
      if (isPanning || mode === 'view') return
      setSelecting(true)
      const [colIndex, rowIndex] = Room.getRoomIndex(e.target.id)
      cellsIndex.current = [[colIndex, rowIndex]]
      const el = window.document.getElementById(
        Room.getRoomId(colIndex, rowIndex),
      )
      if (el) {
        el.className += ' active bg-slate-400 scale-110 border border-white'
      }
    },
    {
      onFinish: (e: any) => {
        if (isPanning || mode === 'view') return
        const [colIndex, rowIndex] = Room.getRoomIndex(e.target.id)
        handleFinishPaintOver(colIndex, rowIndex)
      },
      threshold: 500,
    },
  )

  const handleClickOnCell = (colIndex: number, rowIndex: number) => {
    if (isPanning || mode === 'view') return
    addRoom(colIndex, rowIndex)
  }

  return (
    <div className="flex">
      {grid.map((col, colIndex) => (
        <div key={colIndex} className="mr-[2px]">
          {col.map((cell, rowIndex) => (
            <MapRoom
              key={Room.getRoomId(colIndex, rowIndex)}
              data={cell}
              colIndex={colIndex}
              rowIndex={rowIndex}
              isSelecting={false}
              isShowedInfo={
                Room.getRoomId(colIndex, rowIndex) === selectedRoom?.id
              }
              mode={mode}
              handleClickOnCell={handleClickOnCell}
              {...attrs}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Grid
