import RemarkMarkdown from '../lib/markdown/markdown'
import NormalNotification from './normal-notification'

type Props = {
  children: React.ReactNode
  className?: string
}

const MarkdownNotification = ({ children, className }: Props) => {
  return (
    <NormalNotification className={`text-xs text-left ${className ?? ''}`}>
      <RemarkMarkdown str={children as string} />
    </NormalNotification>
  )
}
export default MarkdownNotification
