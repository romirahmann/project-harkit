/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { ApiUrl } from "../../context/Urlapi";

import { FaTachometerAlt } from "react-icons/fa";

import ChartComponent from "../charts/GrafikUtama";

import { TargetChart } from "../charts/TargetChart";
import { SummaryDashboard } from "../charts/SummaryDashboard";
import { StatistikDashboard } from "../charts/StatistikDashboard";

export function Dashboard() {
  const baseUrl = useContext(ApiUrl);

  return (
    <>
      <div className="container-fluid p-4">
        <div className="titlePage flex mb-3 items-center">
          <FaTachometerAlt className="text-3xl text-gray-700" />
          <h1 className="text-3xl ms-3 font-bold text-gray-700 dark:text-white">
            Dashboard
          </h1>
        </div>

        <div className="content mt-10">
          <StatistikDashboard />
        </div>

        <div className="content-2">
          <div className="dashboard-2 grid grid-cols-4 mt-10 gap-3">
            <div className="firstChart col-span-3">
              <ChartComponent />
            </div>
            <div className="pieChart col-span-1">
              <TargetChart />
            </div>
          </div>
        </div>

        <div className="content-3">
          <div className="dashboard-3 grid grid-cols-4 mt-10 gap-3">
            <div className="summary ">
              <SummaryDashboard />
            </div>
            <div className="tblRealTime col-span-3 bg-white p-3 rounded-md">
              <h1>table real time</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
