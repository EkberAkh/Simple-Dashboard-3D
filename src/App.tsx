import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { DesignersPage } from "./pages/DesignersPage";
import { EditorPage } from "./pages/EditorPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/designers" element={<DesignersPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="*" element={<Navigate to="/designers" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
