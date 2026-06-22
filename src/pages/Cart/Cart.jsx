import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function Cart() {
  const { setIsOpen } = useCart()
  const navigate = useNavigate()
  useEffect(() => { setIsOpen(true); navigate(-1) }, [])
  return null
}
