import { RouterProvider } from "@tanstack/react-router";
import { router } from "./components/routes/Routes";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
