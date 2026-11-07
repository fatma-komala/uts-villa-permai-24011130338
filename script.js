const dataVilla = [
    {
        id: 1,
        nama: "Villa Permai Garden",
        tipe: "2 Kamar Tidur",
        lokasi: "Puncak, Bogor",
        harga: 500000,
        fasilitas: ["WiFi", "Kolam Renang", "Dapur", "Parkir"],
        status: "Tersedia"
    },
    {
        id: 2,
        nama: "Villa Permai Mountain",
        tipe: "3 Kamar Tidur",
        lokasi: "Puncak, Bogor",
        harga: 750000,
        fasilitas: ["WiFi", "Pemandangan Gunung", "Dapur", "Parkir"],
        status: "Tersedia"
    },
    {
        id: 3,
        nama: "Villa Permai Family",
        tipe: "4 Kamar Tidur",
        lokasi: "Puncak, Bogor",
        harga: 1000000,
        fasilitas: ["WiFi", "Kolam Renang", "Ruang Keluarga", "Parkir"],
        status: "Tersedia"
    }
];


const daftarVilla = document.getElementById("daftarVilla");
const pilihanVilla = document.getElementById("pilihanVilla");
const cariVilla = document.getElementById("cariVilla");

const formPemesanan = document.getElementById("formPemesanan");
const namaTamu = document.getElementById("namaTamu");
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");
const jumlahTamu = document.getElementById("jumlahTamu");

const hasilPemesanan = document.getElementById("hasilPemesanan");
const daftarPesanan = document.getElementById("daftarPesanan");
const btnCek = document.getElementById("btnCek");


function ambilPenyimpanan(kunci) {
    try {
        const data = localStorage.getItem(kunci);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        return [];
    }
}

function simpanPenyimpanan(kunci, data) {
    try {
        localStorage.setItem(kunci, JSON.stringify(data));
        return true;
    } catch (error) {
        return false;
    }
}


function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}


function hitungJumlahMalam() {
    if (!checkIn.value || !checkOut.value) {
        return 0;
    }

    const tanggalMasuk = new Date(checkIn.value + "T00:00:00");
    const tanggalKeluar = new Date(checkOut.value + "T00:00:00");

    const selisih = tanggalKeluar - tanggalMasuk;

    return selisih / (1000 * 60 * 60 * 24);
}


function ambilVillaTerpilih() {
    return dataVilla.find(
        villa => villa.id === Number(pilihanVilla.value)
    );
}


function cekJadwalVilla(idVilla, masuk, keluar) {
    const pesanan = ambilPenyimpanan("pesananVilla");

    return pesanan.some(pesanan => {
        return (
            pesanan.idVilla === idVilla &&
            new Date(masuk + "T00:00:00") <
                new Date(pesanan.checkOut + "T00:00:00") &&
            new Date(keluar + "T00:00:00") >
                new Date(pesanan.checkIn + "T00:00:00")
        );
    });
}


function validasiForm() {
    const nama = namaTamu.value.trim();
    const masuk = checkIn.value;
    const keluar = checkOut.value;
    const tamu = Number(jumlahTamu.value);
    const villa = ambilVillaTerpilih();

    if (nama === "") {
        return "Nama tamu wajib diisi.";
    }

    if (!masuk || !keluar) {
        return "Tanggal check-in dan check-out wajib diisi.";
    }

    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    const tanggalMasuk = new Date(masuk + "T00:00:00");
    const tanggalKeluar = new Date(keluar + "T00:00:00");

    if (tanggalMasuk < hariIni) {
        return "Tanggal check-in tidak boleh di masa lalu.";
    }

    if (tanggalKeluar <= tanggalMasuk) {
        return "Tanggal check-out harus setelah tanggal check-in.";
    }

    if (!Number.isInteger(tamu) || tamu < 1 || tamu > 10) {
        return "Jumlah tamu harus antara 1 sampai 10 orang.";
    }

    if (!villa) {
        return "Silakan pilih unit villa terlebih dahulu.";
    }

    return "";
}


