import { useEffect, useState } from "react";
import { Table } from "../../shared/Table";
import moment from "moment";

/* eslint-disable no-unused-vars */
export function TableCandra({
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
    { header: "Kode Checklist", key: "kode_checklist" },
    { header: "ID Proses", key: "idproses" },
    { header: "NIK", key: "nik" },
    { header: "QTY Image", key: "qty_image" },
    { header: "Nama Proses", key: "nama_proses" },
    { header: "Nama Karyawan", key: "nama_karyawan" },

    {
      header: "Tanggal",
      key: "tanggal",
      render: (val) => moment(val.tanggal).format("YYYY-MM-DD"),
    },
    { header: "Mulai", key: "mulai_formatted" },
    { header: "Selesai", key: "selesai_formatted" },
  ];
  return (
    <>
      <Table data={data} columns={columns} rowsPerPage={filter.perPage || 10} />
    </>
  );
}
