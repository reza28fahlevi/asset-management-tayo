import React, { useState } from 'react';

export const IncidentScreen: React.FC = () => {
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Incident & Road Trouble Command Center</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-error-container text-error text-xs font-bold animate-pulse">3 Insiden Aktif</span>
          </div>
          <p className="text-xs text-on-surface-variant">Pusat kendali 24 jam respon breakdown armada, overstapel evakuasi penumpang, dan rescue derek tol.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSOSModal(true)}
            className="px-4 py-2 bg-error text-white text-xs font-bold rounded-lg shadow-sm hover:brightness-110 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            + Lapor Trouble Baru (SOS)
          </button>
        </div>
      </div>

      {/* Active Incident Spotlight */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="bg-error text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">car_crash</span>
            <div>
              <h3 className="font-bold text-base">INC-2024-104 • Tol Cipali KM 102+400 Jalur A</h3>
              <p className="text-xs opacity-90">Armada TY-019 (MB OH 1626) • Overheat & Selang Radiator Pecah</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-white text-error font-bold text-xs">Prioritas Kritis</span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-surface-container-low rounded-lg space-y-1">
            <span className="text-outline text-[10px] uppercase font-bold">Penumpang Terdampak</span>
            <div className="text-lg font-bold text-on-surface">32 Jiwa (Penuh)</div>
            <span className="text-emerald-700 font-semibold">Bus cadangan TY-045 meluncur</span>
          </div>
          <div className="p-3 bg-surface-container-low rounded-lg space-y-1">
            <span className="text-outline text-[10px] uppercase font-bold">Service Car Respon</span>
            <div className="text-lg font-bold text-primary">SC-01 Subang</div>
            <span className="text-on-surface-variant">ETA 12 menit ke lokasi TKP</span>
          </div>
          <div className="p-3 bg-surface-container-low rounded-lg space-y-1">
            <span className="text-outline text-[10px] uppercase font-bold">Tindakan Cepat</span>
            <div className="flex gap-1.5 pt-1">
              <button onClick={() => alert("WhatsApp broadcast telah dikirim ke 32 penumpang.")} className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded font-semibold text-[11px]">
                SMS 32 Pax
              </button>
              <button onClick={() => alert("Tiket overstapel penumpang disetujui ke TY-045.")} className="px-2.5 py-1 bg-primary text-white rounded font-semibold text-[11px]">
                Rilis Overstapel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
            {/* Header Modal - Sticky */}
            <div className="shrink-0 px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-error/10 text-error flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">emergency</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-error">Registrasi Panggilan Darurat (SOS)</h3>
                  <p className="text-xs text-on-surface-variant">Kirim peringatan darurat ke tim rescue & derek tol.</p>
                </div>
              </div>
              <button
                onClick={() => setShowSOSModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form
              id="sos-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Laporan SOS telah disebarkan ke tim rescue dan derek tol.");
                setShowSOSModal(false);
              }}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs"
            >
              <div>
                <label className="font-semibold block mb-1 text-on-surface">Nomor Lambung</label>
                <input
                  required
                  placeholder="Contoh: TY-024"
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30 font-bold"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-on-surface">Kategori Masalah</label>
                <select className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30">
                  <option>Overheat & Mesin / Radiator</option>
                  <option>Pecah Ban / Roda</option>
                  <option>Rem & Kompresor Angin</option>
                  <option>Kecelakaan Lalu Lintas</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1 text-on-surface">Lokasi KM Tol / Landmark</label>
                <input
                  required
                  placeholder="Tol Cipali KM 102+400"
                  className="w-full p-2.5 bg-surface-container-low text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
            </form>

            {/* Modal Footer - Sticky */}
            <div className="shrink-0 px-6 py-3.5 border-t border-surface-container bg-surface-container-low/70 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSOSModal(false)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="sos-form"
                className="px-5 py-2 bg-error text-white font-bold rounded-lg shadow-sm hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                Kirim Respon Darurat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

