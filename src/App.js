import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ComplicationManagement } from "./components/ComplicationManagement";
import { FilterSelection } from "./components/FilterSelection";
import { QbCalculator } from "./components/QbCalculator";
import { HemodialysisHome } from "./components/HemodialysisHome";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* مسیر پیش‌فرض به صفحه همودیالیز هدایت شود */}
        <Route path="/" element={<Navigate to="/hemo" />} />

        {/* مسیرهای همودیالیز کودکان */}
        <Route path="/hemo" element={<HemodialysisHome />} />
        <Route path="/hemo/qb" element={<QbCalculator />} />
        <Route path="/hemo/filters" element={<FilterSelection />} />
        <Route path="/hemo/complications" element={<ComplicationManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
