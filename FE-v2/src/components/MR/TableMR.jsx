import { useEffect, useState } from "react";
import { Table } from "../../shared/Table";
import moment from "moment";

/* eslint-disable no-unused-vars */
export function TableMR({
  data = [],
  selectedData = [],
  filter = [],
  resetChecklist,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    selectedData(selectedRows);
  }, [selectedRows]);

  useEffect(() => {
    setSelectedRows([]);
  }, [resetChecklist]);

  const handleSelected = (row, checked) => {
    if (checked) {
      setSelectedRows((prev) => {
        const isExist = prev.some((item) => item.id === row.id);
        return isExist ? prev : [...prev, row];
      });
    } else {
      setSelectedRows((prev) => prev.filter((item) => item.id !== row.id));
    }
  };

  const columns = [
    {
      header: "",
      key: "__checkbox",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedRows.some(
            (item) =>
              item.Kode_Checklist === row.Kode_Checklist &&
              item.NoMR === row.NoMR
          )}
          onChange={(e) => {
            handleSelected(row, e.target.checked);
          }}
        />
      ),
    },
    { header: "Kode Checklist", key: "Kode_Checklist" },
    { header: "No MR", key: "NoMR" },
    { header: "Nama Pasien", key: "NamaPasien" },
    {
      header: "Tanggal",
      key: "Tanggal",
      render: (val) => moment(val.tanggal).format("DD-MM-YYYY"),
    },
    { header: "QTY Image", key: "Qty_Image" },
    { header: "Mulai", key: "Mulai" },
    { header: "Selesai", key: "Selesai" },
    { header: "File Path", key: "Filepath" },
  ];
  return (
    <>
      <Table data={data} columns={columns} rowsPerPage={filter.perPage || 10} />
    </>
  );
}
