import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type NavItem = {
  title: string
  href: string
  order?: number
  subsection?: string
}

export type NavSection = {
  id: string
  title: string
  items: NavItem[]
}

const SECTION_TITLES: Record<string, string> = {
  dds: 'DDS',
  aid: 'App in Dodam',
  team: 'Team',
}

const SECTION_ORDER: Record<string, number> = {
  dds: 0,
  aid: 1,
  team: 2,
}

type RawNavItem = NavItem & { section: string }

function scanDir(dir: string, appRoot: string): RawNavItem[] {
  const results: RawNavItem[] = []

  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return results
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...scanDir(fullPath, appRoot))
    } else if (entry.name === 'page.mdx') {
      const content = fs.readFileSync(fullPath, 'utf-8')
      const { data } = matter(content)
      if (data.title && data.section) {
        const relDir = path.relative(appRoot, dir)
        const href = relDir === '' ? '/' : '/' + relDir.replace(/\\/g, '/')
        results.push({
          title: data.title as string,
          href,
          order: data.order as number | undefined,
          section: data.section as string,
          subsection: data.subsection as string | undefined,
        })
      }
    }
  }

  return results
}

export function getNav(): NavSection[] {
  const appRoot = path.join(process.cwd(), 'src', 'app')
  const items = scanDir(appRoot, appRoot)

  const sectionMap = new Map<string, NavItem[]>()

  for (const { section, title, href, order, subsection } of items) {
    if (!sectionMap.has(section)) sectionMap.set(section, [])
    sectionMap.get(section)!.push({ title, href, order, subsection })
  }

  const sections: NavSection[] = []
  for (const [id, sectionItems] of sectionMap) {
    sections.push({
      id,
      title: SECTION_TITLES[id] ?? id,
      items: sectionItems.sort((a, b) => {
      const subA = a.subsection ?? '';
      const subB = b.subsection ?? '';
      if (subA !== subB) return subA < subB ? -1 : 1;
      return (a.order ?? 99) - (b.order ?? 99);
    }),
    })
  }

  return sections.sort(
    (a, b) => (SECTION_ORDER[a.id] ?? 99) - (SECTION_ORDER[b.id] ?? 99)
  )
}
