const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");
const initModels = require("../models/init-models");
const moment = require("moment");
const models = initModels(db);

async function seedPresensiDummy(staff_id) {
  const sekolah = await models.sekolah.findOne();
  if (!sekolah) {
    console.error("Sekolah tidak ditemukan.");
    return;
  }

  const inTimeSekolah = moment(sekolah.inTime, "HH:mm:ss");
  const outTimeSekolah = moment(sekolah.outTime, "HH:mm:ss");

  const bulanAwal = 3; // Maret
  const bulanAkhir = 6; // Juni
  const tahun = 2025;

  for (let bulan = bulanAwal; bulan <= bulanAkhir; bulan++) {
    const daysInMonth = moment(`${tahun}-${bulan}`, "YYYY-MM").daysInMonth();

    for (let tanggal = 1; tanggal <= daysInMonth; tanggal++) {
      const tanggalPresensi = moment(`${tahun}-${bulan}-${tanggal}`, "YYYY-MM-DD");

      // Lewatkan akhir pekan (Sabtu: 6, Minggu: 0)
      if ([0, 6].includes(tanggalPresensi.day())) continue;

      // Generate jam masuk: 10% kemungkinan terlambat
      const terlambat = Math.random() < 0.1;
      const inMoment = tanggalPresensi.clone().hour(7).minute(terlambat ? 20 : 0);
      const inStatus = terlambat ? "Terlambat" : "Tepat Waktu";
      const inKeterangan = terlambat ? `Terlambat ${inMoment.diff(inTimeSekolah, "minutes")} menit` : "Tepat waktu";

      // Generate jam keluar: 10% kemungkinan terlalu cepat
      const terlaluCepat = Math.random() < 0.1;
      const outMoment = tanggalPresensi.clone().hour(13).minute(terlaluCepat ? 0 : 30);
      const outStatus = terlaluCepat ? "Terlalu Cepat" : "Tepat Waktu";
      const outKeterangan = terlaluCepat ? `Terlalu cepat ${outTimeSekolah.diff(outMoment, "minutes")} menit` : "Tepat waktu";

      await models.presensi.create({
        idPresensi: uuidv4(),
        inLocation: "Lokasi Masuk Dummy",
        inTime: inMoment.format("YYYY-MM-DD HH:mm:ss"),
        inStatus,
        inKeterangan,
        outLocation: "Lokasi Keluar Dummy",
        outTime: outMoment.format("YYYY-MM-DD HH:mm:ss"),
        outStatus,
        outKeterangan,
        staff_id,
        sekolah_id: sekolah.idSekolah,
        createdAt: tanggalPresensi.toDate(),
        updatedAt: tanggalPresensi.toDate(),
      });

      console.log(`Presensi untuk ${tanggalPresensi.format("YYYY-MM-DD")} berhasil ditambahkan`);
    }
  }

  console.log("Seeder presensi selesai dijalankan.");
}

seedPresensiDummy("05610924-7c7b-48d4-99c3-7edb665cbec8") // Ganti dengan ID user yang valid
  .then(() => process.exit())
  .catch((err) => {
    console.error("Seeder error:", err);
    process.exit(1);
  });
