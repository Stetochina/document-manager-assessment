import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import FileUpload from "./pages/FileUpload";
import FileSearch from "./pages/FileSearch";
import FileView from "./pages/FileView";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/file-upload" element={<FileUpload />} />
            <Route path="/file-search" element={<FileSearch />} />
            <Route path="/*" element={<FileView />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
