import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ms";

interface Translations {
  [key: string]: {
    en: string;
    ms: string;
  };
}

const translations: Translations = {
  dashboard: { en: "Dashboard", ms: "Papan Pemuka" },
  vehicles: { en: "Vehicles", ms: "Kenderaan" },
  drivers: { en: "Drivers", ms: "Pemandu" },
  bookings: { en: "Bookings", ms: "Tempahan" },
  maintenance: { en: "Maintenance", ms: "Penyelenggaraan" },
  insurance: { en: "Insurance", ms: "Insurans" },
  accidents: { en: "Accidents", ms: "Kemalangan" },
  fines: { en: "Fines", ms: "Saman" },
  disposals: { en: "Disposals", ms: "Pelupusan" },
  activities: { en: "Activities", ms: "Aktiviti" },
  recent_activity: { en: "Recent activity", ms: "Aktiviti terkini" },
  expiring_policies: { en: "Expiring policies", ms: "Polisi tamat tempoh" },
  service_alerts: { en: "Service alerts", ms: "Amaran penyelenggaraan" },
  add_new: { en: "Add New", ms: "Tambah Baru" },
  save: { en: "Save", ms: "Simpan" },
  cancel: { en: "Cancel", ms: "Batal" },
  edit: { en: "Edit", ms: "Kemaskini" },
  delete: { en: "Delete", ms: "Hapus" },
  search: { en: "Search", ms: "Cari" },
  status: { en: "Status", ms: "Status" },
  actions: { en: "Actions", ms: "Tindakan" },
  reg_no: { en: "Reg No", ms: "No. Pendaftaran" },
  type: { en: "Type", ms: "Jenis" },
  brand: { en: "Brand", ms: "Jenama" },
  model: { en: "Model", ms: "Model" },
  odometer: { en: "Odometer", ms: "Odometer" },
  capacity: { en: "Capacity", ms: "Kapasiti" },
  load_limit: { en: "Load Limit", ms: "Had Muatan" },
  next_service: { en: "Next Service", ms: "Servis Seterusnya" },
  available: { en: "Available", ms: "Tersedia" },
  in_use: { en: "In Use", ms: "Sedang Diguna" },
  maintenance_status: { en: "Maintenance", ms: "Penyelenggaraan" },
  damaged: { en: "Damaged", ms: "Rosak" },
  disposed: { en: "Disposed", ms: "Dilupuskan" },
  total_vehicles: { en: "Total Vehicles", ms: "Jumlah Kenderaan" },
  active_bookings: { en: "Active Bookings", ms: "Tempahan Aktif" },
  maintenance_alerts: { en: "Maintenance Alerts", ms: "Amaran Penyelenggaraan" },
  expiring_insurance: { en: "Expiring Insurance", ms: "Insurans Tamat Tempoh" },
  dashboard_desc: { en: "Overview of your fleet operations", ms: "Gambaran keseluruhan operasi armada anda" },
  available_trend: { en: "available", ms: "tersedia" },
  operational_trips: { en: "Current operational trips", ms: "Trip operasi semasa" },
  open_service: { en: "Open service items", ms: "Item servis terbuka" },
  within_30_days: { en: "Within 30 days", ms: "Dalam tempoh 30 hari" },
  no_activity: { en: "No activity", ms: "Tiada aktiviti" },
  no_policies: { en: "No policies expiring soon.", ms: "Tiada polisi tamat tempoh dalam masa terdekat." },
  up_to_date: { en: "All vehicles are up to date.", ms: "Semua kenderaan dalam keadaan baik." },
  insurance_label: { en: "Insurance", ms: "Insurans" },
  road_tax_label: { en: "Road Tax", ms: "Cukai Jalan" },
  days_left: { en: "days left", ms: "hari lagi" },
  expired_label: { en: "Expired", ms: "Tamat Tempoh" },
  vehicle_desc: { en: "Master data for all fleet vehicles", ms: "Data induk untuk semua kenderaan armada" },
  add_vehicle: { en: "Add vehicle", ms: "Tambah kenderaan" },
  edit_vehicle: { en: "Edit vehicle", ms: "Kemaskini kenderaan" },
  load_cap: { en: "Load/Capacity", ms: "Muatan/Kapasiti" },
  department_label: { en: "Department", ms: "Jabatan" },
  delete_vehicle_title: { en: "Delete vehicle?", ms: "Hapus kenderaan?" },
  delete_vehicle_desc: { en: "This will permanently remove the vehicle from the fleet.", ms: "Tindakan ini akan membuang kenderaan secara kekal daripada armada." },
  pending: { en: "Pending", ms: "Menunggu" },
  approved: { en: "Approved", ms: "Diluluskan" },
  completed: { en: "Completed", ms: "Selesai" },
  rejected: { en: "Rejected", ms: "Ditolak" },
  cancelled: { en: "Cancelled", ms: "Dibatalkan" },
  active: { en: "Active", ms: "Aktif" },
  suspended: { en: "Suspended", ms: "Digantung" },
  scheduled: { en: "Scheduled", ms: "Dijadualkan" },
  in_progress: { en: "In Progress", ms: "Dalam Proses" },
  unpaid: { en: "Unpaid", ms: "Belum Bayar" },
  paid: { en: "Paid", ms: "Dibayar" },
  appealed: { en: "Appealed", ms: "Rayuan" },
  pending_evaluation: { en: "Pending Evaluation", ms: "Menunggu Penilaian" },
  pending_approval: { en: "Pending Approval", ms: "Menunggu Kelulusan" },
  executed: { en: "Executed", ms: "Dilaksanakan" },
  "in-use": { en: "In Use", ms: "Dalam Penggunaan" },
  booking_desc: { en: "Reserve vehicles, manage check-in/out and approvals", ms: "Tempah kenderaan, urus daftar masuk/keluar dan kelulusan" },
  new_booking: { en: "New booking", ms: "Tempahan baru" },
  edit_booking: { en: "Edit booking", ms: "Kemaskini tempahan" },
  delete_booking_title: { en: "Delete booking?", ms: "Hapus tempahan?" },
  delete_booking_desc: { en: "This action cannot be undone.", ms: "Tindakan ini tidak boleh dibatalkan." },
  list_label: { en: "List", ms: "Senarai" },
  calendar_label: { en: "Calendar", ms: "Kalendar" },
  reports: { en: "Reports", ms: "Laporan" },
  no_vehicles_found: { en: "No vehicles found", ms: "Tiada kenderaan dijumpai" },
  no_vehicles_desc: { en: "Start by adding vehicles to your fleet to begin managing operations.", ms: "Mula dengan menambah kenderaan ke armada anda untuk mula menguruskan operasi." },
  no_bookings_found: { en: "No bookings found", ms: "Tiada tempahan dijumpai" },
  no_bookings_desc: { en: "Reserve vehicles and manage trip schedules here.", ms: "Tempah kenderaan dan urus jadual perjalanan di sini." },
  no_drivers_found: { en: "No drivers found", ms: "Tiada pemandu dijumpai" },
  no_drivers_desc: { en: "Start by adding drivers to your fleet to begin managing bookings and assignments.", ms: "Mula dengan menambah pemandu ke armada anda untuk mula menguruskan tempahan dan tugasan." },
  no_maintenance_found: { en: "No maintenance records", ms: "Tiada rekod penyelenggaraan" },
  no_maintenance_desc: { en: "Keep your fleet in top condition by scheduling regular maintenance and service checks.", ms: "Pastikan armada anda dalam keadaan terbaik dengan menjadualkan penyelenggaraan dan pemeriksaan servis berkala." },
  no_accidents_found: { en: "No accident reports", ms: "Tiada laporan kemalangan" },
  no_accidents_desc: { en: "Track incidents and insurance claim progress here to maintain accurate fleet history.", ms: "Jejak insiden dan kemajuan tuntutan insurans di sini untuk mengekalkan sejarah armada yang tepat." },
  no_fines_found: { en: "No traffic fines", ms: "Tiada saman trafik" },
  no_fines_desc: { en: "Record traffic offences and track payment status to ensure compliance.", ms: "Rekod kesalahan trafik dan jejak status pembayaran untuk memastikan pematuhan." },
  no_insurance_found: { en: "No policies found", ms: "Tiada polisi dijumpai" },
  no_insurance_desc: { en: "Track vehicle insurance and road tax expiry to avoid legal issues.", ms: "Jejak tamat tempoh insurans kenderaan dan cukai jalan untuk mengelakkan isu undang-undang." },
  no_disposals_found: { en: "No disposal records", ms: "Tiada rekod pelupusan" },
  no_disposals_desc: { en: "Manage the vehicle decommissioning and auction process here.", ms: "Urus proses penamatan perkhidmatan kenderaan dan lelongan di sini." },
  add_driver: { en: "Add driver", ms: "Tambah pemandu" },
  log_accident: { en: "Log accident", ms: "Log kemalangan" },
  add_fine: { en: "Add fine", ms: "Tambah saman" },
  add_policy: { en: "Add policy", ms: "Tambah polisi" },
  new_disposal: { en: "New disposal", ms: "Pelupusan baru" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
