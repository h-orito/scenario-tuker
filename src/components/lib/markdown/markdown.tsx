import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'

type Props = {
  str: string
}
const RemarkMarkdown = ({ str }: Props) => {
  return (
    <Markdown
      remarkPlugins={[remarkBreaks]}
      components={{
        p: ({ children }) => <p style={{ marginBottom: '1em' }}>{children}</p>
      }}
    >
      {str}
    </Markdown>
  )
}

export default RemarkMarkdown
