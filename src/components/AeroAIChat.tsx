import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, X, MessageSquare } from 'lucide-react'
import { getAIResponse } from '../lib/aiLogic'
import type { Itinerary, TripInput } from '../types'

interface Message {
  role: 'user' | 'ai'
  text: string
  suggestions?: string[]
}

interface AeroAIChatProps {
  itinerary: Itinerary | null
  input: TripInput | null
  isOpen: boolean
  onClose: () => void
}

export default function AeroAIChat({ itinerary, input, isOpen, onClose }: AeroAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'Hi! I\'m Aero AI, your personal travel companion. I have access to your full itinerary and can help with flights, hotels, restaurants, directions, budget tips, layovers, and travel problems. What would you like to know?',
      suggestions: ['Tell me about my flights', 'What\'s my trip score?', 'Show me savings tips', 'Best restaurants near my hotel?'],
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    setTimeout(() => {
      const response = getAIResponse(text, itinerary, input)
      setMessages((prev) => [...prev, { role: 'ai', text: response.text, suggestions: response.suggestions }])
      setIsTyping(false)
    }, 600 + Math.random() * 400)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-end sm:p-6">
      <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:w-[420px] h-[80vh] sm:h-[600px] glass rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden animate-fade-up border-glow-red">
        <div className="flex items-center justify-between p-4 border-b border-cream-100/10">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Sparkles className="w-5 h-5 text-cream-100" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-navy-800" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-cream-100">Aero AI</h3>
              <p className="text-xs text-emerald-400">Online · Ready to help</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg bg-cream-100/5 hover:bg-cream-100/10 flex items-center justify-center transition-all">
            <X className="w-5 h-5 text-cream-400" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className="space-y-2">
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-red-500/20 border border-red-500/30 text-cream-100'
                    : 'bg-cream-100/5 border border-cream-100/10 text-cream-200'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
              {msg.suggestions && (
                <div className="flex flex-wrap gap-2 ml-9">
                  {msg.suggestions.map((s, j) => (
                    <button
                      key={j}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div className="bg-cream-100/5 border border-cream-100/10 rounded-2xl px-4 py-3 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-cream-100/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
              placeholder="Ask Aero AI anything..."
              className="flex-1 bg-navy-900/60 border border-cream-100/10 rounded-xl px-4 py-2.5 text-sm text-cream-100 placeholder-cream-500/60 focus:outline-none focus:border-red-500/50 transition-all"
            />
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-cream-100 disabled:opacity-40 hover:scale-105 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AeroAIFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse-glow" />
        <div className="relative w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-xl shadow-red-500/30 hover:scale-110 transition-transform">
          <MessageSquare className="w-6 h-6 text-cream-100" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cream-100 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-red-500" />
        </div>
      </div>
    </button>
  )
}
