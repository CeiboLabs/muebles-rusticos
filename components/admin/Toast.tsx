'use client'

import { useEffect } from 'react'

interface Props {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type = 'success', onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const isSuccess = type === 'success'

  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-sm shadow-lg font-sans text-sm font-medium animate-in slide-in-from-bottom-2 duration-200 ${
        isSuccess
          ? 'bg-stone-900 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      {isSuccess ? (
        <svg className="w-4 h-4 shrink-0 text-wood-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
    </div>
  )
}
