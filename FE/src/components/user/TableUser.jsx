/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { Table } from "../../shared/Table";

export function TableUser({
  data = [],
  selectedData,
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
      header: (
        <input
          type="checkbox"
          checked={selectedRows.length === data.length && data.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
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
    { header: "Username", key: "username" },
    { header: "Email", key: "email" },
    { header: "Jabatan", key: "jabatan" },
  ];

  return (
    <Table data={data} columns={columns} rowsPerPage={filter.perPage || 10} />
  );
}
