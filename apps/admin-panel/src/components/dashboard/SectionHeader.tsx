import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  actionButton?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  gradientFrom = "from-blue-400",
  gradientTo = "to-blue-600",
  actionButton,
}: SectionHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
      </div>
    </div>
  );
}
