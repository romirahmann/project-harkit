import { useEffect, useState } from "react";
import { Table } from "../../shared/Table";

/* eslint-disable no-unused-vars */
export function TableDokumen({
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
        const isExist = prev.some((item) => item.kodedok === item.kodedok);
        return isExist ? prev : [...prev, row];
      });
    } else {
      setSelectedRows((prev) =>
        prev.filter((item) => item.kodedok !== row.kodedok)
      );
    }
  };
  const columns = [
    {
      header: "",
      key: "__checkbox",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedRows.some((item) => item.kodedok === row.kodedok)}
          onChange={(e) => {
            handleSelected(row, e.target.checked);
          }}
        />
      ),
    },
    { header: "Kode Dokumen", key: "kodedok" },
    { header: "Nama Dokumen", key: "namadok" },
    { header: "Kategori", key: "Kategori" },
  ];
  return (
    <>
      <Table data={data} columns={columns} rowsPerPage={filter.perPage || 10} />
    </>
  );
}
