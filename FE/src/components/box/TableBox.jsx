/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Table } from "../../shared/Table";

export function TableBox({
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
          checked={selectedRows.some((item) => item.id === row.id)}
          onChange={(e) => {
            handleSelected(row, e.target.checked);
          }}
        />
      ),
    },
    { header: "Nomor Box", key: "NoBox" },
    { header: "NoMR", key: "NoMR" },
    { header: "Nama Pasien", key: "NamaPasien" },
    { header: "Kode Checklist", key: "Kode_Checklist" },
  ];
  return (
    <>
      <Table data={data} columns={columns} rowsPerPage={filter.perPage || 10} />
    </>
  );
}
