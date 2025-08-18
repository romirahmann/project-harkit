/* eslint-disable no-unused-vars */
import { MdOutlineLibraryAddCheck } from "react-icons/md";
import { Titlepage } from "../../shared/Titlepage";
import { useEffect, useState } from "react";
import { LazyComponent } from "../../shared/LazyComponent";
import { saveAs } from "file-saver";
import api from "../../services/axios.service";
import { FaFilePdf } from "react-icons/fa";
import { TableChecksheet } from "../../components/Checksheet/TableChecksheet";
import { AlertMessage } from "../../shared/AlertMessage";

export function ChecksheetPage() {
  const [dataMRt, setDataMRt] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchDataMRt();
  }, []);

  const fetchDataMRt = async () => {
    try {
      const res = await api.get(`/master/datMRt3`);
      let data = res.data.data;

      setDataMRt(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataFilter = async (q) => {
    try {
      let res = await api.get(`/master/filter-mrt3/${q}`);
      // console.log(res.data.data);
      let data = res.data.data;
      setDataMRt(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = (val) => {
    setQuery(val);
    fetchDataFilter(val);
  };

  const handleExportPDF = async (type) => {
    if (!query) {
      setAlert({
        show: true,
        message: "Please search a kode checklist of check sheet to export",
        type: "warning",
      });
    }
    switch (type) {
      case "QC":
        try {
          let res = await api.get(`/master/qc-checksheet/${query}`, {
            responseType: "blob",
          });

          let fileName = `QC Checksheet_${query}.pdf`;

          saveAs(new Blob([res.data], { type: "application/pdf" }), fileName);
        } catch (error) {
          console.log(error);
        }
        break;
      case "Finishing":
        try {
          let res = await api.get(`/master/finishing-checksheet/${query}`, {
            responseType: "blob",
          });

          let fileName = `Finishing Checksheet_${query}.pdf`;

          saveAs(new Blob([res.data], { type: "application/pdf" }), fileName);
        } catch (error) {
          console.log(error);
        }
        break;

      default:
        break;
    }
  };
  const handleSelectedData = () => {};
  return (
    <>
      <div className="max-w-full">
        <Titlepage
          title={`Data Checksheet`}
          icon={MdOutlineLibraryAddCheck}
          onSearch={handleSearch}
        />
        {isLoading ? (
          <LazyComponent />
        ) : (
          <div className="w-full table px-2 ">
            <div className="actions flex gap-2 items-center px-5 bg-white py-2 rounded-lg my-2">
              <div className="btn-add">
                <button
                  onClick={() => handleExportPDF("QC")}
                  className="border group hover:bg-blue-600 hover:text-white border-blue-600 p-2 flex gap-1 rounded-md  "
                >
                  <FaFilePdf
                    size={21}
                    className="text-red-800 group-hover:text-white "
                  />
                  <h1 className="group-hover:text-white">QC Checksheet</h1>
                </button>
              </div>
              <div className="btn-add">
                <button
                  onClick={() => handleExportPDF("Finishing")}
                  className="border group hover:bg-blue-600 hover:text-white border-blue-600 p-2 flex gap-1 rounded-md  "
                >
                  <FaFilePdf
                    size={21}
                    className="text-red-800 group-hover:text-white "
                  />
                  <h1 className="group-hover:text-white">
                    Finishing Checksheet
                  </h1>
                </button>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <TableChecksheet
                data={dataMRt}
                selectedData={handleSelectedData}
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
