const model = require("../../models/dashboard.model");
const api = require("../../tools/common");
const moment = require("moment");

const getTotalStatistik = async (req, res) => {
  try {
    // let dataTanggal = await model.cekDate();
    // return api.ok(res, dataTanggal);
    const { date } = req.params;
    if (!date) {
      return api.error(res, "Tanggal tidak boleh kosong");
    }
    const formattedDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
    console.log(formattedDate);
    const [total_kode_checklist, totalMR, totalNIK, totalImage, totalLembar] =
      await Promise.all([
        model.getTotalKodeChecklist(formattedDate),
        model.totalNoMR(formattedDate),
        model.totalNIKOnCandra(formattedDate),
        model.totalImage(formattedDate),
        model.totalLembar(formattedDate),
      ]);
    return api.ok(res, {
      total_kode_checklist,
      totalMR,
      totalNIK,
      totalImage,
      totalLembar,
    });
  } catch (err) {
    console.error("Error:", err);
    return api.error(res, "Internal Server Error", 500);
  }
};

const getSummaryData = async (req, res) => {
  try {
    const [image1003, image1001, dates] = await Promise.all([
      model.allImage1003(),
      model.allImage1001(),
      model.totalDates(),
    ]);

    return api.ok(res, { image1001, image1003, dates });
  } catch (err) {
    return api.error(res, "Internal Server Error", 500);
  }
};

const getDataPieChart = async (req, res) => {
  try {
    const [targetImage, targetHarian] = await Promise.all([
      model.targetImage(),
      model.targetHarian(),
    ]);
    return api.ok(res, { targetImage, targetHarian });
  } catch (err) {
    return api.error(res, "Internal Server Error", 500);
  }
};

const getChecklistCompletion = async (req, res) => {
  try {
    let dataProses = await model.getAllProses();
    let arrProses = dataProses.map((p) => `'${p.idproses}'`).join(", ");
    let prosesSelesai = await model.getDataRealTime(arrProses);

    return api.ok(res, prosesSelesai);
  } catch (err) {
    return api.error(res, "Internal Server Error", 500);
  }
};

const getDataProses = async (req, res) => {};

module.exports = {
  getTotalStatistik,
  getSummaryData,
  getDataPieChart,
  getChecklistCompletion,
};
