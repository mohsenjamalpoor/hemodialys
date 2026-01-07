import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ComplicationManagement } from "./components/ComplicationManagement";
import { HemodialysisHome } from "./components/HemodialysisHome";

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
        <Route path="/" element={<Navigate to="/hemo" />} />

        <Route path="/hemo" element={<HemodialysisHome />} />
        
   
        <Route path="/hemo/dialysisAssistant" element={<HemodialysisPediatrics />}>
          <Route index element={<div className="text-center py-12 text-gray-500">لطفاً وضعیت بیمار را انتخاب کنید</div>} />
          <Route path="stable" element={<StableDialysisAssistant />} />
          <Route path="unstable" element={<UnstableDialysisAssistant />} />
        </Route>
        
        <Route
          path="/hemo/hemodialsisTraining"
          element={<HemodialsisTraining />}
        />
        <Route
          path="/hemo/hemodialysisAlarms"
          element={<HemodialysisAlarms />}
        />
        <Route path="/hemo/ktv" element={<KTVCaclulator />} />
        <Route path="/hemo/priming4008S" element={<Priming4008S />} />
        <Route path="/hemo/complications" element={<ComplicationManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;