import { useContext } from "react";
import { ApiUrl } from "../../context/Urlapi";
export function Dashboard() {
  const baseUrl = useContext(ApiUrl);
  return (
    <>
      <h1>DASHBOARD!</h1>
      <p>Base Url {baseUrl} </p>
    </>
  );
}
