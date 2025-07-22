/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Titlepage } from "../../shared/Titlepage";
import { TbTargetArrow } from "react-icons/tb";
import { FaBoxes, FaEdit } from "react-icons/fa";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { MdBlock, MdDeleteForever } from "react-icons/md";
import { LazyComponent } from "../../shared/LazyComponent";
import api from "../../services/axios.service";
import { IoAddCircleOutline } from "react-icons/io5";
import { TableBox } from "../../components/box/TableBox";
import { AlertMessage } from "../../shared/AlertMessage";
import { BoxAction } from "../../components/box/BoxAction";

export function Boxpage() {
  const [isLoading, setLoading] = useState(true);
  const [boxs, setBox] = useState([]);
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
    fetchBox();
  }, []);

  const fetchBox = async () => {
    try {
      let res = await api.get(`/master/boxs`);
      setBox(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {};

  const handleAction = (type) => {
    switch (type) {
      case "EDIT":
        if (selectedData.length > 1 || selectedData.length === 0) {
          setAlert({
            show: true,
            message:
              selectedData.length === 0
                ? "Please select a Data NoBox to edit"
                : "Please select only one NoBox to edit",
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
                ? "Please select a Data NoBox to delete"
                : "Please select only one NoBox to delete",
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
    fetchBox();

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
    setSelcetedData([]);
    setResetChecklist(true);
    return;
  };

  return (
    <>
      <div className="w-max-full">
        <Titlepage title={`Data Box`} icon={FaBoxes} onSearch={handleSearch} />
        {isLoading ? (
          <LazyComponent />
        ) : (
          <div className="w-full table px-2 ">
            <div className="actions flex justify-between items-center px-5 bg-white py-2 rounded-lg my-2">
              <div className="btn-Action ">
                <div className="flex gap-2">
                  <div className="btn-add">
                    <button
                      onClick={() => handleAction("ADD")}
                      className="border hover:bg-blue-600 hover:text-white border-blue-600 p-2 text-xl rounded-md text-green-800  "
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
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <TableBox
                data={boxs}
                selectedData={(selectedBox) => setSelcetedData(selectedBox)}
                resetChecklist={resetChecklist}
              />
              <BoxAction
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
            </div>
          </div>
        )}
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
