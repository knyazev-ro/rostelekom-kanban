import React, { useState, useEffect } from "react";

type MonthData = {
  value: number | string;
  cost: number | string;
  status: string;
};

export type YearlyData = {
  year: number;
  total: number;
} & Record<string, MonthData>; // Месяцы на верхнем уровне

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

type Props = {
  initialData?: Partial<YearlyData>;
  statusOptions: string[]
  onChange?: (data: YearlyData) => void;
};

const YearlyDataForm: React.FC<Props> = ({ initialData, statusOptions,  onChange }) => {
  const [data, setData] = useState<YearlyData>(() => {
    const year = initialData?.year ?? new Date().getFullYear();
    const total = initialData?.total ?? 0;

    const months: Record<string, MonthData> = {};
    monthNames.forEach((m) => {
      months[m] = {
        value: initialData?.[m]?.value ?? "",
        cost: initialData?.[m]?.cost ?? "",
        status: initialData?.[m]?.status ?? "pending",
      };
    });

    return { year, total, ...months };
  });

  useEffect(() => {
    // Обновляем total при изменениях
    const newTotal = monthNames.reduce((sum, m) => {
      const val = parseFloat(data[m].value as string) || 0;
      return sum + val;
    }, 0);

    const updated = { ...data, total: newTotal };
    setData((prev) => (prev.total !== newTotal ? updated : prev));
    onChange?.(updated);
  }, [data, onChange]);

  const handleChange = (
    month: string,
    field: keyof MonthData,
    value: string | number
  ) => {
    setData((prev) => ({
      ...prev,
      [month]: { ...prev[month], [field]: value },
    }));
  };

  console.log(initialData);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">
        Год: {data.year} | Всего: {data.total}
      </h2>

      <div className="grid grid-cols-4 gap-2 bg-gray-100 p-2 font-semibold">
        <div>Месяц</div>
        <div>Выручка</div>
        <div>Затраты</div>
        <div>Статус</div>
      </div>

      {monthNames.map((month) => (
        <div
          key={month}
          className="grid grid-cols-4 gap-2 border-b py-2 items-center"
        >
          <div className="capitalize">{month}</div>

          <input
            type="number"
            className="border rounded p-1 text-sm"
            value={data[month].value}
            onChange={(e) => handleChange(month, "value", e.target.value)}
            placeholder="Введите выручку"
          />

          <input
            type="number"
            className="border rounded p-1 text-sm"
            value={data[month].cost}
            onChange={(e) => handleChange(month, "cost", e.target.value)}
            placeholder="Введите затраты"
          />

          <select
            className="border rounded p-1 text-sm"
            value={data[month].status}
            onChange={(e) => handleChange(month, "status", e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* <pre className="mt-4 bg-gray-50 p-2 text-xs rounded border">
        {JSON.stringify(data, null, 2)}
      </pre> */}
    </div>
  );
};

export default YearlyDataForm;
