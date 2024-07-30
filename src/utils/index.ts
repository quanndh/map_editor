import { DirectionEnum } from '../interfaces'

export const Utils = {
  getOppositeDirection: (direction: DirectionEnum) => {
    switch (direction) {
      case DirectionEnum.north:
        return DirectionEnum.south
      case DirectionEnum.south:
        return DirectionEnum.north
      case DirectionEnum.east:
        return DirectionEnum.west
      case DirectionEnum.west:
        return DirectionEnum.east
    }
  },
}
