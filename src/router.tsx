import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import CardFocus from "./features/tarot/CardFocus";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/card/:sign" element={<CardFocus />} />
      </Routes>
    </BrowserRouter>
  );
} 