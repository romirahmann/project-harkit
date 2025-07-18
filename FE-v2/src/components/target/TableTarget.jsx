import { useEffect, useState } from "react";
import { Table } from "../../shared/Table";

/* eslint-disable no-unused-vars */
export function TableTarget({
  data = [],
  selectedData = [],
  filter = [],
  resetChecklist,
}) {
  const [selectedRows, setSelectedRows] = useState([]);

  // ⛳️ Notifikasi ke parent setelah state berubah
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

  const handleSelectAll = (checked) => {
    const updated = checked ? data : [];
    setSelectedRows(updated);
  };

  const columns = [
    {
      header: "",
      key: "__checkbox",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedRows.some((item) => item.id === row.id)}
          onChange={(e) => {
            handleSelected(row, e.target.checked);
          }}
        />
      ),
    },
    { header: "Rincian Target", key: "nama" },
    { header: "Nilai", key: "nilai" },
  ];

  return (
    <Table data={data} columns={columns} rowsPerPage={filter.perPage || 10} />
  );
}
