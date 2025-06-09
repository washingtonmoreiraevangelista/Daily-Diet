import { Navigate, Outlet } from 'react-router'

export const PrivateLayout = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token')) // ou useContext, etc.

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />
}
