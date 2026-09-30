import { connection } from 'next/server'
import Markdown, { type Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { mdxComponents } from '../../../mdx-components'
import { normalizeNotionMarkdown } from '@/lib/notion-markdown'

export default async function PrivacyPolicyPage() {
  await connection()

  const apiKey = process.env.NOTION_API_KEY
  const pageId = process.env.NOTION_PAGE_ID
  if (!apiKey || !pageId) {
    throw new Error('NOTION_API_KEY와 NOTION_PAGE_ID를 설정해야 합니다.')
  }

  const pageUrl = `https://api.notion.com/v1/pages/${encodeURIComponent(pageId)}`
  const options = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Notion-Version': '2026-03-11',
    },
    next: { revalidate: 300 },
  }
  const [pageResponse, markdownResponse] = await Promise.all([
    fetch(pageUrl, options),
    fetch(`${pageUrl}/markdown`, options),
  ])

  if (!pageResponse.ok || !markdownResponse.ok) {
    throw new Error(`Notion 개인정보 처리방침 조회 실패 (페이지 ${pageResponse.status}, 본문 ${markdownResponse.status})`)
  }

  const page = await pageResponse.json() as {
    properties?: Record<string, { type?: string; title?: { plain_text: string }[] }>
  }
  const data = await markdownResponse.json() as {
    markdown?: string
    truncated?: boolean
    unknown_block_ids?: string[]
  }
  const title = Object.values(page.properties ?? {})
    .find((property) => property.type === 'title')
    ?.title?.map((text) => text.plain_text).join('').trim()

  if (!title) {
    throw new Error('Notion 개인정보 처리방침 페이지 제목이 없습니다.')
  }

  if (
    !data.markdown?.trim() ||
    data.truncated ||
    data.unknown_block_ids?.length ||
    /<unknown\b/i.test(data.markdown)
  ) {
    throw new Error('Notion 개인정보 처리방침이 비어 있거나 일부 내용을 표시할 수 없습니다.')
  }

  return (
    <article className="text-text-secondary leading-7 [&>*:first-child]:mt-0">
      <h1 className="text-text-primary text-3xl font-bold mb-4">{title}</h1>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={mdxComponents as Components}
      >
        {normalizeNotionMarkdown(data.markdown)}
      </Markdown>
    </article>
  )
}
