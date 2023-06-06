export function parseDate(dateRow, type) {
  switch (type) {
    case 'year':
      return String(parseFloat(dateRow))
      break;
    case 'full':
      return dateRow.split('-').reverse().join('.')
      break;
    default:
      return dateRow
      break;
  }
}