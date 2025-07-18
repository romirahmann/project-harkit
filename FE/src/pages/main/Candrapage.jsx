/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../../services/axios.service";
import { Titlepage } from "../../shared/Titlepage";
import { FaClipboardList, FaEdit, FaUsers } from "react-icons/fa";
import { LazyComponent } from "../../shared/LazyComponent";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { TableCandra } from "../../components/candra/TableCandra";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import moment from "moment";
import { CandraAction } from "../../components/candra/CandraAction";
import { AlertMessage } from "../../shared/AlertMessage";

export function Candrapage() {
  const [isLoading, setLoading] = useState(true);
  const [candra, setCandra] = useState([]);
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
  const [query, setQuery] = useState("");
  const [resetChecklist, setResetChecklist] = useState(false);

  useEffect(() => {
    fetchCandra();
  }, []);

  const fetchCandra = async () => {
    try {
      const res = await api.get("/master/candras");

      setCandra(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (query) => {
    try {
      let res;

      if (query.trim() === "") {
        res = await api.get("/master/candras");
      } else {
        res = await api.get(`/master/filter-candra/${query}`);
      }

      setCandra(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = (type) => {
    switch (type) {
      case "EDIT":
        if (selectedData.length > 1 || selectedData.length === 0) {
          setAlert({
            show: true,
            message:
              selectedData.length === 0
                ? "Please select a Data Candra to edit"
                : "Please select only one edit to edit",
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
                ? "Please select a Data Candra to delete"
                : "Please select only one edit to delete",
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
    fetchCandra();

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
  };
  const handleSelectedData = (val) => {
    setSelcetedData(val);
  };
  const handleExportCsv = () => {
    const exportCsv = async () => {
      try {
        const response = await api.post(`/master/export-candra`, candra, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
        let dateNow = moment().format("YYYYMMDD HH:mm:ss");
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `data_CANDRA_${query !== null ? query : dateNow}.xlsx`
        ); // Nama file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("❌ Error saat mendownload CSV:", error);
      }
    };
    exportCsv();
  };
  return (
    <>
      <div className="w-max-full">
        <Titlepage
          title={`Data Candra`}
          icon={FaClipboardList}
          onSearch={handleSearch}
        />
        {isLoading ? (
          <LazyComponent />
        ) : (
          <div className="w-full table px-2 ">
            <div className="actions flex gap-2 items-center px-5 bg-white py-2 rounded-lg my-2">
              <div className="btn-add">
                <button
                  onClick={() => handleExportCsv()}
                  className="border hover:bg-blue-600 hover:text-white border-blue-600 p-2  rounded-md text-green-800  "
                >
                  <PiMicrosoftExcelLogoFill size={21} />
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
              <TableCandra
                data={candra}
                selectedData={(selectedCandra) =>
                  handleSelectedData(selectedCandra)
                }
                resetChecklist={resetChecklist}
              />
            </div>
            <div>
              <CandraAction
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
