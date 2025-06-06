import { BrowserRouter, Route, Routes } from 'react-router'
import { Login } from "../../pages/login/login"
import { Register } from "../../pages/registre/registre"
import { PrivateLayout } from '../layout'
import { HomePage } from '../../pages/home/HomePage'
// import { ForgotPassword } from '../../pages/forgotPassword/forgotPassword'
// import { ResetPassword } from '../../pages/forgotPassword/resetPassword'


export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} /> */}

      <Route path="/" element={<PrivateLayout />}>
        <Route path="/homepage" element={<HomePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)