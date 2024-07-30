import { FC, useEffect, useMemo, useRef, useState } from 'react'
import React from 'react'
import Grid from '../Grid'
import {
  TransformWrapper,
  TransformComponent,
  MiniMap,
} from 'react-zoom-pan-pinch'
import useHoldKey from '../../hooks/useHoldKey'
import test from '../../assets/Map/test.json'
import useMap from '../../hooks/useMap'

import { Room } from '../../assets/Room'
import { DirectionEnum, RoomNeighbor } from '../../interfaces'
import ToolPanel from '../ToolPanel'
import RoomDetailModel from '../RoomDetailModal'
import ImportDataModal from '../ImportDataModal'
import GenerateModal from '../GenerateModal'

interface Props {}

const EditorScreen: FC<Props> = () => {
  const { isHolding } = useHoldKey('Shift')

  const {
    grid,
    fromJson,
    toJson,
    addRoom,
    paintOver,
    findNeighborRooms,
    updateRoomConnection,
    deleteRoom,
    reset,
    generateMap,
  } = useMap()

  const [selectedRoom, setSelectedRoom] = useState<Room>()
  const [openImport, setOpenImport] = useState(false)
  const [openGenerate, setOpenGenerate] = useState(false)

  const mainTransformRef = useRef<any>()

  const handleAddRoom = (colIndex: number, rowIndex: number) => {
    addRoom(colIndex, rowIndex, (room) => {
      setSelectedRoom(room)
    })
  }

  const handleCloseRoomDetail = () => {
    setSelectedRoom(undefined)
  }

  const selectedRoomNeighbors = useMemo(() => {
    if (!selectedRoom) return {} as RoomNeighbor
    return findNeighborRooms(selectedRoom)
  }, [selectedRoom, grid])

  const selectedRoomConnection = useMemo(() => {
    if (!selectedRoom) return []
    return Object.keys(selectedRoom.connects_to)
  }, [selectedRoom?.connects_to])

  const handleChangeRoomConnection = (
    room: Room,
    targetRoom: Room,
    value: string,
    dir: DirectionEnum,
  ) => {
    updateRoomConnection(room, targetRoom, value, dir, (room) =>
      setSelectedRoom(room),
    )
  }

  const handleDeleteRoom = (room: Room) => {
    deleteRoom(selectedRoom!, () => setSelectedRoom(undefined))
  }

  const handleImport = (json: string) => {
    fromJson(json)
  }

  const handleGenerate = (numberOfRoom: number) => {
    generateMap(numberOfRoom)
  }

  return (
    <>
      <div className="bg-zinc-500 overflow-hidden w-full h-[93vh] relative">
        <RoomDetailModel
          open={!!selectedRoom}
          selectedRoom={selectedRoom}
          selectedRoomConnection={selectedRoomConnection}
          selectedRoomNeighbors={selectedRoomNeighbors}
          onChangeRoomConnection={handleChangeRoomConnection}
          onDeleteRoom={handleDeleteRoom}
          onClose={handleCloseRoomDetail}
        />
        <ImportDataModal
          open={openImport}
          onImport={handleImport}
          onClose={() => setOpenImport(false)}
        />
        <GenerateModal
          open={openGenerate}
          onGenerate={handleGenerate}
          onClose={() => setOpenGenerate(false)}
        />
        <TransformWrapper
          ref={mainTransformRef}
          initialScale={2}
          minScale={0.1}
          maxScale={4}
          disabled={!isHolding}
          wheel={{
            disabled: false,
          }}>
          <div className="absolute top-2 right-2">
            <MiniMap width={200} height={200}>
              <Grid
                mode="view"
                grid={grid}
                isPanning={false}
                addRoom={handleAddRoom}
                paintOver={paintOver}
                selectedRoom={selectedRoom}
              />
            </MiniMap>
          </div>
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}>
            <Grid
              mode="edit"
              grid={grid}
              isPanning={isHolding}
              addRoom={handleAddRoom}
              paintOver={paintOver}
              selectedRoom={selectedRoom}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
      <ToolPanel
        onGenerate={() => setOpenGenerate(true)}
        onImport={() => setOpenImport(true)}
        onExport={toJson}
        onReset={reset}
      />
    </>
  )
}

export default EditorScreen
