import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} · Chaka to Chaka Volleyball Club`
      : 'Chaka to Chaka Volleyball Club'
  }, [title])
}
