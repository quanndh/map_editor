import { useEffect, useState } from 'react'

const useHoldKey = (wantedKey?: string) => {
  const [isHolding, setIsHolding] = useState(false)
  const [keyHeld, setKeyHeld] = useState(null)

  let timeout

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (
        !isHolding &&
        !['TEXTAREA', 'INPUT', 'SELECT'].includes(
          String(document.activeElement?.tagName),
        )
      ) {
        setIsHolding(true)
        setKeyHeld(event.key)
      }
    }

    const handleKeyUp = (event: any) => {
      if (isHolding && event.key === keyHeld) {
        setIsHolding(false)
        setKeyHeld(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isHolding, keyHeld])

  return {
    isHolding: wantedKey ? keyHeld === wantedKey && isHolding : isHolding,
  }
}

export default useHoldKey
