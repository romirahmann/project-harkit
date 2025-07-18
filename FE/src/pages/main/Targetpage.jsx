/* eslint-disable no-unused-vars */
import { IoAddCircleOutline } from "react-icons/io5";
import { LazyComponent } from "../../shared/LazyComponent";
import { Titlepage } from "../../shared/Titlepage";
import { TbTargetArrow } from "react-icons/tb";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useEffect, useState } from "react";
import api from "../../services/axios.service";
import { TableTarget } from "../../components/target/TableTarget";
import { TargetAction } from "../../components/target/TargetAction";
import { AlertMessage } from "../../shared/AlertMessage";

export function Targetpage() {
  const [isLoading, setLoading] = useState(true);
  const [targets, setTarget] = useState([]);
  const [showModal, setShowModal] = useState({
    show: false,
    type: "",
    data: null,
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [selectedData, setSelcetedData] = useState([]);
  const [resetChecklist, setResetChecklist] = useState(false);
  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const res = await api.get(`/master/targets`);
      setTarget(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedData = (val) => {
    setSelcetedData(val);
  };

  const handleSearch = async (query) => {
    try {
      let res;

      if (query.trim() === "") {
        res = await api.get("/master/targets");
      } else {
        res = await api.get(`/master/target-filter/${query}`);
      }

      setTarget(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAction = (type) => {
    switch (type) {
      case "ADD":
        setShowModal({
          show: true,
          type: type,
          data: null,
        });
        break;
      case "EDIT":
        if (selectedData.length > 1 || selectedData.length === 0) {
          setAlert({
            show: true,
            message:
              selectedData.length === 0
                ? "Please select a target to edit"
                : "Please select only one target to edit",
            type: "warning",
          });
          return;
        }
        setShowModal({ show: true, type: type, data: selectedData[0] });
        break;
      case "DELETE":
        if (selectedData.length > 1 || selectedData.length === 0) {
          setAlert({
            show: true,
            message:
              selectedData.length === 0
                ? "Please select a target to delete"
                : "Please select only one target to delete",
            type: "warning",
          });
          return;
        }

        setShowModal({ show: true, type: type, data: selectedData[0] });
        break;

      default:
        break;
    }
  };

  const handleOnAction = (val) => {
    fetchTargets();
    setSelcetedData([]);
    setAlert({
      show: true,
      message: val,
      type: "success",
    });
    setShowModal({
      show: false,
      type: "",
      data: null,
    });
    setResetChecklist(true);
  };

  return (
    <>
      <div className="w-max-full">
        <Titlepage
          title={`Data Target`}
          icon={TbTargetArrow}
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
              <TableTarget
                data={targets}
                selectedData={(val) => handleSelectedData(val)}
                resetChecklist={resetChecklist}
              />
            </div>
          </div>
        )}

        <TargetAction
          isOpen={showModal.show}
          type={showModal.type}
          data={showModal.data}
          onClose={() =>
            setShowModal({
              show: false,
              type: "",
              data: null,
            })
          }
          onAction={handleOnAction}
        />

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
      </div>
    </>
  );
}
