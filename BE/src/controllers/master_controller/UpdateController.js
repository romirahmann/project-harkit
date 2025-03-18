const api = require("../../tools/common");
const modelUpdate = require("../../models/update.model");
const modelCandra = require("../../models/candra.model");
const modelMR = require("../../models/mr.model");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filename = req.file.originalname;

    if (filename === "dbData.mdb") {
      let newDataCandra = await modelUpdate.getAllCandra();
      let newDataMR = await modelUpdate.getAllDataMR();
      let newDataMR3 = await modelUpdate.getAllDataMR3();

      // console.log("Candra: ", newDataCandra);
      // console.log("MR: ", newDataMR);
      // console.log("MRt3: ", newDataMR3);

      // UPDATE DATA CANDRA
      for (const candra of newDataCandra) {
        const existing = await modelCandra.dataExisting(
          candra.kode_checklist,
          candra.idproses
        );

        // console.log(existing);

        if (!existing) {
          try {
            await modelCandra.createCandra(candra);
          } catch (err) {
            console.log(err);
          }
        }
      }
      console.log("CANDRA UPDATE SUCCESSFULLY!");

      // UPDATE DATA MR
      for (const dataMR of newDataMR) {
        const existing = await modelMR.dataExisting(
          dataMR.NoUrut,
          dataMR.Kode_Checklist
        );

        if (!existing) {
          await modelMR.createDataMR(dataMR);
        }
      }
      console.log("MR UPDATE SUCCESSFULLY!");

      // UPDATE MRT3
      for (const dataMR3 of newDataMR3) {
        const existing = await modelMR.dataExistingT3(
          dataMR3.NoUrut,
          dataMR3.Kode_Checklist
        );

        if (!existing) {
          await modelMR.createDataMRt3(dataMR3);
        }
      }
      console.log("MRT3 UPDATE SUCCESSFULLY!");
      return api.ok(res, "Update All Data Successfully!");
    }

    if (filename === "dbQty.mdb") {
      let newData = await modelUpdate.getQty();
      for (const data of newData) {
        const existing = await modelMR.dataExistingByMR(data.NoMR);
        if (existing) {
          console.log("UPDATE MR");
          await modelMR.updateQtyMR(data);
        }
      }
      const dataQTY = await modelMR.getQtyByMR();
      if (!dataQTY) {
        return api.error(res, "No Data on Table MR", 400);
      }

      for (const qty of dataQTY) {
        await modelCandra.updateCandraByMR(qty);
      }

      return api.ok(res, "UPDATE QTY SUCCESFULLY!");
    }

    return api.error(res, "Please Upload File dbData.mdb or dbQty.mdb");
  } catch (err) {
    console.log(err);
    return api.error(res, "Internal Server Error", 500);
  }
};

module.exports = { uploadFile };
