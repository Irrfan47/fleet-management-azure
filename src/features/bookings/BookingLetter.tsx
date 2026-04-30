
import { Booking } from "@/types";
import { fmtDate } from "@/utils/format";

interface Props {
  booking: Booking;
}

export function BookingLetter({ booking }: Props) {
  return (
    <div className="print-container p-8 max-w-[800px] mx-auto bg-white text-black font-serif print:p-0 print:m-0 print:shadow-none">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-8">
        <h1 className="text-2xl font-bold uppercase">Sistem Pengurusan Kenderaan (SPK)</h1>
        <p className="text-sm">Jabatan Pengurusan Aset & Logistik</p>
      </div>

      {/* Letter Details */}
      <div className="flex justify-between mb-8">
        <div>
          <p><strong>Ruj. Kami:</strong> SPK/{booking.id.slice(0, 6).toUpperCase()}/{new Date().getFullYear()}</p>
        </div>
        <div>
          <p><strong>Tarikh:</strong> {new Date().toLocaleDateString('ms-MY')}</p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold underline uppercase">SURAT KEBENARAN PENGGUNAAN KENDERAAN JABATAN</h2>
      </div>

      {/* Content */}
      <div className="space-y-4 text-justify">
        <p>Adalah dengan ini disahkan bahawa penugasan kenderaan jabatan telah diluluskan seperti butiran berikut:</p>

        <div className="grid grid-cols-3 gap-y-2 mt-4 ml-8">
          <div className="font-bold">Nama Pemandu</div>
          <div className="col-span-2">: {booking.driverName}</div>

          <div className="font-bold">No. Pendaftaran</div>
          <div className="col-span-2">: {booking.vehicleRegNo}</div>

          <div className="font-bold">Destinasi</div>
          <div className="col-span-2">: {booking.destination}</div>

          <div className="font-bold">Tujuan Rasmi</div>
          <div className="col-span-2">: {booking.purpose}</div>

          <div className="font-bold">Tempoh Penggunaan</div>
          <div className="col-span-2">: {fmtDate(booking.startDate)} sehingga {fmtDate(booking.endDate)}</div>
        </div>

        <p className="mt-8">
          Pemandu adalah diingatkan supaya sentiasa mematuhi peraturan jalan raya dan memastikan kenderaan 
          berada dalam keadaan baik sebelum, semasa dan selepas digunakan. Segala penggunaan odometer 
          hendaklah dicatatkan dalam Buku Log Kenderaan yang disediakan.
        </p>

        <p>Sekian, terima kasih.</p>
      </div>

      {/* Signature Section */}
      <div className="mt-16">
        <p>Diluluskan secara digital oleh,</p>
        <div className="mt-12 h-1 w-48 border-b border-black"></div>
        <p className="mt-2 font-bold uppercase">Pegawai Penguasa Kenderaan</p>
        <p className="text-sm italic">(Surat ini adalah cetakan komputer dan tidak memerlukan tandatangan basah)</p>
      </div>
      
      <div className="mt-16 text-xs text-center border-t pt-4 text-gray-500 print:hidden">
        <p>ID Transaksi: {booking.id}</p>
        <p>Dijana pada: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
