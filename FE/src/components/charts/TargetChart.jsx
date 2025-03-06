import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function TargetChart() {
  const dataPie1 = {
    labels: ["Tercapai", "Belum Tercapai"],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ["#10B981", "#F59E0B"],
        hoverBackgroundColor: ["#059669", "#D97706"],
      },
    ],
  };

  const dataPie2 = {
    labels: ["Sudah Diproses", "Belum Diproses"],
    datasets: [
      {
        data: [50, 50],
        backgroundColor: ["#3B82F6", "#EF4444"],
        hoverBackgroundColor: ["#2563EB", "#DC2626"],
      },
    ],
  };

  return (
    <div className="  max-w-lg mx-auto">
      <div className="flex flex-col items-center gap-6">
        {/* Pie Chart 1 */}
        <div className="bg-gray-50 p-5 rounded-lg shadow w-full max-w-xs">
          <h3 className="text-lg font-semibold text-gray-600 mb-2 text-center">
            Target Scan Image
          </h3>
          <div className="w-60 h-60 mx-auto">
            <Pie data={dataPie1} />
          </div>
        </div>

        {/* Pie Chart 2 */}
        <div className="bg-gray-50 p-5 rounded-lg shadow w-full max-w-xs">
          <h3 className="text-lg font-semibold text-gray-600 mb-2 text-center">
            Target Scan Image
          </h3>
          <div className="w-60 h-60 mx-auto">
            <Pie data={dataPie2} />
          </div>
        </div>
      </div>
    </div>
  );
}
