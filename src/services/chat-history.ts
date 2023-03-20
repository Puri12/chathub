import Browser from 'webextension-polyfill'
import { BotId } from '~app/bots'
import { ChatMessageModel } from '~types'

interface Conversation {
  id: string
  messages: ChatMessageModel[]
  createdAt: Date
}

interface ChatHistory {
  conversations: Conversation[]
}

export async function loadChatHistory(botId: BotId): Promise<ChatHistory> {
  return {
    conversations: [],
  }
}

export async function getHistoryMessageCount(botId: BotId): Promise<number> {
  const key = `history-message-count-${botId}`
  const { [key]: value } = await Browser.storage.local.get(key)
  return value || 0
}
