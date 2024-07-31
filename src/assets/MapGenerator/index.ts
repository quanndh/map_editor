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
    const centerX = Math.floor(this.rows / 7)
    const centerY = Math.floor(this.cols / 7)

    // Generate the main circle
    const radius = this.generateCircleBoundary(centerX, centerY)

    // Generate routes from points on the circular structure
    const directions = ['up', 'down', 'left', 'right']

    let remainingRoom = this.numberOfRoom - this.rooms.length

    for (let i = 0; i < remainingRoom / 2; i++) {
      const angle = Math.random() * 2 * Math.PI
      const x = centerX + Math.floor(radius * Math.cos(angle))
      const y = centerY + Math.floor(radius * Math.sin(angle))
      const direction =
        directions[Math.floor(Math.random() * directions.length)]
      this.createCorridor(x, y, 30, direction) // Increased length to 30 for longer routes
    }

    // Allow caves to extend inside the circular area
    for (let i = 0; i < remainingRoom / 2; i++) {
      const x = centerX + Math.floor((Math.random() - 0.5) * 2 * radius)
      const y = centerY + Math.floor((Math.random() - 0.5) * 2 * radius)
      const direction =
        directions[Math.floor(Math.random() * directions.length)]
      this.createCorridor(x, y, 30, direction) // Increased length to 30 for longer routes
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

  private createCorridor(
    x1: number,
    y1: number,
    length: number,
    initialDirection: string,
  ) {
    let x = x1
    let y = y1
    let direction = initialDirection
    for (let i = 0; i < length && this.rooms.length < this.numberOfRoom; i++) {
      this.placeRoomOrCorridor(x, y)
      if (Math.random() < 0.5) {
        // 50% chance to change direction
        const directions = ['up', 'down', 'left', 'right']
        direction = directions[Math.floor(Math.random() * directions.length)]
      }
      if (Math.random() < 0.2) {
        // 20% chance to stop and create a dead end
        break
      }
      switch (direction) {
        case 'up':
          y--
          break
        case 'down':
          y++
          break
        case 'left':
          x--
          break
        case 'right':
          x++
          break
      }
    }
  }

  private generateCircleBoundary = (cx: number, cy: number) => {
    if (this.numberOfRoom <= 50) {
      let rectWidth = Math.round(Math.sqrt(this.numberOfRoom))
      let rectHeight = Math.round(Math.sqrt(this.numberOfRoom))

      for (let i = 0; i < rectHeight; i++) {
        for (let j = 0; j < rectWidth; j++) {
          if (
            i === 0 ||
            i === rectHeight - 1 ||
            j === 0 ||
            j === rectWidth - 1
          ) {
            this.placeRoomOrCorridor(cx + i, cy + j)
          }
        }
      }

      return 0
    }

    const radius = Math.ceil(Math.sqrt(this.numberOfRoom / (2 * Math.PI))) + 2 // Smaller radius for a thinner circle
    const stepAngle = 360 / this.numberOfRoom
    let previousX = null
    let previousY = null
    for (let i = 0; i < this.numberOfRoom; i++) {
      let angle = stepAngle * i
      let rad = angle * (Math.PI / 180)
      let x = cx + Math.floor(radius * Math.cos(rad))
      let y = cy + Math.floor(radius * Math.sin(rad))

      if (previousX !== null && previousY !== null) {
        // Ensure only up, down, left, or right connections
        while (x !== previousX || y !== previousY) {
          if (x < previousX) previousX--
          else if (x > previousX) previousX++
          else if (y < previousY) previousY--
          else if (y > previousY) previousY++
          this.placeRoomOrCorridor(previousX, previousY)
        }
      }
      this.placeRoomOrCorridor(x, y)
      previousX = x
      previousY = y
    }
    return radius
  }
}
