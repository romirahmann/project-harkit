/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = () => {
  const [datasetVisibility, setDatasetVisibility] = useState({});

  const labels = ["2025-03-01", "2025-03-02", "2025-03-03", "2025-03-04"];
  const values1 = [10, 15, null, 25];
  const values2 = [5, 20, 30, null];
  const target_lembar_scan = 50;
  const target_qty_image = 40;

  const filledValues1 = values1.map((val) =>
    val !== null && val !== 0 ? val : null
  );
  const filledValues2 = values2.map((val) =>
    val !== null && val !== 0 ? val : null
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Qty Image",
        data: filledValues1,
        backgroundColor: "#00008B",
        borderColor: "#00008B",
        borderWidth: 1,
        spanGaps: false,
      },
      {
        label: "Target Qty Image",
        data: Array(labels.length).fill(target_qty_image),
        borderColor: "red",
        type: "line",
        fill: false,
        borderWidth: 1,
        borderDash: [5, 5],
        spanGaps: true,
      },
      {
        label: "Qty Lembar Scan",
        data: filledValues2,
        backgroundColor: "black",
        borderColor: "black",
        borderWidth: 1,
        spanGaps: false,
      },
      {
        label: "Target Lembar Scan",
        data: Array(labels.length).fill(target_lembar_scan),
        borderColor: "#800000",
        type: "line",
        fill: false,
        borderWidth: 2,
        borderDash: [5, 5],
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const newVisibility = {
            ...datasetVisibility,
            [index]: !datasetVisibility[index],
          };
          setDatasetVisibility(newVisibility);
          legend.chart.getDatasetMeta(index).hidden = newVisibility[index];
          legend.chart.update();
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <div className="headerChart flex items-center mb-10">
        <h2 className="text-2xl text-center font-bold ">GRAFIK JUMLAH IMAGE</h2>
        <div className="ms-auto">
          <input
            type="month"
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 bg-white "
          />
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
