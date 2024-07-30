import { Room } from '../assets/Room'

export enum RoomStateEnum {
  locked = 'locked',
  unlocked = 'unlocked',
}
export enum DirectionEnum {
  west = 'west',
  north = 'north',
  east = 'east',
  south = 'south',
}

export type Grid = Array<Array<Room | null>>

export type Coord = number[]

export type RoomNeighbor = Record<DirectionEnum, Room | null>
