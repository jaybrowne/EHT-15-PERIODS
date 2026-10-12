import source from '../15_periods_of_bible_history.json'

// Optimized WebP copies of the original PNGs in /assets are used; Vite resolves their URLs from the project root.
const imageModules = import.meta.glob<string>('/assets-optimized/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

export type Testament = 'ot' | 'between' | 'nt'

export interface BibleBook {
  book: string
  scope?: string
}

export interface Period {
  number: number
  rhyme: string
  name: string
  image: string
  testament: Testament
  memoryScene: string
  historicalExplanation: string
  description: string
  bibleBooks: BibleBook[]
}

interface SourcePeriod {
  number: number
  rhyme: string
  period: string
  description: string
  memoryScene: string
  historicalExplanation: string
  bibleBooks?: BibleBook[]
}

// Source text ends with a "Number<VT>Rhyme<VT>Name" slide footer; it is display
// chrome in the PPTX, so it is dropped from rendered text (JSON is untouched).
const stripFooter = (text: string) =>
  text
    .split('\n')
    .filter((line) => !line.includes('\u000b'))
    .join('\n')
    .trim()

const fileName = (path: string) => path.split('/').pop() ?? path

export const periodImages: Record<number, string> = {}
for (const [path, url] of Object.entries(imageModules)) {
  const match = /^(\d+)-/.exec(fileName(path))
  if (match) periodImages[Number(match[1])] = url
}

const findByName = (name: string) =>
  Object.entries(imageModules).find(([path]) => fileName(path) === name)?.[1]

export const bibleImages = {
  closed: findByName('Holy Bible in a Sunlit Ancient Study.webp'),
  open: findByName('Open Bible in Golden Light.webp'),
}

export const testamentOf = (n: number): Testament =>
  n <= 12 ? 'ot' : n === 13 ? 'between' : 'nt'

const sourcePeriods = source.periods as SourcePeriod[]

export const periods: Period[] = sourcePeriods.map((p) => ({
  number: p.number,
  rhyme: p.rhyme,
  name: p.period,
  image: periodImages[p.number],
  testament: testamentOf(p.number),
  memoryScene: stripFooter(p.memoryScene),
  historicalExplanation: stripFooter(p.historicalExplanation),
  description: stripFooter(p.description),
  bibleBooks: p.bibleBooks ?? [],
}))

export const sourceAttribution: string = source.sourceAttribution
export const appTitle: string = source.title

export const dataProblems: string[] = [
  ...(periods.length !== 15 ? [`Expected 15 periods, found ${periods.length}`] : []),
  ...periods.filter((p) => !p.image).map((p) => `Missing illustration for period ${p.number}`),
  ...(bibleImages.closed ? [] : ['Missing closed Bible illustration']),
  ...(bibleImages.open ? [] : ['Missing open Bible illustration']),
]

export const getPeriod = (n: number) => periods.find((p) => p.number === n)
