import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import api from "../../services/axios.service";
import { AlertMessage } from "../../shared/AlertMessage";

/* eslint-disable no-unused-vars */
export function LoginPage() {
  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const { login } = useAuth();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormLogin({
      ...formLogin,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formLogin.username || !formLogin.password) {
      setAlert({
        show: true,
        message: "Username & Password is required",
        type: "warning",
      });
      return;
    }

    try {
      let res = await api.post("/auth/login", formLogin);
      let data = res.data.data;
      let user = data.userData;
      let token = data.token;

      const saveSession = login(user, token);

      if (saveSession) {
        setAlert({
          show: true,
          message: "Login Successfully!",
          type: "success",
        });
        setTimeout(() => {
          router.navigate({ to: "/" });
        }, 1500);
        return;
      }

      setAlert({
        show: true,
        message: `Login Failed!`,
        type: "error",
      });
    } catch (error) {
      setAlert({
        show: true,
        message: `${error.response.data.data}`,
        type: "error",
      });
    }
  };
  return (
    <>
      <div className="max-w-full bg-blue-900 min-h-screen grid justify-center items-center ">
        <div className="login p-2">
          <div className="box-login bg-white/20 backdrop-blur-md w-full md:w-[32em] shadow-lg shadow-gray-900 rounded-lg md:rounded-l-lg ">
            <div className="form p-12 mb-10">
              <div className="brand flex justify-center items-center">
                <img
                  src="/RSAB-HARAPAN-KITA/images/logo_candra.png"
                  className="w-12"
                  alt=""
                />
                <p className="text-3xl text-white font-bold mx-5">CANDRA</p>
              </div>
              <hr className="mt-4" />
              <div className="formLogin mt-5 ">
                <h1 className="text-xl font-semibold text-gray-200 text-center">
                  Sign In
                </h1>

                <form
                  className="max-w-sm mx-auto mt-5 flex flex-col"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-3">
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-300 dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      onChange={handleChange}
                      id="username"
                      name="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-blue-600 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-300 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-blue-600 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="text-white group bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex "
                  >
                    <span className="text-center">Submit</span>
                    <span className="ms-auto me-3 group-hover:me-0 ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {alert.show && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() =>
              setAlert({
                show: false,
                type: "",
                message: "",
              })
            }
          />
        )}
      </div>
    </>
  );
}
