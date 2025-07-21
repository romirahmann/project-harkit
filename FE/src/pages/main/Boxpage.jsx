/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Titlepage } from "../../shared/Titlepage";
import { TbTargetArrow } from "react-icons/tb";

export function Boxpage() {
  const [isLoading, setLoading] = useState(true);
  const [targets, setTarget] = useState([]);
  const [showModal, setShowModal] = useState({
    show: false,
    type: "",
    data: null,
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [selectedData, setSelcetedData] = useState([]);
  const [resetChecklist, setResetChecklist] = useState(false);

  const handleSearch = () => {};

  return (
    <>
      <div className="w-max-full">
        <Titlepage
          title={`Data Target`}
          icon={TbTargetArrow}
          onSearch={handleSearch}
        />
      </div>
    </>
  );
}
