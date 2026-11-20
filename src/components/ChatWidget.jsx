import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Send, Bot, User, Sparkles, X, MessageSquareText, RotateCcw, Copy, Check } from 'lucide-react';
import { ThinkingOrb } from './ThinkingOrb';
import { useModalFocus } from '../hooks/useModalFocus';
import './ChatWidget.css';

const SUGGESTED_QUESTIONS = [
  "Which projects best show Atharav's work?",
  "What is Atharav building now?"
];

const getOrCreateSessionId = () => {
  try {
    let id = sessionStorage.getItem('ath_chat_session_id');
    if (!id) {
      id = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('ath_chat_session_id', id);
    }
    return id;
  } catch {
    return 'sess_' + Date.now();
  }
};

const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

const safeLink = (url) => {
  try {
    const parsed = new URL(url);
    return ['https:', 'mailto:'].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
};

// Parses markdown bold (**text**), inline code (`code`), and markdown clickable links ([text](url))
const parseLineTokens = (line) => {
  const tokens = line.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={idx}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return <code key={idx} className="chat-inline-code">{token.slice(1, -1)}</code>;
    }
    const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const href = safeLink(linkMatch[2]);
      if (!href) return token;
      return (
        <a
          key={idx}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-link"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return token;
  });
};

const FormattedMessageText = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n').filter((l) => l.trim() !== '');

  return (
    <div className="formatted-chat-text">
      {lines.map((line, lIdx) => {
        const leadingSpaces = line.search(/\S/);
        const isNested = leadingSpaces >= 2;
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.substring(2) : trimmed;
        const renderedTokens = parseLineTokens(cleanLine);

        if (isBullet) {
          return (
            <div key={lIdx} className={`chat-bullet-line${isNested ? ' nested' : ''}`}>
              <span className="chat-bullet-dot">{isNested ? '▪' : '•'}</span>
              <span>{renderedTokens}</span>
            </div>
          );
        }

        return (
          <p key={lIdx} className={`chat-paragraph${isNested ? ' nested-para' : ''}`}>
            {renderedTokens}
          </p>
        );
      })}
    </div>
  );
};

