
import { useNavigate } from "react-router-dom";

// صفحه اصلی همودیالیز
export function HemodialysisHome() {
  const navigate = useNavigate();
  const items = [
    { title: "🔬 انتخاب صافی در اطفال", path: "/hemo/filters" },
    { title: "💉 محاسبه سرعت پمپ خون (Qb)", path: "/hemo/qb" },
    { title: "⚠️ عوارض دیالیز و درمان آن", path: "/hemo/complications" },
  ];

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center"> همودیالیز کودکان</h1>
      <div className="grid gap-4">
        {items.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="p-4 bg-blue-100 hover:bg-blue-200 rounded-xl text-right text-lg font-semibold shadow-sm w-full"
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
