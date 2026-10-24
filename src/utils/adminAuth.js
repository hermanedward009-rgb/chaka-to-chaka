const PASSWORD_KEY = 'chaka-to-chaka-admin-password'

export const STARTING_PASSWORD = 'Chaka2026'

export function getAdminPassword() {
  try {
    return localStorage.getItem(PASSWORD_KEY) || STARTING_PASSWORD
  } catch {
    return STARTING_PASSWORD
  }
}

export function setAdminPassword(password) {
  localStorage.setItem(PASSWORD_KEY, password)
}
