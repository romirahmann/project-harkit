import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "./store/AuthContext";
import { router } from "./routes/Routes";

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
