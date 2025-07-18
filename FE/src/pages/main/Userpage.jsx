/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { TableUser } from "../../components/user/TableUser";
import { Titlepage } from "../../shared/Titlepage";
import { FaUsersGear } from "react-icons/fa6";
import api from "../../services/axios.service";
import { LazyComponent } from "../../shared/LazyComponent";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { AlertMessage } from "../../shared/AlertMessage";
import { AddModalUser } from "../../components/modal/AddModalUser";
import { AddLog } from "../../services/log.service";
import { EditModalUser } from "../../components/modal/EditModalUser";
import { ModalDelete } from "../../shared/ModalDeleted";

export function Userpage() {
  const [users, setUsers] = useState([]);
  const [selectedData, setSelcetedData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showModal, setShowModal] = useState({
    show: false,
    type: "",
    data: null,
  });

  const [resetChecklist, setResetChecklist] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/master/users/`);
      setUsers(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (query) => {
    try {
      let res;

      if (query.trim() === "") {
        res = await api.get("/master/users");
      } else {
        res = await api.get(`/master/user-filter/${query}`);
      }

      setUsers(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedData = (val) => {
    setSelcetedData(val);
  };

  const handleAction = (type) => {
    switch (type) {
      case "ADD":
        setShowModal({
          show: true,
          type: "ADD",
          data: null,
        });
        break;
      case "EDIT":
        if (selectedData.length > 1 || selectedData.length === 0) {
          setAlert({
            show: true,
            message:
              selectedData.length === 0
                ? "Please select a user to edit"
                : "Please select only one user to edit",
            type: "warning",
          });
          return;
        }
        console.log(selectedData[0]);
        setShowModal({
          show: true,
          type: "EDIT",
          data: selectedData[0],
        });

        break;
      case "DELETE":
        if (selectedData.length > 1 || selectedData.length === 0) {
          setAlert({
            show: true,
            message:
              selectedData.length === 0
                ? "Please select a user to edit"
                : "Please select only one user to edit",
            type: "warning",
          });
          return;
        }
        setShowModal({
          show: true,
          type: "DELETE",
          data: selectedData[0],
        });
        break;

      default:
        break;
    }
  };

  const handleAdd = async (formData) => {
    try {
      await api.post("/master/register", formData);
      setShowModal({
        show: false,
        type: "",
        data: null,
      });
      fetchUser();
      setAlert({
        show: true,
        message: "User added successfully",
        type: "success",
      });
      AddLog(`${formData.username} menambahkan user ${formData.username} !`);
    } catch (error) {
      setAlert({
        show: true,
        message: "User added failure!",
        type: "error",
      });
      console.log(error);
    }
  };

  const handleEdit = async (formData) => {
    try {
      await api.put(`/master/user/${selectedData[0].id}`, formData);
      setShowModal({
        show: false,
        type: "",
        data: null,
      });
      fetchUser();
      setResetChecklist(true);
      setAlert({
        show: true,
        message: "User edit successfully",
        type: "success",
      });
      AddLog(`${formData.username} menambahkan user ${formData.username} !`);
    } catch (error) {
      setAlert({
        show: true,
        message: "User added failure!",
        type: "error",
      });
      console.log(error);
    }
  };

  const handleDelete = async (formData) => {
    try {
      await api.delete(`/master/user/${selectedData[0].id}`);
      setShowModal({
        show: false,
        type: "",
        data: null,
      });
      fetchUser();
      setResetChecklist(true);
      setAlert({
        show: true,
        message: "User Deleted successfully",
        type: "success",
      });
      AddLog(`${formData.username} deleted user ${formData.username} !`);
    } catch (error) {
      setAlert({
        show: true,
        message: "User deleted failure!",
        type: "error",
      });
      console.log(error);
    }
  };

  return (
    <>
      <div className="max-w-full">
        <Titlepage
          title={`Users Data`}
          icon={FaUsersGear}
          onSearch={handleSearch}
        />
        {isLoading ? (
          <LazyComponent />
        ) : (
          <div className="w-full table px-2 ">
            <div className="actions flex gap-2 items-center px-5 bg-white py-2 rounded-lg my-2">
              <div className="btn-add">
                <button
                  onClick={() => handleAction("ADD")}
                  className="border hover:bg-blue-600 hover:text-white border-blue-600 p-2 text-xl rounded-md text-blue-800  "
                >
                  <IoAddCircleOutline />
                </button>
              </div>
              <div className="btn-edit">
                <button
                  onClick={() => handleAction("EDIT")}
                  className="border hover:bg-blue-600 hover:text-white border-blue-600 p-2 text-xl rounded-md text-green-800  "
                >
                  <FaEdit />
                </button>
              </div>
              <div className="btn-delete">
                <button
                  onClick={() => handleAction("DELETE")}
                  className="border hover:bg-red-600 hover:text-white border-blue-600 p-2 text-xl rounded-md text-red-800  "
                >
                  <MdDeleteForever />
                </button>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <TableUser
                data={users}
                selectedData={(selectedUser) =>
                  handleSelectedData(selectedUser)
                }
                resetChecklist={resetChecklist}
              />
            </div>
          </div>
        )}
      </div>
      <div>
        <AddModalUser
          isOpen={showModal.type === "ADD"}
          onSubmit={handleAdd}
          onClose={() =>
            showModal.show
              ? setShowModal({
                  show: false,
                  type: "",
                  data: null,
                })
              : setShowModal({
                  show: true,
                  type: "ADD",
                  data: null,
                })
          }
        />
        <EditModalUser
          isOpen={showModal.type === "EDIT"}
          onSubmit={handleEdit}
          data={showModal.data ? showModal.data : null}
          onClose={() =>
            setShowModal({
              show: false,
              type: "",
              data: null,
            })
          }
        />
        <ModalDelete
          isOpen={showModal.type === "DELETE"}
          onDelete={handleDelete}
          onClose={() => setShowModal({ show: false, type: "", data: null })}
        />
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
