/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../../services/axios.service";
import { FcProcess } from "react-icons/fc";
import { Table } from "../../shared/Table";
import moment from "moment";

export function TableRealTime() {
  const [checklist, setChecklist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    fetchChecklist();
  }, []);

  useEffect(() => {
    const handleUpdate = (newData) => {
      fetchChecklist();
    };

    // socket.on("scan_created", handleUpdate);
    // socket.on("finished_process", handleUpdate);

    // // Cleanup listener ketika komponen unmount
    // return () => {
    //   socket.off("scan_created", handleUpdate);
    //   socket.off("finished_process", handleUpdate);
    // };
  }, []);

  const fetchChecklist = async () => {
    try {
      let res = await api.get(`/master/realtime-proses`);

      let data = res.data.data;

      setChecklist(data);
    } catch (err) {
      console.log("Error fetching checklist:", err);
    }
  };

  const handleQuery = (query) => {
    setQuery(query);
  };

  const columns = [
    { header: "Kode Checklist", key: "kode_checklist" },
    // {
    //   header: "Finished",
    //   key: "idproses_array",
    //   render: (val) => console.log(val),
    // },
    {
      header: "Finished",
      key: "idproses_array",
      render: (val) =>
        val && val.length > 0
          ? val.map((item) => item.nama_proses).join(", ")
          : "-",
    },
    {
      header: "On Progress",
      key: "belum_dijalankan",
      render: (val) =>
        val && val.length > 0
          ? val.map((item) => item.nama_proses).join(", ")
          : "-",
    },
  ];

  return (
    <>
      <div className="container-fluid p-5">
        <div className="filter flex my-2">
          <div className="flex items-center text-2xl mb-4">
            <FcProcess />
            <span className="font-bold ms-3 uppercase">Real Time Proses</span>
          </div>
        </div>

        <div className="relative overflow-x-auto sm:rounded-lg">
          <Table
            data={checklist}
            columns={columns}
            rowsPerPage={filter.perPage || 10}
          />
        </div>
      </div>
    </>
  );
}
