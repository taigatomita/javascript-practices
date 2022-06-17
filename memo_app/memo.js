const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('./memo_app/memos.db')
const { prompt } = require('enquirer')
const argv = require('minimist')(process.argv.slice(2))
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
const memos = []
const lines = []

function fetchMemos () {
  return new Promise((resolve) => {
    db.all('SELECT * FROM memos', (err, rows) => {
      if (err) console.error('Error!', err)
      rows.forEach((row) => { memos.push(row) })
      resolve(memos)
    })
  })
}

function selectMemos (purpose) {
  return [{
    type: 'select',
    name: 'id',
    message: 'Choose a memo you want to ' + purpose + ':',
    choices: fetchMemos().then(memos => memos.map(memo => ({
      name: memo.text.split(/\n/)[0],
      value: memo.id
    }))),
    result () { return this.focused.value }
  }]
}

class Memo {
  constructor (option) {
    this.option = Object.keys(option)[1] // オプションが2つ以上ある場合、最初のオプションのみが適用される。
  }

  main () {
    if (this.option === 'l') {
      this.showMemos()
    } else if (this.option === 'r') {
      this.showMemoContent()
    } else if (this.option === 'd') {
      this.deleteMemo()
    } else if (!this.option) {
      this.saveMemo()
    } else {
      readline.close()
    }
  }

  showMemos () {
    fetchMemos().then(memos => memos.forEach((memo) => {
      console.log(memo.text.split(/\n/)[0])
    }))
    db.close()
    readline.close()
  }

  showMemoContent () {
    prompt(selectMemos('see'))
      .then(answerMemo => console.log(memos.find(memo => memo.id === answerMemo.id).text))
      .catch(console.error)
    db.close()
  }

  deleteMemo () {
    prompt(selectMemos('delete'))
      .then(answerMemo =>
        db.serialize(() => {
          db.run(`DELETE FROM memos WHERE id = ${answerMemo.id}`)
          db.close()
        })
      )
      .catch(console.error)
  }

  saveMemo () {
    readline.on('line', (line) => {
      lines.push(line)
    })
    readline.on('close', () => {
      db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS memos(id INTEGER PRIMARY KEY, text TEXT)')
        db.run('INSERT INTO memos(text) VALUES(?)', lines.join('\n'))
        readline.close()
        db.close()
      })
    })
  }
}

const memo = new Memo(argv)
memo.main()
