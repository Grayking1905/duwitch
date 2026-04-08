import type { Metadata } from 'next'
import { Search, Send, Paperclip, MoreHorizontal, Phone, Video } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Direct messages and team chats on Duwitch',
}

const conversations = [
  {
    id: '1',
    name: 'Sarah Chen',
    handle: '@sarah_codes',
    avatar: 'SC',
    lastMsg: 'The PR looks great! Just one comment on the hook pattern...',
    time: '2m',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Dev Neo',
    handle: '@dev_neo',
    avatar: 'DN',
    lastMsg: 'Ready for the live session at 4pm?',
    time: '15m',
    unread: 0,
    online: true,
  },
  {
    id: '3',
    name: 'Maya Zhang',
    handle: '@maya_z',
    avatar: 'MZ',
    lastMsg: 'Thanks for reviewing the SDK integration!',
    time: '1h',
    unread: 0,
    online: false,
  },
  {
    id: '4',
    name: 'Cloud Ops Team',
    handle: '#devops',
    avatar: 'CO',
    lastMsg: 'Deployment to staging complete ✅',
    time: '3h',
    unread: 5,
    online: true,
  },
  {
    id: '5',
    name: 'Adam UI/UX',
    handle: '@adam_ui_ux',
    avatar: 'AU',
    lastMsg: 'Check out the new design tokens I pushed',
    time: '1d',
    unread: 0,
    online: false,
  },
]

const messages = [
  {
    id: '1',
    sender: 'Sarah Chen',
    avatar: 'SC',
    content:
      'Hey! I just reviewed your PR on the workspace socket layer. The approach looks solid.',
    time: '10:32 AM',
    isMine: false,
  },
  {
    id: '2',
    sender: 'You',
    avatar: 'AR',
    content: 'Thanks Sarah! Did you have any concerns about the connection pooling strategy?',
    time: '10:35 AM',
    isMine: true,
  },
  {
    id: '3',
    sender: 'Sarah Chen',
    avatar: 'SC',
    content:
      'The PR looks great! Just one comment on the hook pattern — maybe we should use the factory approach for better tree-shaking? I left an inline suggestion.',
    time: '10:38 AM',
    isMine: false,
  },
]

export default function MessagesPage() {
  return (
    <div className="flex h-full animate-fade-in">
      {/* Conversations List */}
      <div
        className="flex w-[320px] shrink-0 flex-col bg-surface-elevated"
        style={{ borderRight: '1px solid rgba(70, 71, 82, 0.1)' }}
      >
        <div className="p-4">
          <h2 className="mb-3 font-display text-lg font-bold">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Search conversations..."
              className="input-field py-2 pl-9 text-sm"
            />
          </div>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto">
          {conversations.map((conv, i) => (
            <button
              key={conv.id}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-bright/50 ${
                i === 0 ? 'bg-surface-bright/30' : ''
              }`}
            >
              <div className="relative shrink-0">
                <div className="gradient-brand flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">
                  {conv.avatar}
                </div>
                {conv.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-elevated bg-neon-cyan" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between">
                  <span className="truncate text-sm font-semibold">{conv.name}</span>
                  <span className="shrink-0 font-label text-[10px] text-text-muted">
                    {conv.time}
                  </span>
                </div>
                <p className="truncate text-xs text-text-muted">{conv.lastMsg}</p>
              </div>
              {conv.unread > 0 && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Chat Header */}
        <div
          className="flex h-14 shrink-0 items-center justify-between px-5"
          style={{ borderBottom: '1px solid rgba(70, 71, 82, 0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="gradient-brand flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white">
                SC
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-base bg-neon-cyan" />
            </div>
            <div>
              <span className="text-sm font-semibold">Sarah Chen</span>
              <p className="font-label text-[10px] text-neon-cyan">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-bright/50 hover:text-text-primary">
              <Phone className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-bright/50 hover:text-text-primary">
              <Video className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-bright/50 hover:text-text-primary">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.isMine ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`h-8 w-8 rounded-full ${msg.isMine ? 'gradient-brand-vivid' : 'gradient-brand'} flex shrink-0 items-center justify-center text-[10px] font-bold text-white`}
              >
                {msg.avatar}
              </div>
              <div className={`max-w-[70%] ${msg.isMine ? 'text-right' : ''}`}>
                <div
                  className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.isMine
                      ? 'rounded-tr-md bg-brand-600/20 text-text-primary'
                      : 'rounded-tl-md bg-surface-card text-text-primary'
                  }`}
                >
                  {msg.content}
                </div>
                <p className="mt-1 font-label text-[10px] text-text-muted">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div
          className="flex items-center gap-3 p-4"
          style={{ borderTop: '1px solid rgba(70, 71, 82, 0.1)' }}
        >
          <button className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-bright/50 hover:text-brand-300">
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="input-field flex-1 py-2.5 text-sm"
          />
          <button className="btn btn-primary px-4 py-2.5">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
