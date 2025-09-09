import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ComplicationManagement } from "./components/ComplicationManagement";

import { HemodialysisHome } from "./components/HemodialysisHome";
import { DialysisAssistant } from "./components/DialysisAssistant";
import HemodialsisTraining from "./components/HemodialsisTraining";
import HemodialysisAlarms from "./components/HemodialysisAlarms";

import Priming4008S from "./components/prime/Priming4008s";
import { KTVCaclulator } from "./components/KTVCaclulator";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* مسیر پیش‌فرض به صفحه همودیالیز هدایت شود */}
        <Route path="/" element={<Navigate to="/hemo" />} />

        <Route path="/hemo" element={<HemodialysisHome />} />
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

        <Route path="/hemo/dialysisAssistant" element={<DialysisAssistant />} />

        <Route
          path="/hemo/complications"
          element={<ComplicationManagement />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
