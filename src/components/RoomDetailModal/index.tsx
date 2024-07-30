import React, { FC } from 'react'
import { Room } from '../../assets/Room'
import { DirectionEnum, RoomNeighbor } from '../../interfaces'
import Drawer from 'react-modern-drawer'
import Button from '../Button'

interface Props {
  open: boolean
  selectedRoom: Room | undefined
  selectedRoomNeighbors: RoomNeighbor
  selectedRoomConnection: string[]
  onChangeRoomConnection: (
    room: Room,
    targetRoom: Room,
    value: string,
    dir: DirectionEnum,
  ) => void
  onDeleteRoom: (room: Room) => void
  onClose: () => void
}

const RoomDetailModel: FC<Props> = ({
  open,
  selectedRoom,
  selectedRoomNeighbors,
  selectedRoomConnection,
  onChangeRoomConnection,
  onDeleteRoom,
  onClose,
}) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      direction="right"
      style={{ width: '25rem' }}>
      <div className="p-4 w-full space-y-4">
        <div className="text-lg font-semibold">Room: {selectedRoom?.id}</div>
        <div className="text-lg font-semibold">Neighbor rooms</div>
        {Object.keys(selectedRoomNeighbors).map((x: string, index) => {
          const room = selectedRoomNeighbors[x as DirectionEnum]
          if (!room) return null
          return (
            <div className="flex w-full space-x-4" key={index}>
              <div className="capitalize font-semibold">{x}</div>
              <div className="capitalize">{room.id}</div>
              <select
                onChange={(e) => {
                  onChangeRoomConnection(
                    selectedRoom!,
                    room,
                    e.target.value,
                    x as DirectionEnum,
                  )
                }}
                value={
                  selectedRoomConnection.includes(room.id)
                    ? 'connect'
                    : 'disconnect'
                }>
                <option value="connect">Connected</option>
                <option value="disconnect">Disconnected</option>
              </select>
            </div>
          )
        })}
        <Button danger onClick={() => onDeleteRoom(selectedRoom!)}>
          Delete room
        </Button>
      </div>
    </Drawer>
  )
}

export default RoomDetailModel
