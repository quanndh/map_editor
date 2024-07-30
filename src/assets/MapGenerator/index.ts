import { DirectionEnum, Grid } from '../../interfaces'
import { Room } from '../Room'

export class MapGenerator {
  grid: Grid = []
  cols: number = 100
  rows: number = 100
  rooms: Room[] = []
  numberOfRoom: number = 0
  maxLineLength = 5

  constructor(numberOfRoom: number) {
    this.numberOfRoom = numberOfRoom
    this.maxLineLength = 10
    this.grid = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => null),
    )
  }

  generate = () => {
    const startX = Math.floor(this.rows / 8)
    const startY = Math.floor(this.cols / 8)
    this.placeRoomOrCorridor(startX, startY) // Place fixed start point

    while (this.rooms.length < this.numberOfRoom + 1) {
      let roomX = Math.floor(Math.random() * this.rows)
      let roomY = Math.floor(Math.random() * this.cols)

      if (!this.grid[roomY][roomX]) {
        // Only place a room if the tile is empty
        this.placeRoomOrCorridor(roomX, roomY)

        // Connect rooms with corridors
        if (this.rooms.length > 1) {
          let prevRoom = this.rooms[this.rooms.length - 2]
          let newRoom = this.rooms[this.rooms.length - 1]
          const prevRoomIndex = prevRoom.getRoomIndex()
          const newRoomIndex = newRoom.getRoomIndex()

          this.createCorridor(
            prevRoomIndex[1],
            prevRoomIndex[0],
            newRoomIndex[1],
            newRoomIndex[0],
          )
        }
      }
    }

    this.rooms = this.rooms
      .map((room) => {
        const neighbors = room.findNeighbors(this.grid)
        Object.keys(neighbors).map((direction) => {
          if (!neighbors[direction as DirectionEnum]) return
          room.connect(
            neighbors[direction as DirectionEnum]!,
            direction as DirectionEnum,
          )
        })
        return room
      })
      .filter((room) => {
        if (Object.keys(room.connects_to).length > 0) {
          return room
        }
        return false
      })

    return {
      rooms: this.rooms,
      grid: this.grid,
      rows: this.rows,
      cols: this.cols,
    }
  }

  private placeRoomOrCorridor(x: number, y: number) {
    if (
      x >= 0 &&
      x < this.rows &&
      y >= 0 &&
      y < this.cols &&
      !this.grid[y][x]
    ) {
      const newRoom = new Room(Room.getRoomId(y, x))
      this.grid[y][x] = newRoom
      this.rooms.push(newRoom)
    }
  }

  private createCorridor(x1: number, y1: number, x2: number, y2: number) {
    let x = x1
    let y = y1
    let length = 0
    let direction =
      Math.abs(x2 - x1) > Math.abs(y2 - y1) ? 'horizontal' : 'vertical'
    while ((x !== x2 || y !== y2) && this.rooms.length < this.numberOfRoom) {
      if (length >= this.maxLineLength) {
        this.createBranch(x, y, direction)
        length = 0
      }
      this.placeRoomOrCorridor(x, y)
      if (Math.random() < this.rooms.length / this.numberOfRoom) {
        // 10% chance to branch
        this.createBranch(x, y, direction)
      }
      if (x !== x2) {
        x += x2 > x ? 1 : -1
      } else if (y !== y2) {
        y += y2 > y ? 1 : -1
      }
      length++
    }
  }

  private createBranch(x: number, y: number, parentDirection: string) {
    const branchLength = Math.floor(Math.random() * 3) + 3 // Length between 3 and 7
    let direction = parentDirection === 'vertical' ? 'horizontal' : 'vertical'
    let bx = x
    let by = y
    for (
      let i = 0;
      i < branchLength && this.rooms.length < this.numberOfRoom;
      i++
    ) {
      switch (direction) {
        case 'vertical':
          by += Math.random() < 0.5 ? 1 : -1
          break // Up or Down
        case 'horizontal':
          bx += Math.random() < 0.5 ? 1 : -1
          break // Left or Right
      }
      this.placeRoomOrCorridor(bx, by)
    }
  }
}
