import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CardPage from "../pages/CardPage";
import SignPage from "../pages/SignPage";
import TarotGate from "../pages/TarotGate";
import SkyLayout from "./SkyLayout";

export default function Router() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<SkyLayout />}>
          <Route index element={<SignPage />} />
          <Route path="card/:sign" element={<CardPage />} />
          <Route path="tarot/:sign" element={<TarotGate />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
