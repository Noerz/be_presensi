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

      // Cek apakah hari ini izin (2% kemungkinan)
      const izin = Math.random() < 0.02;
      if (izin) {
        // Buat record izin (bisa disesuaikan sesuai schema)
        await models.presensi.create({
          idPresensi: uuidv4(),
          inLocation: null,
          inTime: null,
          inStatus: "Izin",
          inKeterangan: "Izin tidak masuk",
          outLocation: null,
          outTime: null,
          outStatus: "Izin",
          outKeterangan: "Izin tidak keluar",
          staff_id,
          sekolah_id: sekolah.idSekolah,
          createdAt: tanggalPresensi.toDate(),
          updatedAt: tanggalPresensi.toDate(),
        });
        console.log(`Presensi izin untuk ${tanggalPresensi.format("YYYY-MM-DD")} berhasil ditambahkan`);
        continue; // lanjut ke tanggal berikutnya
      }

      // Jam masuk normal acak antara 6:30 sampai 7:15
      const masukBase = tanggalPresensi.clone().hour(6).minute(30);
      const masukVar = Math.floor(Math.random() * 46); // 0-45 menit
      let inMoment = masukBase.clone().add(masukVar, "minutes");

      // Tentukan status terlambat jika lebih dari jam masuk sekolah
      const terlambat = inMoment.isAfter(tanggalPresensi.clone().set({
        hour: inTimeSekolah.hour(),
        minute: inTimeSekolah.minute(),
        second: 0,
      }));

      const inStatus = terlambat ? "Terlambat" : "Tepat Waktu";
      const diffInMinute = inMoment.diff(
        tanggalPresensi.clone().set({
          hour: inTimeSekolah.hour(),
          minute: inTimeSekolah.minute(),
          second: 0,
        }),
        "minutes"
      );
      const inKeterangan = terlambat
        ? `Terlambat ${diffInMinute} menit`
        : "Tepat waktu";

      // Jam pulang acak antara 13:15 sampai 14:00
      const pulangBase = tanggalPresensi.clone().hour(13).minute(15);
      const pulangVar = Math.floor(Math.random() * 46); // 0-45 menit
      let outMoment = pulangBase.clone().add(pulangVar, "minutes");

      // Tentukan status terlalu cepat jika pulang sebelum jam pulang sekolah
      const terlaluCepat = outMoment.isBefore(tanggalPresensi.clone().set({
        hour: outTimeSekolah.hour(),
        minute: outTimeSekolah.minute(),
        second: 0,
      }));

      const outStatus = terlaluCepat ? "Terlalu Cepat" : "Tepat Waktu";
      const diffOutMinute = tanggalPresensi.clone().set({
        hour: outTimeSekolah.hour(),
        minute: outTimeSekolah.minute(),
        second: 0,
      }).diff(outMoment, "minutes");
      const outKeterangan = terlaluCepat
        ? `Pulang terlalu cepat ${diffOutMinute} menit`
        : "Tepat waktu";

      await models.presensi.create({
        idPresensi: uuidv4(),
        inLocation: sekolah.location,
        inTime: inMoment.format("YYYY-MM-DD HH:mm:ss"),
        inStatus,
        inKeterangan,
        outLocation: sekolah.location,
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
