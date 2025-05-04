import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "./AppLayout";
import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { token } = useAuth();

  return token ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