const ChatWidget = () => {
  const [sessionId] = useState(getOrCreateSessionId);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi, I'm Atharav's project assistant. Ask about his work, skills, or what he's building now.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const chatMessagesRef = useRef(null);
  const inputRef = useRef(null);
  const autoQuerySentRef = useRef(null);
  const mobileDialogRef = useRef(null);
  useModalFocus(mobileDialogRef, isOpen, () => setIsOpen(false));

  // Lock outer webpage scrolling and Lenis scroll when mobile fullscreen modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const lenis = window.__lenis;
    if (isOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Scroll internal messages container when new messages arrive or loading starts
  useEffect(() => {
    const container = chatMessagesRef.current;
    if (container) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }, 60);
    }
  }, [messages.length, isLoading]);

  // Isolate scrolling strictly inside the chat container (prevent outer webpage scrolling)
  useEffect(() => {
    const container = chatMessagesRef.current;
    if (!container) return;

    const onWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const delta = e.deltaY;
      const isScrollingDown = delta > 0;
      const isScrollingUp = delta < 0;

      container.scrollTop += delta;

      if (
        (isScrollingDown && scrollTop + clientHeight >= scrollHeight - 1) ||
        (isScrollingUp && scrollTop <= 0) ||
        scrollHeight > clientHeight
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, []);

  const handleSend = useCallback(async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: generateId('user'),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          sessionId: sessionId || getOrCreateSessionId(),
        }),
      });

      const data = await response.json();
      const assistantText =
        data.answer ||
        "I'm sorry, I couldn't fetch an answer right now. Please check back in a moment or view Atharav's [GitHub Profile](https://github.com/Atharav001).";

      setMessages((prev) => [
        ...prev,
        {
          id: generateId('ast'),
          sender: 'assistant',
          text: assistantText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat API request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId('ast_err'),
          sender: 'assistant',
          text: "Sorry, I encountered a network error. Please try again or check Atharav's [GitHub Profile](https://github.com/Atharav001).",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, sessionId]);

  // Send a shared question once, even when loading state changes the callback.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get('query') || params.get('q');
      if (queryParam && autoQuerySentRef.current !== queryParam) {
        const timer = setTimeout(() => {
          autoQuerySentRef.current = queryParam;
          handleSend(queryParam);
        }, 250);
        return () => clearTimeout(timer);
      }
    }
  }, [handleSend]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleClear = () => {
    setMessages([
      {
        id: generateId('welcome'),
        sender: 'assistant',
        text: "Hi, I'm Atharav's project assistant. Ask about his work, skills, or what he's building now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const content = (
    <div className="chat-card">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-title-wrap">
            <Bot size={16} className="chat-bot-icon" />
            <span className="chat-header-title">Atharav / Assistant</span>
            <span className="chat-status-badge">PROJECT Q&amp;A</span>
          </div>
        </div>
        <div className="chat-header-right">
          {messages.length > 1 && (
            <button
              className="chat-header-action-btn"
              onClick={handleClear}
              title="Reset Conversation"
              aria-label="Reset conversation"
              type="button"
            >
              <RotateCcw size={13} />
              <span className="btn-label-desktop">Reset</span>
            </button>
          )}
          {isOpen && (
            <button
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              title="Close Assistant"
              aria-label="Close assistant"
              type="button"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="chat-body">
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message-row ${msg.sender === 'user' ? 'user-row' : 'assistant-row'}`}
            >
              <div className="chat-avatar">
                {msg.sender === 'user' ? (
                  <User size={14} />
                ) : (
                  <Bot size={14} />
                )}
              </div>
              <div className="chat-bubble-container">
                <div className="chat-bubble">
                  <FormattedMessageText text={msg.text} />
                  <div className="chat-bubble-footer">
                    <span className="chat-timestamp">{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        className="chat-copy-btn"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Copy message"
                        aria-label="Copy message"
                        type="button"
                      >
                        {copiedId === msg.id ? (
                          <Check size={11} className="copied-icon" />
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message-row assistant-row">
              <div className="chat-avatar">
                <Bot size={14} />
              </div>
              <div className="chat-bubble-container">
                <div className="chat-bubble thinking-bubble-orb">
                  <ThinkingOrb size={28} speed={1.5} />
                  <span className="thinking-text">Composing grounded answer...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {messages.length <= 2 && !isLoading && (
          <div className="chat-chips-container">
            <div className="chat-chips-label">
              <Sparkles size={11} /> Suggested Inquiries
            </div>
            <div className="chat-chips">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  className="chat-chip"
                  onClick={() => handleSend(q)}
                  type="button"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="chat-footer">
        <form
          className="chat-input-row"
          onSubmit={handleSubmit}
          onClick={() => inputRef.current?.focus()}
        >
          <input
            aria-label="Ask about Atharav's work"
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Ask anything about Atharav's projects, stack, or experience..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!input.trim() || isLoading}
            title="Send Message"
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className="chat-launcher-wrap">
        <div className="chat-launcher-genie" aria-hidden="true">
          <img src="/assets/mascot/blue-genie.png" alt="" />
        </div>
        <button type="button" className="chat-launcher" onClick={() => setIsOpen(true)} aria-label="Open Atharav's project assistant" aria-expanded={isOpen}>
          <MessageSquareText size={19} /> <span>Ask Atharav AI</span>
        </button>
      </div>
      {isOpen && (
        <div className="chat-mobile-overlay" ref={mobileDialogRef} role="dialog" aria-modal="true" aria-label="Portfolio assistant" tabIndex={-1} onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          {content}
        </div>
      )}
    </>,
    document.body
  );
};

export default ChatWidget;
