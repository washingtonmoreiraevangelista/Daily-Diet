import { BrowserRouter, Route, Routes } from 'react-router'

import { PrivateLayout } from '../layout'
import { HomePage } from '../../pages/home/HomePage'
import { LoginRegisterSplit } from '../../pages/login/LoginRegister'
import { ProfilePage } from '../../pages/perfil/perfil'

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
       {/* Página pública */}
      <Route path="/" element={<LoginRegisterSplit />} />


      {/* Rotas privadas */}
      <Route element={<PrivateLayout />}>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)