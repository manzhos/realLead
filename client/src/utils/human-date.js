const humanDate = (ts) =>{
  const date = new Date(ts)

  const MONTH = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  // console.log('h-date:', date.getDate() + ' ' + MONTH[Number(date.getMonth())] + ' ' + date.getFullYear() + ' / ' + date.getHours() + ':' + (date.getMinutes() === 0 ? '00' : (String(date.getMinutes()).length === 1 ? '0' + date.getMinutes() : date.getMinutes())));
  return date.getDate() + ' ' + MONTH[Number(date.getMonth())] + ' ' + date.getFullYear() + ' / ' + date.getHours() + ':' + (date.getMinutes() === 0 ? '00' : (String(date.getMinutes()).length === 1 ? '0' + date.getMinutes() : date.getMinutes()))
}

export default humanDate