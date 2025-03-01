/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { SearchComponent } from "../reuse/SearchComponent";
import { FaUsersGear, FaCirclePlus, FaTrash } from "react-icons/fa6";
import { motion } from "framer-motion";
import { ApiUrl } from "../../context/Urlapi";
import { RemoveModal } from "../reuse/RemoveModal";
import { FaEdit, FaTasks } from "react-icons/fa";

export function Proses() {
  const [proses, setProses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const baseUrl = useContext(ApiUrl);

  useEffect(() => {
    getProses();
  }, []);

  const getProses = async () => {
    await axios
      .get(`${baseUrl}/master/prosess`)
      .then((res) => {
        setProses(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemove = (user) => {
    showModalRemove ? setShowModalRemove(false) : setShowModalRemove(true);
    setSelectedUser(user);
  };
  return (
    <>
      <div className="container-fluid p-4 ">
        <div className="titlePage flex mb-3 items-center">
          <FaTasks className="text-3xl text-gray-700" />
          <h1 className="text-3xl ms-3 font-bold text-gray-700 dark:text-white">
            Data Proses
          </h1>
        </div>
        <div className="searchBar items-center flex my-2 mt-10">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <FaCirclePlus /> <span className="ms-2">Add</span>
          </button>
          <div className=" dark:bg-gray-900 ms-auto">
            <SearchComponent result={setFilteredData} data={proses} />
          </div>
        </div>
        <div className="prosesTable">
          <div className="relative overflow-x-auto sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-500 ">
              <thead className="text-xs font-bold text-gray-300 uppercase bg-[#043A70] dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 col-1">
                    No
                  </th>
                  <th scope="col" className="px-6 py-3 col-2">
                    ID Proses
                  </th>
                  <th scope="col" className="px-6 py-3 col-2">
                    Nama Proses
                  </th>
                  <th scope="col" className="px-6 py-3 col-2">
                    Urutan
                  </th>
                  <th scope="col" className="px-6 py-3 col-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData?.length > 0 ? (
                  paginatedData.map((proses, index) => (
                    <tr
                      key={proses.id}
                      className=" border-b dark:bg-gray-800 dark:border-gray-900 border-gray-300"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {index + 1}
                      </th>
                      <td className="px-6 py-4">{proses.idproses}</td>
                      <td className="px-6 py-4">{proses.nama_proses}</td>
                      <td className="px-6 py-4">{proses.urutan}</td>
                      <td className="px-6 py-4">
                        <button className="text-green-500 hover:bg-green-600 hover:text-white text-center font-medium px-1 py-1  rounded-md">
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleRemove(proses)}
                          className="text-red-600 hover:bg-red-600 hover:text-white text-center font-medium px-1 py-1  rounded-md"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center col-span-5 border-b dark:bg-gray-800 dark:border-gray-900 border-gray-300">
                    <td
                      colSpan={5}
                      className=" px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <p className="text-xl ">Data not found !</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <PaginationComponent
              setPaginatedData={setPaginatedData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              data={filteredData}
            />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          {" "}
          <RemoveModal
            isOpen={showModalRemove}
            onClose={() => setShowModalRemove(false)}
            data={selectedUser}
          />{" "}
        </motion.div>
      </div>
    </>
  );
}
