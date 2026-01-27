import { format } from 'date-fns'

// 'Wed Dec 17 2025 00:00:00 GMT+0800' -> '2025-12-17'
// 也可接收 Date 物件
function formatDate (dateInput: unknown): string {
  if (!dateInput) {
    return ''
  }

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput as string)
  const formatted = format(date, 'yyyy-MM-dd')
  return formatted
}

export { formatDate }
