import { DirectionEnum, Coord, Grid, RoomStateEnum } from '../../interfaces'

export class Room {
  public id: string
  public connects_to: Record<string, DirectionEnum>
  public state: RoomStateEnum

  constructor()
  constructor(id: string)
  constructor(id: string, connects_to: Record<string, DirectionEnum>)
  constructor(
    id: string,
    connects_to: Record<string, DirectionEnum>,
    state: RoomStateEnum,
  )

  constructor(...args: any[]) {
    if (args.length === 1) {
      this.id = args[0]
      this.connects_to = {}
      this.state = RoomStateEnum.unlocked
    } else if (args.length === 2) {
      this.id = args[0]
      this.connects_to = args[1]
      this.state = RoomStateEnum.unlocked
    } else if (args.length === 3) {
      this.id = args[0]
      this.connects_to = args[1]
      this.state = args[2]
    } else {
      this.id = ''
      this.connects_to = {}
      this.state = RoomStateEnum.unlocked
    }
  }

  connect = (room: Room, direction: DirectionEnum) => {
    if (this.connects_to[room.id]) return
    this.connects_to = {
      ...this.connects_to,
      [room.id]: direction,
    }
  }

  disconnect = (room: Room) => {
    if (!this.connects_to[room.id]) return
    const temp = { ...this.connects_to }
    delete temp[room.id]
    this.connects_to = temp
  }

  getRoomIndex = (): number[] =>
    this.id.split('-').map((x: string) => Number(x))

  findNeighbors = (grid: Grid) => {
    const [colIndex, rowIndex] = this.getRoomIndex()
    return {
      [DirectionEnum.north]:
        colIndex < grid.length ? grid[colIndex][rowIndex - 1] : null,
      [DirectionEnum.south]:
        colIndex < grid.length ? grid[colIndex][rowIndex + 1] : null,
      [DirectionEnum.east]:
        colIndex < grid.length ? grid[colIndex + 1][rowIndex] : null,
      [DirectionEnum.west]:
        colIndex < grid.length ? grid[colIndex - 1][rowIndex] : null,
    }
  }

  static getRoomIndex = (id: string): number[] =>
    id.split('-').map((x: string) => Number(x))

  static getRoomId = (colIndex: number, rowIndex: number) =>
    `${colIndex}-${rowIndex}`

  static generateRoom = (coords: Coord[], rooms: Room[], grid: Grid) => {
    const newRooms = [...rooms]
    const newGrid = [...grid]

    for (let i = 0; i < coords.length; i++) {
      const [colIndex, rowIndex] = coords[i]

      const currentCell = newGrid[colIndex][rowIndex]

      if (!currentCell) {
        const newRoom = new Room(this.getRoomId(colIndex, rowIndex))
        newGrid[colIndex][rowIndex] = newRoom
        newRooms.push(newRoom)

        if (i === 0) continue

        const prev = coords[i - 1]

        const prevRoomIndex = newRooms.findIndex(
          (x) => x.id === this.getRoomId(prev[0], prev[1]),
        )

        if (prevRoomIndex === -1) continue

        const directions = this.findDirection(prev, coords[i])

        if (!directions) continue

        newRooms[prevRoomIndex].connects_to = {
          ...newRooms[prevRoomIndex].connects_to,
          [newRoom.id]: directions[0],
        }
        newRooms[newRooms.length - 1].connects_to = {
          ...newRooms[newRooms.length - 1].connects_to,
          [newRooms[prevRoomIndex].id]: directions[1],
        }
        newGrid[prev[0]][prev[1]] = newRooms[prevRoomIndex]
        newGrid[coords[i][0]][coords[i][1]] = newRooms[newRooms.length - 1]
      } else {
        //if crossing another room
        const el = window.document.getElementById(
          this.getRoomId(colIndex, rowIndex),
        )
        if (el && el.className.includes('active')) {
          el.className = el.className.split('active')[0]
        }
        if (i === 0) continue

        const roomIndex = newRooms.findIndex(
          (x) => x.id === this.getRoomId(colIndex, rowIndex),
        )

        const prev = coords[i - 1]

        const prevRoomIndex = newRooms.findIndex(
          (x) => x.id === this.getRoomId(prev[0], prev[1]),
        )

        const directions = this.findDirection(prev, coords[i])

        if (!directions) continue

        newRooms[prevRoomIndex].connects_to = {
          ...newRooms[prevRoomIndex].connects_to,
          [newRooms[roomIndex].id]: directions[0],
        }
        newRooms[roomIndex].connects_to = {
          ...newRooms[roomIndex].connects_to,
          [newRooms[prevRoomIndex].id]: directions[1],
        }
        newGrid[prev[0]][prev[1]] = newRooms[prevRoomIndex]
        newGrid[coords[i][0]][coords[i][1]] = newRooms[roomIndex]
      }
    }

    return { newRooms, newGrid }
  }

  static findDirection = (prevCoord: Coord, coord: Coord) => {
    const colDif = prevCoord[0] - coord[0]
    const rowDif = prevCoord[1] - coord[1]
    if (!colDif && !rowDif) return null
    if (Math.abs(rowDif) > 1 || Math.abs(colDif) > 1) return null

    if (colDif === 0) {
      return rowDif < 0
        ? [DirectionEnum.south, DirectionEnum.north]
        : [DirectionEnum.north, DirectionEnum.south]
    }

    if (rowDif === 0) {
      return colDif < 0
        ? [DirectionEnum.east, DirectionEnum.west]
        : [DirectionEnum.west, DirectionEnum.east]
    }

    return null
  }
}
