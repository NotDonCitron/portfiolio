import React from 'react';
import './AIChat.css';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (overrideMessage?: string) => {
    const textToSend = overrideMessage || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!overrideMessage) setInput('');
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(apiUrl + '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API error');
      }

      const data = await response.json();
      const assistantText = data.response;

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: assistantText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      alert('Fehler bei der Verbindung. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "Was sind deine Hauptfaehigkeiten?",
    "Erzaehle mir von deinen Projekten",
    "Was ist dein Hintergrund in der IT?",
    "Wie kann ich dich kontaktieren?",
    "Welche Technologien nutzt du?",
    "Was sind deine Ziele?"
  ];

  return (
    <div className={`chat-container ${!isOpen ? 'minimized' : ''}`}>
      {!isOpen ? (
        <button
          className="chat-toggle-button"
          onClick={() => setIsOpen(true)}
          aria-label="Chat öffnen"
        >
          <span className="chat-icon">💬</span>
        </button>
      ) : (
        <>
          <div className="chat-header">
            <h3>AI Assistent</h3>
            <button className="minimize-button" onClick={() => setIsOpen(false)} aria-label="Chat minimieren">
              −
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
               <div key={msg.id} className={`message ${msg.role}`}>
                 <div className="message-content">{msg.content}</div>
               </div>
             ))}
            {isLoading && (
              <div className="typing-indicator">
                Schreibe...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <div className="suggested-questions">
              <div className="questions-list">
                {suggestedQuestions.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} className="question-button">
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-wrapper">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Stelle eine Frage..."
                className="chat-input"
                disabled={isLoading}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || isLoading} className="send-button">
                {isLoading ? '...' : 'Senden'}
              </button>
            </div>
          </div>
        </>
      )}
    </div >
  );
};

export default AIChat;
