/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import api from "../../services/axios.service";
import { Titlepage } from "../../shared/Titlepage";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever, MdOutlineLibraryAdd } from "react-icons/md";
import { LazyComponent } from "../../shared/LazyComponent";
import { TableKCP } from "../../components/kcp/TableKCP";
import { AlertMessage } from "../../shared/AlertMessage";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import moment from "moment";
import { KcpAction } from "../../components/kcp/KcpAction";

export function KCPpage() {
  const [isLoading, setLoading] = useState(true);
  const [kcp, setKcp] = useState([]);
  const [showModal, setShowModal] = useState({
    show: false,
    type: "",
    data: null,
  });
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [selectedData, setSelcetedData] = useState([]);
  const [resetChecklist, setResetChecklist] = useState(false);
  const [querySearch, setQuerySearch] = useState("");

  useEffect(() => {
    fetchKcp();
  }, []);

  // Fetch default data
  const fetchKcp = async () => {
    try {
      setLoading(true);
      const res = await api.get("/master/datMRt3");
      setKcp(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data by search query
  const fetchKcpBySearch = useCallback(async (query) => {
    try {
      setLoading(true);
      let res;
      if (!query.trim()) {
        res = await api.get("/master/datMRt3");
      } else {
        res = await api.get(`/master/filter-mrt3/${encodeURIComponent(query)}`);
      }
      setKcp(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchKcpBySearch(querySearch);
    }, 300);
    return () => clearTimeout(delay);
  }, [querySearch, fetchKcpBySearch]);

  const handleSearch = (query) => {
    setQuerySearch(query);
  };

  const handleAction = (type) => {
    switch (type) {
      case "ADD":
        setShowModal({ show: true, type, data: null });
        break;
      case "EDIT":
        if (selectedData.length !== 1) {
          setAlert({
            show: true,
            message:
              selectedData.length === 0
                ? "Please select a Data KCP to edit"
                : "Please select only one data to edit",
            type: "warning",
          });
          return;
        }
        setShowModal({ show: true, type, data: selectedData[0] });
        break;
      case "DELETE":
        if (selectedData.length !== 1) {
          setAlert({
            show: true,
            message:
              selectedData.length === 0
                ? "Please select a Data KCP to delete"
                : "Please select only one data to delete",
            type: "warning",
          });
          return;
        }
        setShowModal({ show: true, type, data: selectedData[0] });
        break;
      default:
        break;
    }
  };

  const handleOnAction = (val) => {
    fetchKcp();
    setAlert({ show: true, message: val, type: "success" });
    setShowModal({ show: false, type: "", data: null });
    setSelcetedData([]);
    setResetChecklist(true);
  };

  const handleSelectedData = (val) => {
    setSelcetedData(val);
  };

  const handleExport = () => {
    const exportCsv = async () => {
      try {
        const response = await api.post(`/master/export-mrt3`, kcp, {
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
          `dataMRt3_${querySearch ? querySearch : dateNow}.xlsx`
        );
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
    <div className="w-max-full">
      <Titlepage
        title="Data KCP"
        icon={MdOutlineLibraryAdd}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <LazyComponent />
      ) : (
        <div className="w-full table px-2">
          <div className="actions flex gap-2 items-center px-5 bg-white py-2 rounded-lg my-2">
            <button
              onClick={handleExport}
              className="border hover:bg-blue-600 hover:text-white border-blue-600 p-2 rounded-md text-green-800"
            >
              <PiMicrosoftExcelLogoFill size={21} />
            </button>
            <button
              onClick={() => handleAction("EDIT")}
              className="border hover:bg-blue-600 hover:text-white border-blue-600 p-2 text-xl rounded-md text-green-800"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleAction("DELETE")}
              className="border hover:bg-red-600 hover:text-white border-blue-600 p-2 text-xl rounded-md text-red-800"
            >
              <MdDeleteForever />
            </button>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <TableKCP
              data={kcp}
              selectedData={handleSelectedData}
              resetChecklist={resetChecklist}
            />
            <KcpAction
              isOpen={showModal.show}
              type={showModal.type}
              data={showModal.data}
              onClose={() =>
                setShowModal({ show: false, type: "", data: null })
              }
              onAction={handleOnAction}
            />
          </div>
        </div>
      )}

      {alert.show && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: "", message: "" })}
        />
      )}
    </div>
  );
}
