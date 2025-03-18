const model = require("../../models/dashboard.model");
const api = require("../../tools/common");
const moment = require("moment");

const getTotalStatistik = async (req, res) => {
  try {
    const { date } = req.params;
    if (!date) {
      return api.error(res, "Tanggal tidak boleh kosong");
    }
    const formattedDate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
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

const getDataRealTime = async (req, res) => {
  try {
    // Ambil data dari model
    const rowsCandra = await model.getCandraData();
    const rowsProses = await model.getProsesData();

    // Buat mapping idproses dari tblproses
    const prosesMap = new Map(
      rowsProses.map((row) => [row.idproses, row.nama_proses])
    );

    // Mengelompokkan data berdasarkan kode_checklist
    const grouped = {};

    rowsCandra.forEach((row) => {
      const { kode_checklist, idproses, selesai } = row;

      if (!grouped[kode_checklist]) {
        grouped[kode_checklist] = {
          kode_checklist,
          total_idproses: 0,
          idproses_array: [],
          belum_dijalankan: [], // Akan diisi nanti
        };
      }

      if (selesai !== "00:00:00") {
        // Jika proses sudah selesai, masukkan ke idproses_array
        grouped[kode_checklist].total_idproses += 1;
        grouped[kode_checklist].idproses_array.push({
          idproses,
          nama_proses: prosesMap.get(idproses) || "Tidak Diketahui",
        });
      } else {
        // Jika selesai = "00:00:00", masukkan ke belum_dijalankan
        grouped[kode_checklist].belum_dijalankan.push({
          idproses,
          nama_proses: prosesMap.get(idproses) || "Tidak Diketahui",
        });
      }
    });

    // Cek idproses yang belum dijalankan dari tblproses
    Object.values(grouped).forEach((group) => {
      const idDijalankan = new Set(
        group.idproses_array.map((item) => item.idproses)
      );

      // Tambahkan proses yang tidak ditemukan di tblcandra ke belum_dijalankan
      const prosesBelumDijalankan = rowsProses
        .filter((proses) => !idDijalankan.has(proses.idproses))
        .map((proses) => ({
          idproses: proses.idproses,
          nama_proses: proses.nama_proses,
        }));

      group.belum_dijalankan.push(...prosesBelumDijalankan);
    });

    const filteredResult = Object.values(grouped).filter(
      (group) => group.total_idproses < 6
    );

    return api.ok(res, filteredResult);
  } catch (error) {
    return api.error(res, "Internal Server Error", 500);
  }
};

const getDatesInMonth = (params) => {
  const daysInMonth = moment(params, "YYYY-MM").daysInMonth();
  const datesArray = [];

  for (let day = 1; day <= daysInMonth; day++) {
    datesArray.push(
      moment(`${params}-${day}`, "YYYY-MM-D").format("YYYY-MM-DD")
    );
  }

  return datesArray;
};

const getDataPrimaryChart = async (req, res) => {
  try {
    const { monthSelected } = req.params;

    let targets = await model.getAllTarget();
    let dates = getDatesInMonth(monthSelected);
    const data1 = await model.getQtyImage(1001, monthSelected);
    const data2 = await model.getQtyImage(1003, monthSelected);

    // Konversi data1 dan data2 menjadi object dengan tanggal sebagai key
    const data1Map = Object.fromEntries(
      data1.map((item) => [
        moment(item.tanggal, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD"),
        item.total_qty,
      ])
    );

    const data2Map = Object.fromEntries(
      data2.map((item) => [
        moment(item.tanggal, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD"),
        item.total_qty,
      ])
    );

    // Gunakan map untuk mengambil nilai dari data1Map & data2Map berdasarkan dates
    const values1 = dates.map((date) => data1Map[date] ?? null);
    const values2 = dates.map((date) => data2Map[date] ?? null);

    return api.ok(res, { targets, dates, values1, values2 });
  } catch (err) {
    return api.error(res, err, 500);
  }
};

module.exports = {
  getTotalStatistik,
  getSummaryData,
  getDataPieChart,
  getDataPrimaryChart,
  getDataRealTime,
};
