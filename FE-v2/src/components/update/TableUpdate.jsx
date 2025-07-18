import { IoIosWarning } from "react-icons/io";
import { Table } from "../../shared/Table";

export function TableUpdate({
  data = [],

  filter = [],
}) {
  const columns = [
    { header: "Kode Checklist", key: "kode_checklist" },
    {
      header: "Not Finished",
      key: "proses",
      render: (row) => row.map((p) => p.nama_proses).join(", "),
    },
  ];
  return (
    <>
      <span className="text-xl font-bold flex items-center mt-2 my-10">
        <IoIosWarning className="text-red-700 me-3 text-2xl" />
        <span className="text-gray-800 ">SCAN PROSES BELUM SELESAI</span>
      </span>
      <Table data={data} columns={columns} rowsPerPage={filter.perPage || 10} />
    </>
  );
}
