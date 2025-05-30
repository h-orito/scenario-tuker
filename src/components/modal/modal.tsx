'use client'

import { cloneElement, useState } from 'react'
import SecondaryButton from '../button/scondary-button'
import Portal from './portal'

type ModalProps = {
  header?: string
  close: (e: any) => void
  children: React.ReactNode
  hideFooter?: boolean
  hideOnClickOutside?: boolean
}

export default function Modal({
  header,
  close,
  children,
  hideFooter,
  hideOnClickOutside = true
}: ModalProps) {
  const [insideClick, setInsideClick] = useState(false)
  const onMouseDown = (e: any) => setInsideClick(e.target === e.currentTarget)
  const onMouseUp = (e: any) => {
    if (!hideOnClickOutside) return
    if (e.target === e.currentTarget && insideClick) {
      close(e)
    }
  }

  return (
    <Portal>
      <div
        className='fixed inset-x-0 inset-y-0 z-50 flex items-center justify-center bg-black/60 text-sm'
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <div className='md:w-screen-md max-h-[90vh] min-h-[60vh] w-[95vw] max-w-[95vw] overflow-y-auto bg-white p-4 md:max-w-screen-md'>
          {header && (
            <p className='base-border mb-2 border-b pb-2 text-xl'>{header}</p>
          )}
          {cloneElement(children as any, {
            close: close
          })}
          {!hideFooter && (
            <div className='base-border mt-2 flex justify-end border-t pt-2'>
              <SecondaryButton click={close}>閉じる</SecondaryButton>
            </div>
          )}
        </div>
      </div>
    </Portal>
  )
}
