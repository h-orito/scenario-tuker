import { useState } from 'react'

const useModalState = () => {
  const [isShowModal, setIsShowModal] = useState(false)
  const openModal = (e: any) => {
    e.preventDefault()
    setIsShowModal(true)
  }
  const closeModal = () => {
    setIsShowModal(false)
  }
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsShowModal(!isShowModal)
    }
  }
  return [isShowModal, openModal, closeModal, toggleModal] as const
}
export default useModalState
