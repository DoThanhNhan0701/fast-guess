import { useState } from 'react'

export default function usePopupMultiple<T>() {
  const [isOpen, setIsOpen] = useState(false)
  const [typePopup, setTypePopup] = useState<T | null>(null)

  const openPopup = (type?: T) => {
    setIsOpen(true)
    if (type) setTypePopup(type)
  }

  const closePopup = () => {
    setIsOpen(false)
    setTypePopup(null)
  }

  return { typePopup, isOpen, openPopup, closePopup }
}
