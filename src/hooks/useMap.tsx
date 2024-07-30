import { useState } from 'react'
import { Room } from '../assets/Room'
import { Coord, DirectionEnum, Grid, RoomNeighbor } from '../interfaces'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { Utils } from '../utils'
import { MapGenerator } from '../assets/MapGenerator'

const useMap = () => {
  const [_, copy] = useCopyToClipboard()

  const [rows, setRows] = useState(100)
  const [cols, setCols] = useState(100)

  const [rooms, setRooms] = useState<Array<Room>>([])
  const [grid, setGrid] = useState<Grid>(
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null),
    ),
  )

  const addRoom = (
    colIndex: number,
    rowIndex: number,
    cb?: (room: Room) => void,
  ) => {
    const currentGrid = [...grid]
    let currentRoom = currentGrid[colIndex][rowIndex]
    if (!currentRoom) {
      const newRoom = new Room(Room.getRoomId(colIndex, rowIndex))
      currentGrid[colIndex][rowIndex] = newRoom
      setRooms((rooms) => [...rooms, newRoom])
      setGrid(currentGrid)
      currentRoom = newRoom
    } else {
      cb && cb(currentRoom)
    }
  }

  const paintOver = (cellCoords: Coord[]) => {
    const { newRooms, newGrid } = Room.generateRoom(cellCoords, rooms, grid)
    setRooms(newRooms)
    setGrid(newGrid)
  }

  const setRoomToGrid = (roomData: Room[]) => {
    let maxRow = 0
    let maxCol = 0
    let rows = 100
    let cols = 100
    const rooms = roomData.map((x: any) => {
      const room = new Room(x.id, x.connects_to, x.state)
      const [colIndex, rowIndex] = room.getRoomIndex()
      if (colIndex > maxCol) {
        maxCol = colIndex
      }
      if (rowIndex > maxRow) {
        maxRow = rowIndex
      }
      return room
    })

    if (rows < maxRow) {
      rows = maxRow + 5 //map padding
    }
    if (cols < maxCol) {
      cols = maxCol + 5
    }
    const grid: Grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null),
    )

    for (const room of rooms) {
      const [colIndex, rowIndex] = room.getRoomIndex()
      grid[colIndex][rowIndex] = room
    }
    setRows(rows)
    setCols(cols)
    setRooms(rooms)
    setGrid(grid)
  }

  const fromJson = (json: string, onError?: (err: string) => void) => {
    reset()
    try {
      const roomData = JSON.parse(json)
      let error = ''
      if (!Array.isArray(roomData)) {
        error = 'Invalid JSON format'
      }
      setRoomToGrid(roomData)
      if (error && onError) {
        onError(error)
      }
    } catch (error) {
      if (onError) {
        onError('Invalid JSON format')
      }
    }
  }

  const toJson = () => {
    const string = JSON.stringify(rooms, null, 2)
    copy(string)
    return string
  }

  const findNeighborRooms = (room: Room): RoomNeighbor => {
    return room.findNeighbors(grid)
  }

  const _updateRoomsConnection = (
    room: Room,
    targetRooms: Room[],
    value: string,
    directions: DirectionEnum[],
  ) => {
    const tempGrid = [...grid]
    let tempRoom = [...rooms]
    const [colIndex, rowIndex] = room.getRoomIndex()
    for (let i = 0; i < targetRooms.length; i++) {
      const targetRoom = targetRooms[i]
      const direction = directions[i]
      const oppositeDir = Utils.getOppositeDirection(direction)
      if (value === 'connect') {
        room.connect(targetRoom, direction)
        targetRoom.connect(room, oppositeDir)
      } else {
        room.disconnect(targetRoom)
        targetRoom.disconnect(room)
      }
      const [targetColIndex, targetRowIndex] = targetRoom.getRoomIndex()
      tempGrid[targetColIndex][targetRowIndex] = targetRoom
      const targetRoomIndex = tempRoom.findIndex((x) => x.id === targetRoom.id)
      tempRoom[targetRoomIndex] = targetRoom
    }
    tempGrid[colIndex][rowIndex] = room
    const roomIndex = tempRoom.findIndex((x) => x.id === room.id)
    tempRoom[roomIndex] = room
    return { rooms: tempRoom, grid: tempGrid, roomIndex }
  }

  const updateRoomConnection = (
    room: Room,
    targetRoom: Room,
    value: string,
    direction: DirectionEnum,
    cb?: (room: Room) => void,
  ) => {
    const { rooms, grid } = _updateRoomsConnection(room, [targetRoom], value, [
      direction,
    ])
    setRooms(rooms)
    setGrid(grid)
    cb && cb(room)
  }

  const deleteRoom = (room: Room, cb?: () => void) => {
    const neighborCells = findNeighborRooms(room)
    const targetRooms: Room[] = []
    const directions: DirectionEnum[] = []
    Object.keys(neighborCells)
      .filter((x) => !!neighborCells[x as DirectionEnum])
      .map((x) => {
        targetRooms.push(neighborCells[x as DirectionEnum]!)
        directions.push(x as DirectionEnum)
      })

    const { rooms, grid, roomIndex } = _updateRoomsConnection(
      room,
      targetRooms,
      'disconnect',
      directions,
    )
    const [colIndex, rowIndex] = room.getRoomIndex()
    const finalRooms = rooms.filter((_, index) => index !== roomIndex)
    const finalGrid = [...grid]
    finalGrid[colIndex][rowIndex] = null
    setRooms(finalRooms)
    setGrid(finalGrid)
    cb && cb()
  }

  const reset = () => {
    setRows(100)
    setCols(100)
    setRooms([])
    setGrid(
      Array.from({ length: 100 }, () =>
        Array.from({ length: 100 }, () => null),
      ),
    )
  }

  const generateMap = (numberOfRoom: number) => {
    reset()
    const mapGenerator = new MapGenerator(numberOfRoom)
    const { rooms } = mapGenerator.generate()
    setRoomToGrid(rooms)
  }

  return {
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
  }
}

export default useMap
