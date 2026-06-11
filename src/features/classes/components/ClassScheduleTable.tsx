import type { ClassScheduleRow } from "@/lib/data/classes";

type Props = {
  title: string;
  rows: readonly ClassScheduleRow[];
  colGroup: string;
  colClass: string;
  colTime: string;
  /** 모든 행이 동일 그룹일 때 첫 열에 표시 (유치반 등) */
  fixedGroupLabel?: string;
};

function groupRowSpans(rows: readonly ClassScheduleRow[]): number[] {
  const spans: number[] = [];
  for (let i = 0; i < rows.length; i++) {
    const g = rows[i].group ?? "";
    if (i > 0 && (rows[i - 1].group ?? "") === g) {
      spans.push(0);
    } else {
      let count = 1;
      for (let j = i + 1; j < rows.length; j++) {
        if ((rows[j].group ?? "") === g) count++;
        else break;
      }
      spans.push(count);
    }
  }
  return spans;
}

export default function ClassScheduleTable({
  title,
  rows,
  colGroup,
  colClass,
  colTime,
  fixedGroupLabel,
}: Props) {
  const showGroupColumn = Boolean(fixedGroupLabel) || rows.some((r) => r.group);
  const spans = showGroupColumn && !fixedGroupLabel ? groupRowSpans(rows) : [];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-brand-600">{title}</h3>
      <div className="overflow-x-auto rounded-xl border border-ink-200 shadow-sm">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50">
              {showGroupColumn && (
                <th scope="col" className="px-3 py-2.5 font-semibold text-ink-800">
                  {colGroup}
                </th>
              )}
              <th scope="col" className="px-3 py-2.5 font-semibold text-ink-800">
                {colClass}
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold text-ink-800">
                {colTime}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-ink-100 last:border-0">
                {showGroupColumn &&
                  (fixedGroupLabel ? (
                    i === 0 && (
                      <th
                        scope="row"
                        rowSpan={rows.length}
                        className="whitespace-nowrap border-r border-ink-100 bg-brand-50/50 px-3 py-2 align-top font-medium text-ink-800"
                      >
                        {fixedGroupLabel}
                      </th>
                    )
                  ) : (
                    spans[i] > 0 && (
                      <th
                        scope="row"
                        rowSpan={spans[i]}
                        className="whitespace-nowrap border-r border-ink-100 bg-brand-50/50 px-3 py-2 align-top font-medium text-ink-800"
                      >
                        {row.group}
                      </th>
                    )
                  ))}
                <td className="px-3 py-2 text-ink-800">{row.className}</td>
                <td className="whitespace-nowrap px-3 py-2 text-ink-700">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
