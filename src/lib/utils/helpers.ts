import { CalendarDate } from "@internationalized/date";
import type { MonthYear } from "../import/import.store";

export function getDateString(date: Date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
}

export function getMonthStartAndEnd(monthYear: MonthYear) {
    const start = new CalendarDate(
        monthYear.year,
        monthYear.month,
        1,
    )
    const end = start.add({ months: 1 });
    const lastDay = end.subtract({ days: 1 })
    return {
        start,
        lastDay,
        end
    }
}