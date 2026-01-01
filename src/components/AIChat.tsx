import React from 'react';

const AIChat = () => {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const hfToken = import.meta.env.VITE_HF_API_TOKEN;
      const model = import.meta.env.VITE_HF_CHAT_MODEL || 'HuggingFaceTB/SmolLM3-3B';

      if (!hfToken) {
        alert('HF API Token fehlt! Bitte VITE_HF_API_TOKEN in .env konfigurieren.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('https://api-inference.huggingface.co/models/' + model, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + hfToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: input,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            do_sample: true
          }
        })
      });

      const data = await response.json();
      const assistantText = data.generated_text;

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: assistantText,
        timestamp: new Date(),
      };

      setMessages([...messages, assistantMessage]);
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
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={'message ' + msg.role}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="typing-indicator">
            Schreibe...
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <div className="suggested-questions">
          <div className="questions-list">
            {suggestedQuestions.map((q, i) => (
              <button key={i} onClick={() => setInput(q); sendMessage();} className="question-button">
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
        <button onClick={sendMessage} disabled={!input.trim() || isLoading} className="send-button">
          {isLoading ? '...' : 'Senden'}
        </button>
      </div>
    </div>
    </div >
  );
};

export default AIChat;
