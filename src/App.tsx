import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RequestAccessPage } from "@/pages/RequestAccessPage";
import { SignupPage } from "@/pages/SignupPage";
import { VerifyEmailPage } from "@/pages/VerifyEmailPage";

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login.html" element={<Navigate to="/login" replace />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup.html" element={<Navigate to="/signup" replace />} />
            <Route path="/request-access" element={<RequestAccessPage />} />
            <Route path="/request-access.html" element={<Navigate to="/request-access" replace />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/verify-email.html" element={<Navigate to="/verify-email" replace />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
