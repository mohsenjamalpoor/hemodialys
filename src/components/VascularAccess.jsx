import React, { useState } from "react";

export function VascularAccess() {
  const accessTypes = [
    {
      type: "کاتتر ورید مرکزی (CVC)",
      description: `- سریع نصب می‌شود\n- مناسب درمان کوتاه‌مدت\n- خطر عفونت بالاتر نسبت به فستولا`,
    },
    {
      type: "فستول شریانی-وریدی (AV Fistula)",
      description: `- ایجاد شده با جراحی\n- بهترین گزینه برای درمان طولانی‌مدت\n- کمترین عوارض عفونی و انسدادی`,
    },
    {
      type: "گرفت شریانی-وریدی (AV Graft)",
      description: `- جایگزین فستول در صورت عدم امکان\n- نصب سریع‌تر از فستول\n- احتمال انسداد و عفونت بیشتر از فستول`,
    },
  ];

  const [selectedAccess, setSelectedAccess] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg" dir="rtl">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-4">
        دسترسی وریدی در دیالیز
      </h2>

      <ul className="space-y-4">
        {accessTypes.map((access, idx) => (
          <li
            key={idx}
            onClick={() => setSelectedAccess(access)}
            className="cursor-pointer p-4 border rounded hover:bg-green-50 transition"
          >
            <h3 className="text-xl font-semibold">{access.type}</h3>
          </li>
        ))}
      </ul>

      {selectedAccess && (
        <div className="mt-6 p-4 border rounded bg-green-100 text-green-900 whitespace-pre-line">
          <h3 className="text-lg font-bold mb-2">{selectedAccess.type}</h3>
          <p>{selectedAccess.description}</p>
          <button
            onClick={() => setSelectedAccess(null)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            بستن
          </button>
        </div>
      )}
    </div>
  );
}
