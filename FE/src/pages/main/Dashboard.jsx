import { FaTachometerAlt } from "react-icons/fa";
import { Titlepage } from "../../shared/Titlepage";
import { Statistik } from "../../components/dashboard/Statistik";
import { Summary } from "../../components/dashboard/Summary";
import { ChartUtama } from "../../components/dashboard/ChartUtama";
import { TableRealTime } from "../../components/dashboard/TableRealTime";
import { TargetChart } from "../../components/dashboard/TargetChart";
import { CountFiles } from "../../components/dashboard/CountFiles";

export function Dashboard() {
  const handleSearch = () => {};
  return (
    <>
      <div className="max-w full">
        <Titlepage
          title={`Dashboard`}
          icon={FaTachometerAlt}
          onSearch={handleSearch}
        />

        <div className="statistik p-2">
          <Statistik />
        </div>
        <div className="summary p-2">
          <Summary />
        </div>
        <div className="countFIle ">
          <CountFiles />
        </div>
        <div className="progressChart p-2">
          <ChartUtama />
        </div>
        <div className="realTime">
          <div className="dashboard-3 grid grid-cols-1 lg:grid-cols-4 mt-1 p-2 gap-3">
            <div className="tblRealTime col-span-3 bg-white p-3 rounded-md">
              <TableRealTime />
            </div>
            <div className="pieChart col-span-1 ">
              <TargetChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
