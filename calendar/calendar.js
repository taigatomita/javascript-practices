const dayjs = require('dayjs')
const argv = require('minimist')(process.argv.slice(2))

const date = argv.y && argv.m ? dayjs(new Date(argv.y, argv.m - 1)) : dayjs()
const BeginningOfMonth = date.set('date', 1)

const saturday = DateNum => {
  return (date.set('date', DateNum).day() === 6)
}

console.log(`      ${date.get('month') + 1}月 ${date.get('year')}`)
console.log('日 月 火 水 木 金 土')

for (let i = 0; BeginningOfMonth.day() > i; i++) {
  process.stdout.write('   ')
}
for (let DateNum = 1; date.daysInMonth() >= DateNum; DateNum++) {
  process.stdout.write(DateNum.toString().padStart(2, ' '))
  process.stdout.write(saturday(DateNum) ? '\n' : ' ')
}
process.stdout.write('\n')
