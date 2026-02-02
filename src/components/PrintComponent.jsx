import React from 'react';
import { FiPrinter, FiDownload, FiFileText } from 'react-icons/fi';

const PrintComponent = ({ patient, doctorInfo, type = 'all', tests = [], singleTest = null }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    const printDate = new Date().toLocaleDateString('fa-IR');
    const printTime = new Date().toLocaleTimeString('fa-IR');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>گزارش پزشکی - ${patient.fullName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Vazirmatn', 'B Nazanin', Tahoma, sans-serif;
          }
          
          body {
            font-family: 'Vazirmatn', 'B Nazanin', Tahoma, sans-serif;
            line-height: 1.8;
            color: #333;
            background: #fff;
            padding: 25px;
            max-width: 1000px;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 25px;
            border-bottom: 3px solid #4f46e5;
            background: linear-gradient(to right, #f8fafc, #e0e7ff);
            padding: 30px 20px;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .header h1 {
            color: #1e3a8a;
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 700;
          }
          
          .header p {
            color: #4b5563;
            font-size: 16px;
            margin-bottom: 5px;
          }
          
          .logo {
            font-size: 22px;
            color: #4f46e5;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          
          .patient-info {
            display: flex;
            justify-content: space-between;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 40px;
            border: 2px solid #bae6fd;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
          }
          
          .patient-info > div {
            flex: 1;
            padding: 0 20px;
          }
          
          .patient-info h3, .doctor-info h3 {
            color: #1e40af;
            font-size: 18px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #93c5fd;
            font-weight: 600;
          }
          
          .patient-info p, .doctor-info p {
            margin-bottom: 12px;
            font-size: 15px;
            color: #374151;
          }
          
          .test-section {
            margin-bottom: 40px;
          }
          
          .test-section h2 {
            background: linear-gradient(to right, #4f46e5, #7c3aed);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            margin-bottom: 25px;
            font-size: 20px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
          }
          
          .test-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            border-radius: 10px;
            overflow: hidden;
          }
          
          .test-table th {
            background: linear-gradient(to right, #3b82f6, #2563eb);
            color: white;
            padding: 16px 12px;
            font-size: 15px;
            font-weight: 600;
            text-align: center;
            border: none;
          }
          
          .test-table td {
            padding: 14px 12px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
            color: #4b5563;
          }
          
          .test-table tr:nth-child(even) {
            background-color: #f9fafb;
          }
          
          .test-table tr:hover {
            background-color: #f3f4f6;
          }
          
          .normal {
            color: #10b981;
            font-weight: 600;
            background: #d1fae5;
            padding: 4px 12px;
            border-radius: 20px;
            display: inline-block;
          }
          
          .abnormal {
            color: #ef4444;
            font-weight: 600;
            background: #fee2e2;
            padding: 4px 12px;
            border-radius: 20px;
            display: inline-block;
          }
          
          .pending {
            color: #f59e0b;
            font-weight: 600;
            background: #fef3c7;
            padding: 4px 12px;
            border-radius: 20px;
            display: inline-block;
          }
          
          .single-test {
            background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 40px;
            border: 2px solid #fbbf24;
          }
          
          .single-test h3 {
            color: #d97706;
            font-size: 22px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #fbbf24;
          }
          
          .test-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
          }
          
          .test-detail-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          
          .test-detail-item strong {
            color: #4b5563;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
          }
          
          .test-detail-item span {
            color: #1f2937;
            font-size: 16px;
            font-weight: 600;
          }
          
          .notes-box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            margin-top: 15px;
          }
          
          .notes-box strong {
            color: #4b5563;
            display: block;
            margin-bottom: 10px;
            font-size: 15px;
          }
          
          .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 25px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
            background: #f9fafb;
            padding: 25px;
            border-radius: 10px;
          }
          
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 25px;
            border-top: 1px dashed #d1d5db;
          }
          
          .signature-box {
            text-align: center;
            flex: 1;
            margin: 0 15px;
          }
          
          .signature-line {
            border-bottom: 1px solid #4b5563;
            padding-bottom: 5px;
            margin-bottom: 10px;
            min-width: 200px;
            display: inline-block;
          }
          
          .print-meta {
            display: flex;
            justify-content: space-between;
            background: #f3f4f6;
            padding: 15px 20px;
            border-radius: 10px;
            margin-top: 20px;
            font-size: 13px;
          }
          
          @media print {
            body {
              padding: 15px !important;
            }
            .no-print {
              display: none !important;
            }
            .header, .patient-info, .test-section, .single-test {
              break-inside: avoid;
            }
          }
          
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(0, 0, 0, 0.05);
            z-index: -1;
            font-weight: bold;
            pointer-events: none;
          }
        </style>
      </head>
      <body>
        <div class="watermark">گزارش پزشکی</div>
        
        <div class="header">
          <div class="logo">🏥 مرکز تخصصی همودیالیز</div>
          <h1>${type === 'all' ? 'گزارش کامل آزمایشات پزشکی' : 'گزارش آزمایش پزشکی'}</h1>
          <p>این گزارش به صورت خودکار توسط سیستم مدیریت پرونده پزشکی تولید شده است</p>
          <p>مهر و امضای الکترونیک معتبر</p>
        </div>
        
        <div class="patient-info">
          <div>
            <h3>اطلاعات بیمار</h3>
            <p><strong>نام و نام خانوادگی:</strong> ${patient.fullName}</p>
            <p><strong>سن:</strong> ${patient.age} سال</p>
            <p><strong>جنسیت:</strong> ${patient.gender}</p>
            <p><strong>شماره پرونده:</strong> ${patient.medicalRecordNumber}</p>
            <p><strong>کد ملی:</strong> ${patient.nationalId || '---'}</p>
            <p><strong>گروه خونی:</strong> ${patient.bloodType || '---'}</p>
          </div>
          <div class="doctor-info">
            <h3>اطلاعات پزشک معالج</h3>
            <p><strong>نام پزشک:</strong> ${doctorInfo.name}</p>
            <p><strong>تخصص:</strong> ${doctorInfo.specialty}</p>
            <p><strong>کد نظام پزشکی:</strong> ${doctorInfo.code}</p>
            <p><strong>تاریخ ویزیت آخر:</strong> ${patient.lastVisit || '---'}</p>
          </div>
        </div>
        
        ${type === 'all' ? `
          <div class="test-section">
            <h2>لیست کامل آزمایشات انجام شده</h2>
            <table class="test-table">
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>نام آزمایش</th>
                  <th>تاریخ نمونه‌گیری</th>
                  <th>نتیجه</th>
                  <th>محدوده نرمال</th>
                  <th>وضعیت</th>
                  <th>یادداشت</th>
                </tr>
              </thead>
              <tbody>
                ${tests.map((test, index) => {
                  let status = 'pending';
                  let statusText = 'در انتظار';
                  let statusClass = 'pending';
                  
                  if (test.result && test.normalRange) {
                    const numResult = parseFloat(test.result);
                    const rangeParts = test.normalRange.split('-').map(p => parseFloat(p.trim()));
                    if (rangeParts.length === 2) {
                      if (numResult >= rangeParts[0] && numResult <= rangeParts[1]) {
                        status = 'normal';
                        statusText = 'نرمال';
                        statusClass = 'normal';
                      } else {
                        status = 'abnormal';
                        statusText = 'غیرنرمال';
                        statusClass = 'abnormal';
                      }
                    }
                  }
                  
                  return `
                    <tr>
                      <td>${index + 1}</td>
                      <td><strong>${test.testName}</strong></td>
                      <td>${test.date || '---'}</td>
                      <td><strong>${test.result || '---'}</strong></td>
                      <td>${test.normalRange || '---'}</td>
                      <td><span class="${statusClass}">${statusText}</span></td>
                      <td>${test.notes || '---'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="single-test">
            <h3>${singleTest.testName}</h3>
            <div class="test-details">
              <div class="test-detail-item">
                <strong>تاریخ نمونه‌گیری:</strong>
                <span>${singleTest.date || '---'}</span>
              </div>
              <div class="test-detail-item">
                <strong>نتیجه آزمایش:</strong>
                <span>${singleTest.result || '---'}</span>
              </div>
              <div class="test-detail-item">
                <strong>محدوده نرمال:</strong>
                <span>${singleTest.normalRange || '---'}</span>
              </div>
              <div class="test-detail-item">
                <strong>وضعیت:</strong>
                ${(() => {
                  if (!singleTest.result || !singleTest.normalRange) {
                    return '<span class="pending">در انتظار</span>';
                  }
                  const numResult = parseFloat(singleTest.result);
                  const rangeParts = singleTest.normalRange.split('-').map(p => parseFloat(p.trim()));
                  if (rangeParts.length === 2) {
                    if (numResult >= rangeParts[0] && numResult <= rangeParts[1]) {
                      return '<span class="normal">نرمال</span>';
                    } else {
                      return '<span class="abnormal">غیرنرمال</span>';
                    }
                  }
                  return '<span>---</span>';
                })()}
              </div>
            </div>
            ${singleTest.notes ? `
              <div class="notes-box">
                <strong>توضیحات و یادداشت پزشک:</strong>
                <p>${singleTest.notes}</p>
              </div>
            ` : ''}
          </div>
        `}
        
        <div class="footer">
          <div class="signatures">
            <div class="signature-box">
              <div class="signature-line"></div>
              <p>امضای مسئول آزمایشگاه</p>
              <p>تاریخ تأیید: ${printDate}</p>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <p>امضای پزشک معالج</p>
              <p>${doctorInfo.name}</p>
            </div>
          </div>
          
          <div class="print-meta">
            <div>
              <strong>تاریخ پرینت:</strong> ${printDate}
            </div>
            <div>
              <strong>ساعت پرینت:</strong> ${printTime}
            </div>
            <div>
              <strong>شناسه گزارش:</strong> REP-${Date.now().toString().slice(-8)}
            </div>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
            این سند دارای ارزش قانونی و پزشکی می‌باشد. هرگونه کپی‌برداری بدون مجوز ممنوع است.
          </p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 40px; padding: 20px; background: #f3f4f6; border-radius: 10px;">
          <h3 style="color: #4f46e5; margin-bottom: 15px;">راهنمای پرینت</h3>
          <p style="margin-bottom: 10px; color: #4b5563;">
            برای بهترین نتیجه پرینت، از تنظیمات زیر استفاده کنید:
          </p>
          <ul style="text-align: right; display: inline-block; margin: 0 auto; color: #6b7280;">
            <li>اندازه کاغذ: A4</li>
            <li>جهت صفحه: Portrait (عمودی)</li>
            <li>حاشیه‌ها: Normal</li>
            <li>مقیاس: 100%</li>
          </ul>
          <div style="margin-top: 20px;">
            <button onclick="window.print()" style="padding: 12px 30px; background: linear-gradient(to right, #4f46e5, #7c3aed); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin: 0 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              🖨️ پرینت گزارش
            </button>
            <button onclick="window.close()" style="padding: 12px 30px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin: 0 10px;">
              ✕ بستن پنجره
            </button>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            // به صورت خودکار بعد از 1 ثانیه پرینت شود
            setTimeout(() => {
              window.print();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleDownloadPDF = async () => {
    // در اینجا می‌توانید منطق دانلود PDF اضافه کنید
    alert('در حال توسعه قابلیت دانلود PDF...');
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
      >
        <FiPrinter className="w-4 h-4 md:w-5 md:h-5" />
        <span className="text-sm md:text-base">پرینت گزارش</span>
      </button>
      
      <button
        onClick={handleDownloadPDF}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
      >
        <FiDownload className="w-4 h-4 md:w-5 md:h-5" />
        <span className="text-sm md:text-base">دانلود PDF</span>
      </button>
      
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
      >
        <FiFileText className="w-4 h-4 md:w-5 md:h-5" />
        <span className="text-sm md:text-base">مشاهده گزارش</span>
      </button>
    </div>
  );
};

export default PrintComponent;