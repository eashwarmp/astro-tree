import { ReactNode } from "react";
import "../styles/App.css";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-container">
      {children}
    </div>
  );
} 