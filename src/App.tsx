import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProjectCreate } from './pages/ProjectCreate';
import { WizardStep } from './pages/WizardStep';
import { BusinessPlanViewer } from './pages/BusinessPlanViewer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectCreate />} />
        <Route element={<Layout />}>
          <Route path="/wizard/:stepId" element={<WizardStep />} />
          <Route path="/business-plan" element={<BusinessPlanViewer />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
