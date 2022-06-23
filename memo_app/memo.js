const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('./memo_app/memos.db')
const { prompt } = require('enquirer')
const argv = process.argv[2]
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
const memos = []
const lines = []

class Memo {
  constructor (option) {
    this.option = option
  }

  async main () {
    if (!this.option) {
      await this.saveMemo().catch((reason) => console.error(reason))
    } else if (this.option === '-l') {
      await this.showMemos()
    } else if (this.option === '-r') {
      await this.showMemoContent()
    } else if (this.option === '-d') {
      await this.deleteMemo()
    } else {
      ;
    }
  }

  async showMemos () {
    const fetchedMemos = await this.fetchMemos()
    fetchedMemos.forEach((memo) => { console.log(memo.text.split(/\n/)[0]) })
  }

  async showMemoContent () {
    const selectedMemo = await prompt(this.setSelectQuestion('see'))
    console.log(memos.find(memo => memo.id === selectedMemo.id).text)
  }

  async deleteMemo () {
    const selectedMemo = await prompt(this.setSelectQuestion('delete'))
    db.run(`DELETE FROM memos WHERE id = ${selectedMemo.id}`)
  }

  saveMemo () {
    return new Promise((resolve) => {
      readline.on('line', (line) => {
        lines.push(line)
      })
      readline.on('close', () => {
        if (lines.length === 0) throw new Error('You must enter the characters')
        db.serialize(() => {
          db.run('CREATE TABLE IF NOT EXISTS memos(id INTEGER PRIMARY KEY, text TEXT)')
          db.run('INSERT INTO memos(text) VALUES(?)', lines.join('\n'))
        })
        resolve()
      })
    })
  }

  fetchMemos () {
    return new Promise((resolve) => {
      db.all('SELECT * FROM memos', (err, rows) => {
        if (err) console.error('Error!', err)
        rows.forEach((row) => { memos.push(row) })
        resolve(memos)
      })
    })
  }

  setSelectQuestion (purpose) {
    return [{
      type: 'select',
      name: 'id',
      message: 'Choose a memo you want to ' + purpose + ':',
      choices: this.fetchMemos().then(memos => memos.map(memo => ({
        name: memo.text.split(/\n/)[0],
        value: memo.id
      }))),
      result () { return this.focused.value }
    }]
  }
}

const memo = new Memo(argv)

memo.main()
  .then(() => {
    db.close()
    readline.close()
  })
