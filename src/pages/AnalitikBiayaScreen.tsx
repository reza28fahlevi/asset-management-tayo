import React from 'react';

export const AnalitikBiayaScreen: React.FC = () => {
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-on-surface-variant mb-1">
            <span>Tata Kelola & Finansial</span>
            <span>•</span>
            <span className="text-primary">Analitik Biaya & Siklus Hidup</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Analitik Biaya per KM & TCO (Total Cost of Ownership)</h1>
          <p className="text-xs text-on-surface-variant">Evaluasi efisiensi biaya riil per kilometer tempuh armada dan kelayakan peremajaan (Re-Body vs Unit Baru).</p>
        </div>
        <button onClick={() => alert("Simulasi perhitungan peremajaan re-body dibuka.")} className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-sm">
          + Simulasi Hitung Re-Body
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-on-surface-variant uppercase font-bold">Avg Fleet Cost / KM</span>
          <div className="text-2xl font-bold text-on-surface mt-1">Rp 6.420 <span className="text-xs font-normal text-on-surface-variant">/ KM</span></div>
          <span className="text-[11px] text-error font-semibold">+1.8% dari target SLA</span>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-on-surface-variant uppercase font-bold">Akumulasi OPEX YTD</span>
          <div className="text-2xl font-bold text-on-surface mt-1">Rp 24,85 M</div>
          <span className="text-[11px] text-primary font-semibold">Total Tempuh 3.87M KM</span>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-on-surface-variant uppercase font-bold">Porsi BBM Solar</span>
          <div className="text-2xl font-bold text-on-surface mt-1">Rp 3.120 <span className="text-xs font-normal text-on-surface-variant">/ KM</span></div>
          <span className="text-[11px] text-emerald-700 font-semibold">48.6% Total Biaya</span>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
          <span className="text-xs text-on-surface-variant uppercase font-bold">Unit Perlu Evaluasi</span>
          <div className="text-2xl font-bold text-error mt-1">7 Unit</div>
          <span className="text-[11px] text-error font-semibold">Cost &gt; Rp 8.100/KM</span>
        </div>
      </div>

      {/* Re-body vs Beli Baru Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/20 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-bold text-outline tracking-wider">Opsi 1: Pembelian Unit Baru</span>
            <span className="material-symbols-outlined text-outline">shopping_bag</span>
          </div>
          <div className="text-3xl font-bold text-on-surface">Rp 2,40 Miliar</div>
          <div className="text-xs text-on-surface-variant space-y-1.5 pt-2 border-t border-surface-container">
            <div className="flex justify-between"><span>Depresiasi / Thn</span><span className="font-bold text-on-surface">Rp 400 Jt</span></div>
            <div className="flex justify-between"><span>Estimasi Cost/KM</span><span className="font-bold text-emerald-700">Rp 5.650</span></div>
            <div className="flex justify-between"><span>Masa Pakai</span><span className="font-bold text-on-surface">8 - 10 Tahun</span></div>
          </div>
        </div>

        <div className="bg-blue-50/60 p-5 rounded-xl shadow-sm border-2 border-primary/30 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-bold text-primary tracking-wider">Opsi 2: Re-Body Karoseri Baru</span>
            <span className="px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold">Rekomendasi</span>
          </div>
          <div className="text-3xl font-bold text-primary">Rp 750 Juta</div>
          <div className="text-xs text-on-surface-variant space-y-1.5 pt-2 border-t border-blue-200">
            <div className="flex justify-between"><span>Depresiasi / Thn</span><span className="font-bold text-emerald-700">Rp 150 Jt (-62.5%)</span></div>
            <div className="flex justify-between"><span>Perpanjangan Usia</span><span className="font-bold text-primary">+ 5 Tahun Operasi</span></div>
            <div className="flex justify-between"><span>Hemat Capex</span><span className="font-bold text-emerald-700">Rp 1,65 Miliar/Unit</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

