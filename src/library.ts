import { periods } from './data'

export interface LibraryBook {
  name: string
  summary: string
  note?: string
}

export interface Shelf {
  key: string
  title: string
  hue: number
  books: LibraryBook[]
}

export interface LibraryTestament {
  key: 'ot' | 'nt'
  title: string
  shelves: Shelf[]
}

export const leather = ['#9a4a22', '#4a6670', '#a03030', '#6e4a28', '#3f5a50', '#b0732c']

const b = (name: string, summary: string, note?: string): LibraryBook => ({ name, summary, note })

// Summaries are draft teaching text, pending review.
export const library: LibraryTestament[] = [
  {
    key: 'ot',
    title: 'Old Testament',
    shelves: [
      {
        key: 'law',
        title: 'Law',
        hue: 18,
        books: [
          b('Genesis', 'Beginnings: creation, the fall, the flood, and God’s covenant family through Abraham, Isaac, Jacob, and Joseph.'),
          b('Exodus', 'God rescues Israel from Egypt, gives the Law at Sinai, and dwells among them in the tabernacle.'),
          b('Leviticus', 'How a holy God is approached: sacrifices, priests, and laws for holy living.'),
          b('Numbers', 'Israel’s census and forty years of wandering because of unbelief.'),
          b('Deuteronomy', 'Moses’ farewell sermons renewing the covenant before Israel enters the land.'),
        ],
      },
      {
        key: 'history',
        title: 'History',
        hue: 36,
        books: [
          b('Joshua', 'Israel crosses the Jordan, conquers Canaan, and divides the land.'),
          b('Judges', 'A repeating cycle of sin, oppression, and rescue by judges like Gideon and Samson.'),
          b('Ruth', 'A loyal Moabite widow finds a redeemer in Boaz and becomes David’s ancestor.'),
          b('1 Samuel', 'Samuel, the rise and failure of King Saul, and David’s anointing.'),
          b('2 Samuel', 'David’s reign over a united Israel, his triumphs, and his sin.'),
          b('1 Kings', 'Solomon’s glory and temple, then the kingdom splits in two.'),
          b('2 Kings', 'Both kingdoms decline until Israel falls to Assyria and Judah to Babylon.'),
          b('1 Chronicles', 'Genealogies and David’s reign, retold with focus on worship and the temple.'),
          b('2 Chronicles', 'Solomon through the kings of Judah to the exile, with a call to return.'),
          b('Ezra', 'Exiles return to rebuild the temple and renew the Law.'),
          b('Nehemiah', 'Nehemiah rebuilds Jerusalem’s walls and leads spiritual reform.'),
          b('Esther', 'God preserves His people in Persia through a courageous queen.'),
        ],
      },
      {
        key: 'poetry',
        title: 'Poetry & Wisdom',
        hue: 160,
        books: [
          b('Job', 'A righteous man suffers; God’s wisdom and sovereignty answer his questions.'),
          b('Psalms', 'Israel’s songbook of praise, lament, thanks, and trust in God.'),
          b('Proverbs', 'Practical wisdom for daily life, rooted in the fear of the Lord.'),
          b('Ecclesiastes', 'Life “under the sun” is empty apart from God.'),
          b('Song of Solomon', 'A celebration of married love.'),
        ],
      },
      {
        key: 'major',
        title: 'Major Prophets',
        hue: 275,
        books: [
          b('Isaiah', 'Judgment and comfort, pointing to the coming Servant and Messiah.'),
          b('Jeremiah', 'The weeping prophet warns Judah of Babylon and promises a new covenant.'),
          b('Lamentations', 'Poems of grief over Jerusalem’s destruction, with hope in God’s mercy.'),
          b('Ezekiel', 'Visions to the exiles: God’s glory departs, then a restored temple and people.'),
          b('Daniel', 'Faithful exiles in Babylon, and visions of God’s kingdom over all nations.'),
        ],
      },
      {
        key: 'minor',
        title: 'Minor Prophets',
        hue: 330,
        books: [
          b('Hosea', 'God’s faithful love for unfaithful Israel, pictured in a prophet’s marriage.'),
          b('Joel', 'A locust plague points to the coming Day of the Lord and the Spirit poured out.'),
          b('Amos', 'A shepherd calls Israel to justice and righteousness.'),
          b('Obadiah', 'Judgment on Edom for its pride and violence against Judah.'),
          b('Jonah', 'A reluctant prophet learns God’s mercy reaches even Nineveh.'),
          b('Micah', 'Judgment for corruption and the promise of a ruler born in Bethlehem.'),
          b('Nahum', 'The fall of Nineveh: God judges oppression.'),
          b('Habakkuk', 'A prophet questions God and learns that the righteous live by faith.'),
          b('Zephaniah', 'The coming Day of the Lord, and a remnant restored.'),
          b('Haggai', 'Returned exiles are urged to put God’s house first.'),
          b('Zechariah', 'Visions encouraging the temple rebuild and pointing to the coming King.'),
          b('Malachi', 'Final Old Testament call to faithfulness, and the promise of a messenger.'),
        ],
      },
    ],
  },
  {
    key: 'nt',
    title: 'New Testament',
    shelves: [
      {
        key: 'gospels',
        title: 'Gospel Accounts',
        hue: 215,
        books: [
          b('Matthew', 'Jesus is the promised King and Messiah, fulfilling the Old Testament.'),
          b('Mark', 'Jesus the suffering Servant, in a fast-paced account of action.'),
          b('Luke', 'Jesus the Savior of all people, told as an orderly historical account.'),
          b('John', 'Jesus the Son of God, so that readers may believe and have life.'),
        ],
      },
      {
        key: 'nt-history',
        title: 'History',
        hue: 190,
        books: [b('Acts', 'The Spirit comes and the church spreads from Jerusalem to Rome.')],
      },
      {
        key: 'pauline',
        title: 'Pauline Epistles',
        hue: 245,
        books: [
          b('Romans', 'The gospel: righteousness from God by faith for Jew and Gentile.'),
          b('1 Corinthians', 'Correcting divisions and disorder in a troubled church.'),
          b('2 Corinthians', 'Paul defends his ministry and finds strength in weakness.'),
          b('Galatians', 'Freedom in Christ: we are justified by faith, not works of the Law.'),
          b('Ephesians', 'The church as Christ’s body, and how to walk worthy of the calling.'),
          b('Philippians', 'Joy in Christ, even in prison.'),
          b('Colossians', 'The supremacy and sufficiency of Christ.'),
          b('1 Thessalonians', 'Encouragement to a young church, and hope in Christ’s return.'),
          b('2 Thessalonians', 'Steadfastness and clarity about the Day of the Lord.'),
          b('1 Timothy', 'Guidance on church order and leadership for a young preacher.'),
          b('2 Timothy', 'Paul’s final charge: guard the gospel and endure.'),
          b('Titus', 'Sound doctrine and good works in the churches of Crete.'),
          b('Philemon', 'A personal plea to receive a runaway slave as a brother.'),
          b('Hebrews', 'Christ is better than angels, Moses, and the priesthood; hold fast in faith.', 'Author is not named; traditionally grouped with Paul’s letters.'),
        ],
      },
      {
        key: 'general',
        title: 'General Epistles',
        hue: 300,
        books: [
          b('James', 'Faith that is real shows itself in works and wisdom.'),
          b('1 Peter', 'Hope and holy living for Christians who suffer.'),
          b('2 Peter', 'Grow in knowledge and beware of false teachers.'),
          b('1 John', 'Assurance of eternal life: walk in light, love, and truth.'),
          b('2 John', 'Walk in truth and love, and guard against deceivers.'),
          b('3 John', 'Support faithful teachers and show hospitality.'),
          b('Jude', 'Contend for the faith against ungodly intruders.'),
        ],
      },
      {
        key: 'prophecy',
        title: 'Prophecy',
        hue: 5,
        books: [b('Revelation', 'Jesus Christ revealed: final judgment, victory over evil, and the new creation.')],
      },
    ],
  },
]

export interface BookPeriod {
  number: number
  name: string
  rhyme: string
}

export const periodsForBook = (name: string): BookPeriod[] =>
  periods
    .filter((p) => p.bibleBooks.some((x) => x.book === name))
    .map((p) => ({ number: p.number, name: p.name, rhyme: p.rhyme }))
