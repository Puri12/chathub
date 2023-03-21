import Browser from 'webextension-polyfill'
import { BotId } from '~app/bots'
import { ChatMessageModel } from '~types'

/**
 * conversations:$botId => ConversationMetadata[]
 * conversation:$botId:$id => Conversation
 */

interface Conversation {
  id: string
  messages: ChatMessageModel[]
  createdAt: Date
}

interface ConversationMetadata {
  id: string
}

async function loadHistoryConversations(botId: BotId): Promise<ConversationMetadata[]> {
  const key = `conversations:${botId}`
  const { [key]: value } = await Browser.storage.local.get(key)
  return value || []
}

async function loadConversation(botId: BotId, cid: string): Promise<Conversation | null> {
  const key = `conversation:${botId}:${cid}`
  const { [key]: value } = await Browser.storage.local.get(key)
  return value
}

export async function loadHistoryMessages(botId: BotId): Promise<ChatMessageModel[]> {
  const cs = await loadHistoryConversations(botId)
  const conversations = await Promise.all(cs.map((c) => loadConversation(botId, c.id)))
  const messages: ChatMessageModel[] = []
  for (const c of conversations) {
    if (c) {
      messages.push(...c.messages)
    }
  }
  return messages
}
