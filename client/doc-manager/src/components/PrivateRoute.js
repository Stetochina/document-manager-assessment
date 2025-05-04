import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "./Layout";
import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { token } = useAuth();

  return token ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
