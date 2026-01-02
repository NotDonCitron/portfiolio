import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaUser } from 'react-icons/fa';
import { amtGptSystemPrompt, suggestedQuestions } from '../enhancedProblems';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Simple Amt-GPT response generator (no API needed)
const generateAmtGptResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Password related
  if (lowerMessage.includes('passwort') || lowerMessage.includes('password') || lowerMessage.includes('zurücksetzen')) {
    return "Ein Passwort-Reset per E-Mail ist aus Sicherheitsgründen nicht möglich. Wir senden Ihnen einen PIN-Brief per Post. Lieferzeit: 5-7 Werktage. Gemäß § 16 SGB II sind Sie zur Mitwirkung verpflichtet.";
  }
  
  // Upload related
  if (lowerMessage.includes('upload') || lowerMessage.includes('datei') || lowerMessage.includes('mb') || lowerMessage.includes('groß')) {
    return "Das Upload-Limit beträgt 2,0 MB. Diese Grenze ist in unserem COBOL-Mainframe fest kompiliert (PIC X(2097152)). Eine Änderung würde 6-8 Monate Entwicklungszeit erfordern.";
  }
  
  // Session timeout
  if (lowerMessage.includes('session') || lowerMessage.includes('timeout') || lowerMessage.includes('abgelaufen') || lowerMessage.includes('sitzung')) {
    return "Das 5-Minuten-Timeout ist eine bewährte Sicherheitsmaßnahme. Auto-Save ist technisch nicht kompatibel mit unserem Batch-Processing-System. Bitte arbeiten Sie zügiger.";
  }
  
  // Weekend/Offline
  if (lowerMessage.includes('wochenende') || lowerMessage.includes('offline') || lowerMessage.includes('wartung') || lowerMessage.includes('samstag') || lowerMessage.includes('sonntag')) {
    return "Das Portal ist Freitag 18:00 bis Montag 06:00 offline für nächtliche Batch-Läufe. Unser COBOL-Mainframe benötigt diese Zeit zur Synchronisation. Bitte planen Sie Ihre Anträge werktags.";
  }
  
  // BundID
  if (lowerMessage.includes('bundid') || lowerMessage.includes('ausweis') || lowerMessage.includes('127.0.0.1') || lowerMessage.includes('fehler')) {
    return "Fehler 127.0.0.1:24727 bedeutet, dass die AusweisApp2 auf Ihrem PC nicht läuft. Sie benötigen zwei Geräte (PC + Smartphone) gleichzeitig. Dies ist aus Sicherheitsgründen erforderlich.";
  }
  
  // Phone anxiety
  if (lowerMessage.includes('telefon') || lowerMessage.includes('anruf') || lowerMessage.includes('angst') || lowerMessage.includes('phobie')) {
    return "Telefonische Erreichbarkeit ist Bestandteil Ihrer Mitwirkungspflichten gemäß § 16 SGB II. Unsere Sachbearbeiter rufen Sie gerne von einer unterdrückten Nummer an.";
  }
  
  // Sync delay
  if (lowerMessage.includes('sync') || lowerMessage.includes('sichtbar') || lowerMessage.includes('sachbearbeiter') || lowerMessage.includes('änderung')) {
    return "Ihre Eingaben werden in der nächtlichen Batch um 22:00 Uhr synchronisiert. Der Sachbearbeiter sieht Änderungen nach 24-48 Stunden. Dies ist systembedingt und kann nicht beschleunigt werden.";
  }
  
  // Python/Job matching
  if (lowerMessage.includes('python') || lowerMessage.includes('zoo') || lowerMessage.includes('vermittlung') || lowerMessage.includes('job')) {
    return "Unser DKZ-Katalog klassifiziert Berufe nach Schlüsselwörtern. 'Python' wurde als Tierpflege interpretiert. Bei Ablehnung des Vermittlungsvorschlags: Sanktionsrisiko gemäß § 31 SGB II.";
  }
  
  // VerBIS
  if (lowerMessage.includes('verbis') || lowerMessage.includes('system') || lowerMessage.includes('mainframe')) {
    return "VerBIS ist unser zentrales Vermittlungs- und Beratungsinformationssystem. Es läuft auf einem IBM z/OS Mainframe mit COBOL-Programmen (Baujahr ~1985). Modernisierung ist geplant für 2035.";
  }
  
  // German/Language
  if (lowerMessage.includes('deutsch') || lowerMessage.includes('sprache') || lowerMessage.includes('verstehe') || lowerMessage.includes('eingliederung')) {
    return "'Eingliederungsverwaltungsakt' und 'Mitwirkungspflichten' sind gesetzlich definierte Begriffe. Eine Vereinfachung ist rechtlich nicht zulässig. Bitte rufen Sie unsere Hotline an.";
  }
  
  // Improvement suggestions
  if (lowerMessage.includes('besser') || lowerMessage.includes('verbesser') || lowerMessage.includes('modern') || lowerMessage.includes('update')) {
    return "Ihre Anfrage wurde an die zuständige Stelle weitergeleitet. Bearbeitungszeit: 6-8 Monate. Bei Dringlichkeit wenden Sie sich bitte an Ihren Bundestagsabgeordneten.";
  }
  
  // Default response
  return "Ich verstehe Ihre Anfrage. Leider bin ich ein Bot und kann nur auf das verweisen, was das System erlaubt. Für individuelle Beratung rufen Sie bitte unsere Hotline an (Mo-Fr, 8-18 Uhr, unterdrückte Nummer möglich).";
};

const ChatTab = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Guten Tag! Ich bin Amt-GPT, Ihr virtueller Assistent der Bundesagentur für Arbeit. Wie kann ich Ihnen heute (nicht) helfen?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateAmtGptResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-tab">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-bot-info">
          <FaRobot className="chat-bot-icon" />
          <div>
            <h3>Amt-GPT</h3>
            <span className="status">Online (Batch-Modus)</span>
          </div>
        </div>
        <div className="chat-disclaimer">
          Satirische Simulation • Keine echte Behörde
        </div>
      </div>

      {/* System Prompt Info */}
      <details className="system-prompt-info">
        <summary>ℹ️ Über Amt-GPT</summary>
        <pre className="system-prompt-text">{amtGptSystemPrompt}</pre>
      </details>

      {/* Messages Area */}
      <div className="chat-messages">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`chat-message ${message.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="message-avatar">
                {message.role === 'assistant' ? <FaRobot /> : <FaUser />}
              </div>
              <div className="message-content">
                <p>{message.content}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            className="chat-message assistant typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="message-avatar">
              <FaRobot />
            </div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="suggested-questions">
        <span className="suggestions-label">Fragen Sie:</span>
        <div className="suggestions-list">
          {suggestedQuestions.slice(0, 4).map((question, index) => (
            <button
              key={index}
              className="suggestion-chip"
              onClick={() => handleSuggestedQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Schreiben Sie Ihre Anfrage..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
        />
        <button 
          className="send-button"
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatTab;