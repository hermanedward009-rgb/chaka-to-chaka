import { createContext, useContext } from 'react'

export const ClubContext = createContext(null)

export function useClubData() {
  const value = useContext(ClubContext)
  if (!value) throw new Error('useClubData must be used within ClubProvider')
  return value
}
