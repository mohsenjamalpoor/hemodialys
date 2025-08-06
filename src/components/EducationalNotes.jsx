

export function EducationalNotes({showNotes, setShowNotes}) {
  

  return (
    <div>
      <button
        onClick={() => setShowNotes(!showNotes)}
        className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4"
      >
        {showNotes ? "پنهان کردن نکات آموزشی" : "نمایش نکات آموزشی"}
      </button>

      {showNotes && (
        <div className="bg-gray-200 border rounded-lg p-4 mt-2 text-lg text-gray-800 space-y-2">
          <p>
            • Qb جریان خون است که بر اساس وزن بیمار تعیین می‌شود و باید با دقت تنظیم شود.
          </p>
          <p>
            • Qd یا جریان دیالیز معمولاً دو برابر Qb است تا پاکسازی مناسب انجام شود.
          </p>
          <p>
            • دوز هپارین بر اساس وزن تعیین می‌شود و باید حتما وضعیت PLT و INR بررسی شود.
          </p>
          <p>
            • در بیماران ناپایدار، فیلترهایی که مناسب وضعیت همودینامیک هستند اولویت دارند.
          </p>
          <p>
            • فشار خون پایین می‌تواند خطر افت فشار حین دیالیز را افزایش دهد؛ مراقبت‌های ویژه لازم است.
          </p>
        </div>
      )}
    </div>
  );
}
