const model = require("../../models/mr.model");
const api = require("../../tools/common");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");
const bwipJs = require("bwip-js");
const PdfPrinter = require("pdfmake");
const { table } = require("console");
const moment = require("moment");

const getAllDataMR = async (req, res) => {
  try {
    const data = await model.getAllDataMR();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting DataMR:", error);
    return api.error(res, "Failed to get DataMR", 500);
  }
};

const getDataMRByKeys = async (req, res) => {
  let { nourut, kode_checklist } = req.params;

  nourut = nourut.replace(/'/g, "''");
  kode_checklist = kode_checklist.replace(/'/g, "''");

  if (!nourut || !kode_checklist)
    return api.error(res, "NoUrut and Kode_Checklist are required", 400);

  try {
    const data = await model.getDataMRByKeys(nourut, kode_checklist);
    if (!data) return api.error(res, "DataMR not found", 404);
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting DataMR by keys:", error);
    return api.error(res, "Failed to get DataMR", 500);
  }
};

const createDataMR = async (req, res) => {
  const {
    NoUrut,
    NoMR,
    NamaPasien,
    Tanggal,
    Qty_Image,
    Kode_Checklist,
    Urut,
    Mulai,
    Selesai,
    rumahsakit,
    nobox,
    filePath,
  } = req.body;

  if (
    !NoUrut ||
    !Kode_Checklist ||
    !NoMR ||
    !NamaPasien ||
    !Tanggal ||
    !Qty_Image ||
    !Urut ||
    !Mulai ||
    !Selesai ||
    !rumahsakit ||
    !nobox ||
    !filePath
  ) {
    return api.error(res, "All fields are required", 400);
  }

  try {
    const result = await model.createDataMR(req.body);
    if (result > 0) return api.ok(res, "DataMR successfully added");
    return api.error(res, "Failed to add DataMR", 500);
  } catch (error) {
    console.error("❌ Error creating DataMR:", error);
    return api.error(res, "Failed to add DataMR", 500);
  }
};

const updateDataMR = async (req, res) => {
  const { nourut, kode_checklist } = req.params;
  const { NoMR, NamaPasien, Tanggal, nobox } = req.body;

  if (!nourut || !kode_checklist) {
    return api.error(res, "NoUrut and Kode_Checklist are required", 400);
  }

  if (!NoMR || !NamaPasien || !Tanggal || !nobox) {
    return api.error(
      res,
      "All fields (NoMR, NamaPasien, Tanggal, nobox) are required",
      400
    );
  }

  try {
    const result = await model.updateDataMR(nourut, kode_checklist, {
      NoMR,
      NamaPasien,
      Tanggal,
      nobox,
    });

    if (result > 0) {
      return api.ok(res, "Data MR successfully updated");
    }

    return api.error(res, "Failed to update Data MR", 500);
  } catch (error) {
    console.error("❌ Error updating Data MR:", error);
    return api.error(res, "An error occurred while updating Data MR", 500);
  }
};

const deleteDataMR = async (req, res) => {
  const { nourut, kode_checklist } = req.params;
  if (!nourut || !kode_checklist)
    return api.error(res, "NoUrut and Kode_Checklist are required", 400);

  try {
    const result = await model.deleteDataMR(nourut, kode_checklist);
    if (result > 0) return api.ok(res, "DataMR successfully deleted");
    return api.error(res, "Failed to delete DataMR", 500);
  } catch (error) {
    console.error("❌ Error deleting DataMR:", error);
    return api.error(res, "Failed to delete DataMR", 500);
  }
};

const exportCsv = async (req, res) => {
  const { Kode_Checklist } = req.params;
  try {
    console.log(Kode_Checklist);
    let data;
    if (Kode_Checklist !== null) {
      data = await model.getDataMRByChecklist(Kode_Checklist);
      // console.log(data);
    } else {
      data = await model.getAllMRt3();
      // console.log(data);
    }
    if (data.length === 0) {
      return api.error(res, "Data Not Found!", 400);
    }

    // Definisikan kolom yang akan diekspor
    const fields = [
      "NoUrut",
      "NoMR",
      "Kode_Checklist",
      "NamaPasien",
      "Tanggal",
      "Qty_Image",
      "Urut",
      "Mulai",
      "Selesai",
      "nobox",
      "rumahsakit",
      "FilePath",
    ];
    // Konversi data ke CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
    // Simpan CSV ke file sementara
    const filePath = path.join(__dirname, "../../exports/candra_export.csv");
    fs.writeFileSync(filePath, csv);

    // Kirim file CSV ke client
    res.download(filePath, "data_MR.csv", (err) => {
      if (err) {
        console.error("Error saat mengirim file:", err);
        res.status(500).json({ message: "Gagal mengunduh file" });
      }

      // Hapus file setelah dikirim (opsional)
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("❌ Error exporting CSV:", error);
    return api.error(res, "Failed to export CSV", 500);
  }
};

// MRT 3
const getAllDataMRt3 = async (req, res) => {
  try {
    const data = await model.getAllMRt3();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting DataMR:", error);
    return api.error(res, "Failed to get DataMR", 500);
  }
};

const generateFinishinCheecksheet = async (req, res) => {
  try {
    const { kode_checklist } = req.params;
    if (!kode_checklist)
      return res.status(400).json({ message: "Kode checklist diperlukan!" });

    // 🔍 Ambil data dari database
    let data = await model.getMRt3ByKodeChecklist(kode_checklist);
    if (!data || data.length === 0)
      return res.status(404).json({ message: "Data tidak ditemukan!" });

    // 🖋️ Definisi font yang benar
    const fonts = {
      Roboto: {
        normal: path.resolve("src/fonts/Roboto-Regular.ttf"),
        bold: path.resolve("src/fonts/Roboto-Bold.ttf"),
        italics: path.resolve("src/fonts/Roboto-Italic.ttf"),
        bolditalics: path.resolve("src/fonts/Roboto-BoldItalic.ttf"),
      },
    };

    // 🖨️ Inisialisasi PdfPrinter
    const printer = new PdfPrinter(fonts);

    // 🏷️ Generate Barcode
    let barcodeBase64 = null;
    try {
      const barcodeBuffer = await bwipJs.toBuffer({
        bcid: "code39",
        text: kode_checklist,
        scale: 3,
        height: 20,
        includetext: true,
        textxalign: "center",
      });

      barcodeBase64 = `data:image/png;base64,${barcodeBuffer.toString(
        "base64"
      )}`;
    } catch (err) {
      console.error("⚠️ Gagal membuat barcode:", err);
    }

    // Pastikan barcode valid, jika tidak, tampilkan teks alternatif
    const barcodeImage = barcodeBase64
      ? { image: barcodeBase64, width: 150, alignment: "right" }
      : {
          text: "Barcode tidak tersedia",
          style: "subheader",
          alignment: "right",
        };

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [20, 40, 20, 40],
      content: [
        { text: "FINISHING CHECK SHEET", style: "header" },

        {
          table: {
            widths: ["70%", "30%"],
            body: [
              [
                {
                  text: `Kode Checklist: ${kode_checklist}`,
                  style: "table",
                  alignment: "left",
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [0, 10, 0, 0],
        },

        {
          table: {
            widths: ["45%", "15%", "40%"],
            body: [
              [
                {
                  table: {
                    widths: ["*", "*", "*", "*", "*"],
                    body: [
                      [
                        {
                          text: "Proses",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 9,
                        },
                        {
                          text: "Nama",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 9,
                        },
                        {
                          text: "Tanggal",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 9,
                        },
                        {
                          text: "Mulai",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 9,
                        },
                        {
                          text: "Selesai",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 9,
                        },
                      ],
                      [{ text: "QC Image", fontSize: 9 }, "", "", "", ""],
                    ],
                    alignment: "left",
                    style: "table",
                  },
                },
                "",
                barcodeImage,
              ],
            ],
          },
          layout: "noBorders",
        },

        // 📌 Table Utama (Data)
        {
          table: {
            widths: ["10%", "12%", "20%", "10%", "15%", "18%", "12%"],
            body: [
              [
                { text: "No Urut", bold: true, fillColor: "#D3D3D3" },
                { text: "NO MR", bold: true, fillColor: "#D3D3D3" },
                { text: "Nama Pasien", bold: true, fillColor: "#D3D3D3" },
                { text: "Layanan", bold: true, fillColor: "#D3D3D3" },
                { text: "Tanggal", bold: true, fillColor: "#D3D3D3" },
                { text: "Nama Dokumen", bold: true, fillColor: "#D3D3D3" },
                { text: "Cek Finishing", bold: true, fillColor: "#D3D3D3" },
              ],
              ...data.map((item) => [
                item.NoUrut || "-",
                item.NoMR || "-",
                item.NamaPasien || "-",
                item.Layanan || "-",
                moment(item.Tanggal, "DDMMYYYY").format("DD-MM-YYYY") || "-",
                item.namadokumen || "-",
                "",
              ]),
            ],
          },
          margin: [0, 10, 0, 0], //
          style: "table",
        },
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },

        table: {
          fontSize: 9,
        },
      },
    };

    // 📄 Generate PDF dan kirim langsung ke response
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Finishing_Checklist_${kode_checklist}.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) {
    console.error("❌ Error generate Finishing Checksheet:", err);
    return api.error(res, "Internal Server Error", 500);
  }
};

const generateQcChecksheet = async (req, res) => {
  try {
    const { kode_checklist } = req.params;
    if (!kode_checklist)
      return res.status(400).json({ message: "Kode checklist diperlukan!" });

    // 🔍 Ambil data dari database
    let data = await model.getMRt3ByKodeChecklist(kode_checklist);
    if (!data || data.length === 0)
      return res.status(404).json({ message: "Data tidak ditemukan!" });

    // 🖋️ Definisi font yang benar
    const fonts = {
      Roboto: {
        normal: path.resolve("src/fonts/Roboto-Regular.ttf"),
        bold: path.resolve("src/fonts/Roboto-Bold.ttf"),
        italics: path.resolve("src/fonts/Roboto-Italic.ttf"),
        bolditalics: path.resolve("src/fonts/Roboto-BoldItalic.ttf"),
      },
    };

    // 🖨️ Inisialisasi PdfPrinter
    const printer = new PdfPrinter(fonts);

    // 🏷️ Generate Barcode
    let barcodeBase64 = null;
    try {
      const barcodeBuffer = await bwipJs.toBuffer({
        bcid: "code39",
        text: kode_checklist,
        scale: 3,
        height: 20,
        includetext: true,
        textxalign: "center",
      });

      barcodeBase64 = `data:image/png;base64,${barcodeBuffer.toString(
        "base64"
      )}`;
    } catch (err) {
      console.error("⚠️ Gagal membuat barcode:", err);
    }

    // Pastikan barcode valid, jika tidak, tampilkan teks alternatif
    const barcodeImage = barcodeBase64
      ? { image: barcodeBase64, width: 150, alignment: "right" }
      : {
          text: "Barcode tidak tersedia",
          style: "subheader",
          alignment: "right",
        };

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [20, 40, 20, 40],
      content: [
        { text: "QC CHECK SHEET", style: "header" },

        {
          table: {
            widths: ["70%", "30%"],
            body: [
              [
                {
                  text: `Kode Checklist: ${kode_checklist}`,
                  style: "table",
                  alignment: "left",
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [0, 10, 0, 0],
        },

        {
          table: {
            widths: ["45%", "15%", "40%"],
            body: [
              [
                {
                  table: {
                    widths: ["*", "*", "*", "*", "*"],
                    body: [
                      [
                        {
                          text: "Proses",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 9,
                        },
                        {
                          text: "Nama",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 9,
                        },
                        {
                          text: "Tanggal",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 9,
                        },
                        {
                          text: "Mulai",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 9,
                        },
                        {
                          text: "Selesai",
                          bold: true,
                          fillColor: "#D3D3D3",
                          fontSize: 9,
                        },
                      ],
                      [{ text: "Output", fontSize: 9 }, "", "", "", ""],
                      [{ text: "QC", fontSize: 9 }, "", "", "", ""],
                    ],
                    alignment: "left",
                    style: "table",
                  },
                },
                "",
                barcodeImage,
              ],
            ],
          },
          layout: "noBorders",
        },

        // 📌 Table Utama (Data)
        {
          table: {
            widths: ["10%", "12%", "20%", "10%", "10%", "18%", "10%", "10%"],
            body: [
              [
                { text: "No Urut", bold: true, fillColor: "#D3D3D3" },
                { text: "NO MR", bold: true, fillColor: "#D3D3D3" },
                { text: "Nama Pasien", bold: true, fillColor: "#D3D3D3" },
                { text: "Layanan", bold: true, fillColor: "#D3D3D3" },
                { text: "Tanggal", bold: true, fillColor: "#D3D3D3" },
                { text: "Nama Dokumen", bold: true, fillColor: "#D3D3D3" },
                { text: "Cek Ouput", bold: true, fillColor: "#D3D3D3" },
                { text: "Cek QC", bold: true, fillColor: "#D3D3D3" },
              ],
              ...data.map((item) => [
                item.NoUrut || "-",
                item.NoMR || "-",
                item.NamaPasien || "-",
                item.Layanan || "-",
                moment(item.Tanggal, "DDMMYYYY").format("DD-MM-YYYY") || "-",
                item.namadokumen || "-",
                "",
                "",
              ]),
            ],
          },
          margin: [0, 10, 0, 0], //
          style: "table",
        },
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },

        table: {
          fontSize: 9,
        },
      },
    };

    // 📄 Generate PDF dan kirim langsung ke response
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Finishing_Checklist_${kode_checklist}.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) {
    console.error("❌ Error generate Finishing Checksheet:", err);
    return api.error(res, "Internal Server Error", 500);
  }
};

const updateMRt3 = async (req, res) => {
  const data = req.body;
  try {
    console.log(data);
    let result = await model.updateDataMRt3(data);
    return api.ok(res, result);
  } catch (error) {
    console.log(error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const removeMRt3 = async (req, res) => {
  const { NoUrut, Kode_Checklist } = req.params;
  console.log(NoUrut, Kode_Checklist);
  try {
    let result = await model.deleteMRt3({ NoUrut, Kode_Checklist });
    return api.ok(res, "Delete Successfully!");
  } catch (err) {
    console.log(err);
    return api.error(res, "Internal Server Error", 500);
  }
};

const exportCSVMRt3 = async (req, res) => {
  const { Kode_Checklist } = req.params;
  try {
    let data;
    if (Kode_Checklist !== null) {
      data = await model.getMRt3ByKodeChecklist(Kode_Checklist);
    } else {
      data = await model.getAllMRt3();
    }

    if (data.length === 0) {
      return api.error(res, "Data Not Found!", 400);
    }

    // Definisikan kolom yang akan diekspor
    const fields = [
      "NoUrut",
      "NoMR",
      "Kode_Checklist",
      "NamaPasien",
      "Tanggal",
      "Qty_Image",
      "Urut",
      "Mulai",
      "Selesai",
      "Layanan",
      "Mulai",
      "Selesai",
      "namadokumen",
    ];
    // Konversi data ke CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
    // Simpan CSV ke file sementara
    const filePath = path.join(__dirname, "../../exports/MRt3.csv");
    fs.writeFileSync(filePath, csv);

    // Kirim file CSV ke client
    res.download(filePath, "data_MRt3.csv", (err) => {
      if (err) {
        console.error("Error saat mengirim file:", err);
        res.status(500).json({ message: "Gagal mengunduh file" });
      }

      // Hapus file setelah dikirim (opsional)
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("❌ Error exporting CSV:", error);
    return api.error(res, "Failed to export CSV", 500);
  }
};

module.exports = {
  getAllDataMR,
  getDataMRByKeys,
  createDataMR,
  updateDataMR,
  deleteDataMR,
  exportCsv,
  getAllDataMRt3,
  generateFinishinCheecksheet,
  generateQcChecksheet,
  updateMRt3,
  removeMRt3,
  exportCSVMRt3,
};
