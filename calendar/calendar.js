const dayjs = require('dayjs')
const argv = require('minimist')(process.argv.slice(2))

const date = argv.y && argv.m ? dayjs(new Date(argv.y, argv.m - 1)) : dayjs()
const BeginningOfMonth = date.set('date', 1)

const saturday = DateNumber => {
  return (date.set('date', DateNumber).day() === 6)
}

console.log(`      ${date.get('month') + 1}月 ${date.get('year')}`)
console.log('日 月 火 水 木 金 土')

for (let count = 0; BeginningOfMonth.day() > count; count++) {
  process.stdout.write('   ')
}
for (let DateNumber = 1; date.daysInMonth() >= DateNumber; DateNumber++) {
  process.stdout.write(DateNumber.toString().padStart(2, ' '))
  process.stdout.write(saturday(DateNumber) ? '\n' : ' ')
}
process.stdout.write('\n')
