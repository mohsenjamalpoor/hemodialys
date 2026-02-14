import React from "react";

// کامپوننت AlertCard
const AlertCard = React.memo(({ 
  title, 
  description, 
  icon,
  color = 'yellow'
}) => {
  const colors = {
    yellow: { bg: 'bg-gradient-to-r from-yellow-50 to-orange-50', border: 'border-yellow-200', text: 'text-yellow-600' },
    orange: { bg: 'bg-gradient-to-r from-orange-50 to-red-50', border: 'border-orange-200', text: 'text-orange-600' },
    blue: { bg: 'bg-gradient-to-r from-blue-50 to-cyan-50', border: 'border-blue-200', text: 'text-blue-600' },
    red: { bg: 'bg-gradient-to-r from-red-50 to-pink-50', border: 'border-red-200', text: 'text-red-600' },
    amber: { bg: 'bg-gradient-to-r from-amber-50 to-yellow-50', border: 'border-amber-200', text: 'text-amber-600' }
  };

  const selectedColor = colors[color] || colors.yellow;

  return (
    <div className={`${selectedColor.bg} border ${selectedColor.border} rounded-xl p-2 md:p-3 hover:shadow-md transition`}>
      <div className="flex items-start gap-2 md:gap-3">
        <span className={`text-base md:text-lg ${selectedColor.text}`}>{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-gray-700 font-medium text-xs md:text-sm mb-1 truncate">{title}</p>
          <p className="text-gray-600 text-xs line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
});

export {AlertCard}