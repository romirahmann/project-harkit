/* eslint-disable no-unused-vars */
import { useCallback, useState } from "react";
import api from "../../services/axios.service";
import { FaFilePdf, FaFolderOpen } from "react-icons/fa";

export function CountFiles() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fecthTotalPDF = useCallback(async () => {
    setLoading(true);
    try {
      let res = await api.get(`/master/totalPDF`);

      setLoading(false);
      setData(res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  });

  useState(() => {
    fecthTotalPDF();
  }, [data]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
      number
    );
  };
  return (
    <>
      <div className="summary bg-gradient-to-r from-cyan-500 to-blue-500 p-10 rounded-2xl mt-5">
        <div className="flex rounded-lg mb-2 items-center">
          <span className=" text-2xl font-bold text-gray-50 uppercase">
            TOTAL FILE & FOLDER
          </span>
        </div>
        <div className="grafik grid grid-cols-1 lg:grid-cols-2 gap-2 ">
          <div className="max-w-full flex justify-between items-center p-6  bg-gray-200 border-gray-200 rounded-lg shadow-sm ">
            <FaFilePdf className="text-6xl mb-3 text-gray-800 " />
            <div className="desc">
              <a href="#">
                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-800  ">
                  Total Jumlah PDF
                </h5>
              </a>
              <p className="mb-3 text-5xl font-extrabold text-gray-800  ">
                {loading ? "Loading..." : formatNumber(data.totalPdf || 0)}
              </p>
            </div>
          </div>
          <div className="max-w-full flex justify-between items-center p-6 bg-gray-200 border border-gray-200 rounded-lg shadow-sm ">
            <FaFolderOpen className="text-6xl mb-3 text-gray-800 " />
            <div className="desc ">
              <a href="#">
                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-800 ">
                  Total Folder
                </h5>
              </a>
              <p className="mb-3 text-5xl font-extrabold text-gray-800 ">
                {loading ? "Loading..." : formatNumber(data.totalFolder || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
