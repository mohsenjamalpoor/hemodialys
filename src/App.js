// App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./components/Login";
import { HemodialysisHome } from "./components/HemodialysisHome";
import { ComplicationManagement } from "./components/ComplicationManagement";
import HemodialsisTraining from "./components/HemodialsisTraining";
import HemodialysisAlarms from "./components/HemodialysisAlarms";
import Priming4008S from "./components/prime/Priming4008s";
import { KTVCaclulator } from "./components/KTVCaclulator";
import { HemodialysisPediatrics } from "./components/HemodialysisPediatrics";
import { StableDialysisAssistant } from "./components/StableDialysisAssistant";
import { UnstableDialysisAssistant } from "./components/UnstableDialysisAssistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* صفحه اصلی به لاگین ریدایرکت شود */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* صفحه لاگین */}
        <Route path="/login" element={<Login />} />
        
        {/* مسیرهای محافظت شده */}
        <Route path="/hemo" element={
          <ProtectedRoute>
            <HemodialysisHome />
          </ProtectedRoute>
        } />
        
        <Route path="/hemo/hemodialysisPediatrics" element={
          <ProtectedRoute>
            <HemodialysisPediatrics />
          </ProtectedRoute>
        } />
        
        <Route path="/hemo/dialysisAssistant/stable" element={
          <ProtectedRoute>
            <StableDialysisAssistant />
          </ProtectedRoute>
        } />
        
        <Route path="/hemo/dialysisAssistant/unstable" element={
          <ProtectedRoute>
            <UnstableDialysisAssistant />
          </ProtectedRoute>
        } />
        
        <Route path="/hemo/hemodialsisTraining" element={
          <ProtectedRoute>
            <HemodialsisTraining />
          </ProtectedRoute>
        } />
        
        <Route path="/hemo/hemodialysisAlarms" element={
          <ProtectedRoute>
            <HemodialysisAlarms />
          </ProtectedRoute>
        } />
        
        <Route path="/hemo/ktv" element={
          <ProtectedRoute>
            <KTVCaclulator />
          </ProtectedRoute>
        } />
        
        <Route path="/hemo/priming4008S" element={
          <ProtectedRoute>
            <Priming4008S />
          </ProtectedRoute>
        } />
        
        <Route path="/hemo/complications" element={
          <ProtectedRoute>
            <ComplicationManagement />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;