import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ComplicationManagement } from "./components/ComplicationManagement";


import { HemodialysisHome } from "./components/HemodialysisHome";
import { DialysisAssistant } from "./components/DialysisAssistant";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* مسیر پیش‌فرض به صفحه همودیالیز هدایت شود */}
        <Route path="/" element={<Navigate to="/hemo" />} />

      
        <Route path="/hemo" element={<HemodialysisHome />} />
        <Route path="/hemo/dialysisAssistant" element={<DialysisAssistant />} />
        <Route path="/hemo/complications" element={<ComplicationManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
