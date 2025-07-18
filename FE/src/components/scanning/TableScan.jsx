/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { useEffect, useRef, useState } from "react";
import { Table } from "../../shared/Table";
import api from "../../services/axios.service";
import moment from "moment";
import { useAuth } from "../../store/AuthContext";
import { Modal } from "../../shared/Modal";

export function TableScan({ data = [], selectedProses, onAlert }) {
  const [countShow, setCountShow] = useState(10);
  const [proses, setProses] = useState([]);
  const { user } = useAuth();
  const idprosesFromSession = sessionStorage.getItem("idproses");
  const [modalIsOpen, setOpenModal] = useState({
    isOpen: false,
    title: "",
  });
  const [selectedRow, setSelectedRow] = useState("");
  const [formQty, setFormQty] = useState({
    qty_image: 0,
  });
  const qtyImageRef = useRef(null);

  const [selectedProsesId, setSelectedProsesId] = useState(
    idprosesFromSession || "All"
  );

  useEffect(() => {
    fetchProses();

    if (idprosesFromSession) {
      selectedProses(idprosesFromSession);
    }
  }, []);

  const fetchProses = async () => {
    try {
      let res = await api.get(`/master/prosess`);
      setProses(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setSelectedProsesId(value);
    selectedProses(value);
  };

  const handleSelesai = async (row) => {
    const timestamp = moment().format("HH:mm:ss");
    let newData = {
      ...row,
      editBy: user.username,
      selesai_formatted: timestamp,
    };

    if (newData) {
      try {
        await api.put(
          `/master/finish-proses/${row.kode_checklist}/${row.idproses}`,
          newData
        );
        onAlert(`${row.kode_checklist} telah selesai dikerjakan!`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormQty((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitQty = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/master/finish-proses-scan/${selectedRow?.kode_checklist}/${selectedRow?.idproses}`,
        formQty
      );
      onAlert("Berhasil menambahkan qty!");
      setOpenModal({
        isOpen: false,
        title: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { header: "Kode Checklist", key: "kode_checklist" },
    { header: "ID Proses", key: "idproses" },
    { header: "Nama Proses", key: "nama_proses" },
    { header: "Nama Karyawan", key: "nama_karyawan" },
    { header: "Mulai", key: "mulai_formatted" },
    {
      header: "Selesai",
      key: "selesai_formatted",
      render: (val, row) => {
        if (val === "00:00:00" && row.idproses === "1003") {
          return (
            <button
              onClick={() => {
                setOpenModal({
                  isOpen: true,
                  title: "Input QTY Proses Scan",
                });
                setSelectedRow(row);
              }}
              className="px-3 py-1 bg-blue-800 text-white rounded-lg"
            >
              Input QTY
            </button>
          );
        }

        if (val === "00:00:00") {
          return (
            <button
              onClick={() => handleSelesai(row)}
              className="px-3 py-1 bg-blue-800 text-white rounded-lg"
            >
              Selesai
            </button>
          );
        }

        return val;
      },
    },
    {
      header: "Lembar Scan",
      key: "qty_image",
      render: (val) => (val === 0 ? "" : val),
    },
  ];

  return (
    <>
      <div className=" overflow-auto ">
        <h2 className="text-2xl text-center font-semibold mb-4">
          SCAN SELESAI
        </h2>
        <div className="header flex">
          <div className="showItem">
            <label htmlFor="itemShow" className="text-gray-600 me-2">
              Show:
            </label>
            <select
              id="itemShow"
              className="px-2 py-1 border border-gray-300 rounded"
              value={countShow}
              onChange={(e) => {
                setCountShow(Number(e.target.value));
              }}
            >
              {[10, 20, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          {/* Input show id */}
          <div className="mb-4 flex items-center ms-auto">
            <div className="showItem mx-3">
              <label htmlFor="idProsesFilter" className="text-gray-600 me-2">
                ID Proses:
              </label>
              <select
                id="idProsesFilter" // Change id to be unique
                className="px-2 py-1 border border-gray-300 rounded"
                value={selectedProsesId} // Gunakan state `selectedProsesId` sebagai `value`
                onChange={handleFilterChange}
              >
                <option value="ALL">All</option>
                {proses.map((value) => (
                  <option key={value.idproses} value={value.idproses}>
                    {value.idproses}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <Table data={data} columns={columns} rowsPerPage={countShow} />
      </div>
      <Modal
        isOpen={modalIsOpen.isOpen}
        title={`${modalIsOpen.title} `}
        onClose={() =>
          setOpenModal({
            isOpen: false,
            title: "",
            data: [],
          })
        }
      >
        <form onSubmit={handleSubmitQty} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Kode Checklist</label>
            <input
              type="text"
              name="kode_checklist"
              value={selectedRow.kode_checklist || ""}
              onChange={(e) => handleOnChange(e)}
              disabled
              className="w-full border-gray-100 p-2 border rounded-lg bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ID Proses</label>
            <input
              type="text"
              name="idproses"
              value={selectedRow.idproses || ""}
              onChange={(e) => handleOnChange(e)}
              disabled
              className="w-full p-2 border border-gray-100 rounded-lg bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Qty Images</label>
            <input
              type="number"
              name="qty_image"
              ref={qtyImageRef}
              onChange={(e) => handleOnChange(e)}
              className="w-full p-2 border border-gray-200 rounded-lg "
            />
          </div>
          <button className="px-2 py-1 bg-blue-700 hover:bg-blue-800 rounded-md text-white text-md">
            {" "}
            Submit{" "}
          </button>
        </form>
      </Modal>
    </>
  );
}
