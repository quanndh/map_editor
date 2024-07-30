import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  children: ReactNode
  danger?: boolean
  onClick?: () => void
}

const Button: FC<Props> = ({ children, danger = false, onClick }) => {
  return (
    <div
      className={twMerge(
        classNames(
          'outline-none border-none bg-teal-600 w-fit px-4 py-1 rounded-sm text-white cursor-pointer transition-all duration-150 hover:bg-teal-500',
          {
            'bg-red-600 hover:bg-red-500': danger,
          },
        ),
      )}
      onClick={() => {
        onClick && onClick()
      }}>
      {children}
    </div>
  )
}

export default Button