function hitungTotalHarga() {
    const villa = ambilVillaTerpilih();
    const malam = hitungJumlahMalam();
    const hasilTamu = Number(jumlahTamu.value);

    if (!villa || malam <= 0) {
        hasilPemesanan.textContent =
            "Silakan lengkapi tanggal dan pilihan villa untuk melihat biaya.";
        return;
    }

    const total = villa.harga * malam;

    hasilPemesanan.replaceChildren();

    const judul = document.createElement("h3");
    judul.textContent = "Ringkasan Biaya";

    const nama = document.createElement("p");
    nama.textContent = "Villa: " + villa.nama;

    const harga = document.createElement("p");
    harga.textContent = "Harga per malam: " + formatRupiah(villa.harga);

    const jumlahMalam = document.createElement("p");
    jumlahMalam.textContent = "Lama menginap: " + malam + " malam";

    const tamu = document.createElement("p");
    tamu.textContent = "Jumlah tamu: " + hasilTamu + " orang";

    const totalHarga = document.createElement("h3");
    totalHarga.textContent = "Total: " + formatRupiah(total);

    hasilPemesanan.appendChild(judul);
    hasilPemesanan.appendChild(nama);
    hasilPemesanan.appendChild(harga);
    hasilPemesanan.appendChild(jumlahMalam);
    hasilPemesanan.appendChild(tamu);
    hasilPemesanan.appendChild(totalHarga);
}


function tampilkanVilla(data) {
    daftarVilla.replaceChildren();

    if (data.length === 0) {
        const pesan = document.createElement("p");
        pesan.textContent = "Villa yang Anda cari tidak ditemukan.";
        daftarVilla.appendChild(pesan);
        return;
    }

    data.forEach(villa => {
        const kartu = document.createElement("article");
        kartu.className = "villa-card";

        const judul = document.createElement("h3");
        judul.textContent = villa.nama;

        const tipe = document.createElement("p");
        tipe.textContent = "Tipe: " + villa.tipe;

        const lokasi = document.createElement("p");
        lokasi.textContent = "Lokasi: " + villa.lokasi;

        const harga = document.createElement("p");
        harga.className = "villa-card__price";
        harga.textContent = formatRupiah(villa.harga) + " / malam";

        const fasilitas = document.createElement("p");
        fasilitas.className = "villa-card__facilities";
        fasilitas.textContent =
            "Fasilitas: " + villa.fasilitas.join(", ");

        const status = document.createElement("span");
        status.className = "villa-card__status";
        status.textContent = villa.status;

        kartu.appendChild(judul);
        kartu.appendChild(tipe);
        kartu.appendChild(lokasi);
        kartu.appendChild(harga);
        kartu.appendChild(fasilitas);
        kartu.appendChild(status);

        daftarVilla.appendChild(kartu);
    });
}


function isiPilihanVilla() {
    dataVilla.forEach(villa => {
        const opsi = document.createElement("option");

        opsi.value = villa.id;
        opsi.textContent =
            villa.nama + " - " + formatRupiah(villa.harga) + "/malam";

        pilihanVilla.appendChild(opsi);
    });
}


cariVilla.addEventListener("input", function () {
    const kataKunci = cariVilla.value.toLowerCase();

    const hasilFilter = dataVilla.filter(villa => {
        const informasi =
            villa.nama + " " +
            villa.tipe + " " +
            villa.lokasi + " " +
            villa.fasilitas.join(" ");

        return informasi.toLowerCase().includes(kataKunci);
    });

    tampilkanVilla(hasilFilter);
});


function aturTanggalMinimal() {
    const sekarang = new Date();

    const tahun = sekarang.getFullYear();
    const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
    const hari = String(sekarang.getDate()).padStart(2, "0");

    const tanggalHariIni = `${tahun}-${bulan}-${hari}`;

    checkIn.min = tanggalHariIni;
    checkOut.min = tanggalHariIni;
}


