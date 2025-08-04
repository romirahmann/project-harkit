import { useEffect, useState } from "react";
import { Table } from "../../shared/Table";

/* eslint-disable no-unused-vars */
export function TableKCP({
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

  const isSameRow = (a, b) =>
    a.NoUrut === b.NoUrut && a.Kode_Checklist === b.Kode_Checklist;

  const handleSelected = (row, checked) => {
    if (checked) {
      setSelectedRows((prev) => {
        const isExist = prev.some((item) => isSameRow(item, row));
        return isExist ? prev : [...prev, row];
      });
    } else {
      setSelectedRows((prev) => prev.filter((item) => !isSameRow(item, row)));
    }
  };

  const columns = [
    {
      header: "",
      key: "__checkbox",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedRows.some((item) => isSameRow(item, row))}
          onChange={(e) => {
            handleSelected(row, e.target.checked);
          }}
        />
      ),
    },
    { header: "No Urut", key: "NoUrut" },
    { header: "Kode Checklist", key: "Kode_Checklist" },
    { header: "No MR", key: "NoMR" },

    { header: "Nama Pasien", key: "NamaPasien" },
    { header: "Tanggal", key: "Tanggal" },
    { header: "Periode Ranap", key: "Periode_Ranap" },
    { header: "Nama Dokumen", key: "namadokumen" },
  ];

  return (
    <>
      <Table columns={columns} data={data} rowsPerPage={filter.perPage || 10} />
    </>
  );
}
