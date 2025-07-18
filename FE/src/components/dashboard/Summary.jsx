/* eslint-disable no-unused-vars */
import moment from "moment";
import { useEffect, useState } from "react";
import { FaCalendarDay, FaImages } from "react-icons/fa";
import { MdDocumentScanner } from "react-icons/md";
import api from "../../services/axios.service";

export function Summary() {
  const [summary, setSummary] = useState([]);
  const [selectionDate, setSelectionDate] = useState("");

  useEffect(() => {
    fetchSummaryData();
  }, [selectionDate]);

  const fetchSummaryData = async () => {
    try {
      let res = await api.get(`/master/data-summary/${selectionDate}`);
      setSummary(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setSelectionDate(e.target.value);
  };
  const formatNumber = (number) => {
    return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
      number
    );
  };
  return (
    <>
      <div className="summary bg-cyan-600 p-10 mt-1 rounded-md ">
        <div className="flex rounded-lg mb-2 items-center">
          <span className=" text-2xl font-bold text-gray-50 uppercase">
            RINGKASAN PROSES
          </span>
          <div className="filterDate ms-auto flex items-center space-x-2">
            <span className="text-white me-2 rounded-md px-3">Start Date:</span>
            <input
              type="date"
              value={selectionDate}
              onChange={(e) => handleChange(e)}
              className=" p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 bg-white"
            />
          </div>
        </div>

        <div className="grafik grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Total Semua MR */}
          <div className="max-w-full p-6 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-200 rounded-lg shadow-sm ">
            <MdDocumentScanner className="text-2xl mb-3 text-gray-50" />
            <a href="#">
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-50 dark:text-white">
                Total Medical Record
              </h5>
            </a>
            <p className="mb-3 text-2xl font-normal text-gray-50 ">
              {formatNumber(summary?.totalMR || 0)}
            </p>
          </div>
          {/* Total Semua Lembar Scan */}
          <div className="max-w-full p-6 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-200 rounded-lg shadow-sm ">
            <MdDocumentScanner className="text-2xl mb-3 text-gray-50" />
            <a href="#">
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-50 dark:text-white">
                Total Semua Lembar Scan
              </h5>
            </a>
            <p className="mb-3 text-2xl font-normal text-gray-50 ">
              {formatNumber(summary?.image1003 || 0)}
            </p>
          </div>
          {/* Total Semua Image */}
          <div className="max-w-full p-6 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-200 rounded-lg shadow-sm ">
            <FaImages className="text-2xl mb-3 text-gray-50" />
            <a href="#">
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-50 dark:text-white">
                Total Semua Image
              </h5>
            </a>
            <p className="mb-3 text-2xl font-normal text-gray-50 ">
              {formatNumber(summary?.image1001 || 0)}
            </p>
          </div>
          {/* Total Jumlah Hari */}
          <div className="max-w-full p-6 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-200 rounded-lg shadow-sm ">
            <FaCalendarDay className="text-2xl mb-3 text-gray-50" />
            <a href="#">
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-50 dark:text-white">
                Total Jumlah Hari
              </h5>
            </a>
            <p className="mb-3 text-2xl font-normal text-gray-50 ">
              {summary?.dates || 0}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
