import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DocumentUpload from "./pages/DocumentUpload";
import DocumentSearch from "./pages/DocumentSearch";
import DocumentDownload from "./pages/DocumentDownload";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/doc-upload" element={<DocumentUpload />} />
            <Route path="/doc-search" element={<DocumentSearch />} />
            <Route path="/*" element={<DocumentDownload />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
