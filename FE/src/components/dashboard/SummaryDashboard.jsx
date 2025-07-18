/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FaCalendar, FaCalendarDay, FaImages } from "react-icons/fa";

import { MdDocumentScanner } from "react-icons/md";
import { ApiUrl } from "../../context/Urlapi";
import axios from "axios";

export function SummaryDashboard() {
  const [summary, setSummary] = useState([]);
  const [totalPDF, setTotalPDF] = useState([]);
  const baseUrl = useContext(ApiUrl);
  const [selectionDate, setSelectionDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fecthSummary();
  }, [selectionDate]);

  const fecthTotalPDF = useCallback(async () => {
    setLoading(true);
    try {
      let res = await axios.get(`${baseUrl}/master/totalPDF`);
      console.log(res.data.data);
      setLoading(false);
      setTotalPDF(res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  });

  useState(() => {
    fecthTotalPDF();
  }, [totalPDF]);

  const fecthSummary = async () => {
    try {
      // console.log(selectionDate);
      let res = await axios.get(
        `${baseUrl}/master/data-summary/${selectionDate}`
      );
      // console.log(res.data.data);
      let data = res.data.data;

      setSummary(data);
    } catch (err) {
      console.log(err);
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
      <div className="summary bg-cyan-600 p-10 rounded-2xl mt-5">
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

        <div className="grafik grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* Total Semua MR */}
          <div className="max-w-full px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <MdDocumentScanner className="text-2xl mb-3 text-gray-50" />
            <a href="#">
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-50 dark:text-white">
                Total Medical Record
              </h5>
            </a>
            <p className="mb-3 text-2xl font-normal text-gray-50 dark:text-gray-400">
              {formatNumber(summary?.totalMR || 0)}
            </p>
          </div>
          {/* Total Semua Lembar Scan */}
          <div className="max-w-full px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <MdDocumentScanner className="text-2xl mb-3 text-gray-50" />
            <a href="#">
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-50 dark:text-white">
                Total Semua Lembar Scan
              </h5>
            </a>
            <p className="mb-3 text-2xl font-normal text-gray-50 dark:text-gray-400">
              {formatNumber(summary?.image1003) || 0}
            </p>
          </div>
          {/* Total Semua Image */}
          <div className="max-w-full px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <FaImages className="text-2xl mb-3 text-gray-50" />
            <a href="#">
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-50 dark:text-white">
                Total Semua Image
              </h5>
            </a>
            <p className="mb-3 text-2xl font-normal text-gray-50 dark:text-gray-400">
              {formatNumber(summary?.image1001) || 0}
            </p>
          </div>
          {/* Total Jumlah Hari */}
          <div className="max-w-full px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <FaCalendarDay className="text-2xl mb-3 text-gray-50" />
            <a href="#">
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-50 dark:text-white">
                Total Jumlah Hari
              </h5>
            </a>
            <p className="mb-3 text-2xl font-normal text-gray-50 dark:text-gray-400">
              {summary?.dates}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
