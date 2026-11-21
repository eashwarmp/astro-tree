import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CardPage from "../pages/CardPage";
import SignPage from "../pages/SignPage";
import SkyLayout from "./SkyLayout";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SkyLayout />}>
          <Route index element={<SignPage />} />
          <Route path="card/:sign" element={<CardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
