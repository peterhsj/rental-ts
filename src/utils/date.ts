import { format, fromUnixTime, isValid, parse } from 'date-fns'

// 'Wed Dec 17 2025 00:00:00 GMT+0800' -> '2025-12-17'
function formatDate (dateString: string): string {
  if (!dateString) {
    return ''
  }
  const date = new Date(dateString)
  const formatted = format(date, 'yyyy-MM-dd')
  return formatted
}

export { formatDate }