function cekKetersediaan() {
    const kesalahan = validasiForm();

    if (kesalahan) {
        alert(kesalahan);
        return;
    }

    const villa = ambilVillaTerpilih();

    if (cekJadwalVilla(villa.id, checkIn.value, checkOut.value)) {
        alert("Maaf, villa tersebut sudah dipesan pada tanggal yang dipilih.");
        return;
    }

    alert("Villa tersedia pada tanggal yang Anda pilih.");

    hitungTotalHarga();
}

btnCek.addEventListener("click", cekKetersediaan);


formPemesanan.addEventListener("submit", function (event) {
    event.preventDefault();

    const kesalahan = validasiForm();

    if (kesalahan) {
        alert(kesalahan);
        return;
    }

    const villa = ambilVillaTerpilih();

    if (cekJadwalVilla(villa.id, checkIn.value, checkOut.value)) {
        alert("Maaf, villa sudah dipesan pada tanggal tersebut.");
        return;
    }

    const malam = hitungJumlahMalam();
    const total = villa.harga * malam;

    const pesananBaru = {
        id: Date.now(),
        idVilla: villa.id,
        nama: namaTamu.value.trim(),
        villa: villa.nama,
        checkIn: checkIn.value,
        checkOut: checkOut.value,
        jumlahTamu: Number(jumlahTamu.value),
        jumlahMalam: malam,
        total: total
    };

    const daftarData = ambilPenyimpanan("pesananVilla");

    daftarData.push(pesananBaru);

    const berhasil = simpanPenyimpanan("pesananVilla", daftarData);

    if (!berhasil) {
        alert("Pesanan gagal disimpan. Penyimpanan browser tidak tersedia.");
        return;
    }

    simpanPenyimpanan("namaTamuTerakhir", namaTamu.value.trim());

    alert("Pesanan berhasil disimpan pada browser ini!");

    tampilkanPesanan();
    hitungTotalHarga();
});


function tampilkanPesanan() {
    const pesanan = ambilPenyimpanan("pesananVilla");

    daftarPesanan.replaceChildren();

    if (pesanan.length === 0) {
        const pesan = document.createElement("p");
        pesan.textContent = "Belum ada pesanan yang tersimpan.";
        daftarPesanan.appendChild(pesan);
        return;
    }

    pesanan.forEach(item => {
        const kartu = document.createElement("div");
        kartu.className = "villa-card";

        const nama = document.createElement("h3");
        nama.textContent = item.nama;

        const villa = document.createElement("p");
        villa.textContent = "Villa: " + item.villa;

        const tanggal = document.createElement("p");
        tanggal.textContent =
            "Tanggal: " + item.checkIn + " sampai " + item.checkOut;

        const malam = document.createElement("p");
        malam.textContent = "Lama menginap: " + item.jumlahMalam + " malam";

        const total = document.createElement("p");
        total.className = "villa-card__price";
        total.textContent = "Total: " + formatRupiah(item.total);

        kartu.appendChild(nama);
        kartu.appendChild(villa);
        kartu.appendChild(tanggal);
        kartu.appendChild(malam);
        kartu.appendChild(total);

        daftarPesanan.appendChild(kartu);
    });
}


[pilihanVilla, checkIn, checkOut, jumlahTamu].forEach(input => {
    input.addEventListener("change", hitungTotalHarga);
});

checkIn.addEventListener("change", function () {
    checkOut.min = checkIn.value || checkIn.min;
});


function muatNamaTerakhir() {
    try {
        const namaTerakhir = localStorage.getItem("namaTamuTerakhir");

        if (namaTerakhir) {
            namaTamu.value = namaTerakhir;
        }
    } catch (error) {
        // Halaman tetap dapat digunakan tanpa penyimpanan lokal.
    }
}


function jalankanWebsite() {
    tampilkanVilla(dataVilla);
    isiPilihanVilla();
    aturTanggalMinimal();
    tampilkanPesanan();
    muatNamaTerakhir();
}

jalankanWebsite();
