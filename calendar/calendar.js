const dayjs = require('dayjs')
const argv = require('minimist')(process.argv.slice(2))

const date = argv.y && argv.m ? dayjs(new Date(argv.y, argv.m - 1)) : dayjs()
const beginningOfMonth = date.set('date', 1)

const isSaturday = dateNumber => {
  return (date.set('date', dateNumber).day() === 6)
}

console.log(`      ${date.get('month') + 1}月 ${date.get('year')}`)
console.log('日 月 火 水 木 金 土')

for (let count = 0; beginningOfMonth.day() > count; count++) {
  process.stdout.write('   ')
}
for (let dateNumber = 1; date.daysInMonth() >= dateNumber; dateNumber++) {
  process.stdout.write(dateNumber.toString().padStart(2, ' '))
  process.stdout.write(isSaturday(dateNumber) ? '\n' : ' ')
}
process.stdout.write('\n')
