import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import {
  architectureDiagram,
  burdenFramework,
  cobolSnippet,
  errorGallery,
  userQuotes,
  behoerdendeutsch,
  researchSources,
  improvementVision,
} from '../researchData';

const ResearchTab = () => {
  const [expandedError, setExpandedError] = useState<string | null>(null);

  return (
    <div className="research-tab">
      {/* Introduction */}
      <section className="research-section intro-section">
        <h2>🔬 Forschungsdossier: IT-Infrastruktur der BA</h2>
        <p className="intro-text">
          Die Bundesagentur für Arbeit betreibt einen <strong>hybriden "Frankenstein-Stack"</strong>: 
          Moderne Web-Frontends treffen auf 40+ Jahre alte COBOL-Mainframe-Logik. 
          Diese Dokumentation basiert auf öffentlich zugänglichen Quellen – 
          Bundesrechnungshof-Berichte, akademische Forschung und Nutzerbeschwerden.
        </p>
        <div className="disclaimer-box">
          ⚠️ <strong>Satirische Aufbereitung:</strong> Die dargestellten technischen Probleme sind real, 
          die Präsentation ist bewusst zugespitzt.
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="research-section">
        <h3>🏗️ {architectureDiagram.title}</h3>
        <div className="architecture-box">
          <pre className="ascii-diagram">{architectureDiagram.diagram}</pre>
        </div>
        <p className="section-description">{architectureDiagram.description}</p>
      </section>

      {/* Administrative Burden Framework */}
      <section className="research-section">
        <h3>📚 Administrative Burden Framework</h3>
        <p className="section-intro">
          Nach Herd & Moynihan (2022): Drei Kostenarten, die Bürger:innen davon abhalten, 
          ihnen zustehende Leistungen in Anspruch zu nehmen.
        </p>
        <div className="burden-cards">
          {burdenFramework.map((cost, index) => (
            <motion.div
              key={cost.type}
              className="burden-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="burden-icon">{cost.icon}</span>
              <h4>{cost.type}</h4>
              <p className="burden-definition">{cost.definition}</p>
              <div className="burden-example">
                <span className="example-label">BA-Beispiel:</span>
                <span>{cost.example}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COBOL Code */}
      <section className="research-section">
        <h3>💾 Legacy-Code: Das 2-MB-Limit</h3>
        <p className="section-intro">
          Warum können Sie keine Dateien über 2 MB hochladen? 
          Der COBOL-Quellcode definiert eine feste Array-Größe:
        </p>
        <div className="code-block">
          <div className="code-header">
            <span className="code-lang">COBOL</span>
            <span className="code-file">UPLOAD-FILE-HANDLER.cbl</span>
          </div>
          <pre className="code-content">{cobolSnippet}</pre>
        </div>
        <p className="code-explanation">
          <code>PIC X(2097152)</code> = 2.097.152 Bytes = 2 MB. 
          Eine Änderung würde die Recompilation aller abhängigen Programme erfordern – 
          ein Mainframe-Horror-Szenario.
        </p>
      </section>

      {/* Error Gallery */}
      <section className="research-section">
        <h3>🚨 Fehlergalerie</h3>
        <p className="section-intro">
          Die häufigsten Fehlermeldungen und ihre technischen Ursachen:
        </p>
        <div className="error-accordion">
          {errorGallery.map((error) => (
            <div key={error.id} className="error-item">
              <button
                className={`error-header ${expandedError === error.id ? 'expanded' : ''}`}
                onClick={() => setExpandedError(expandedError === error.id ? null : error.id)}
              >
                <div className="error-header-content">
                  <span className={`error-severity ${error.severity.toLowerCase()}`}>
                    {error.severity}
                  </span>
                  <span className="error-code">{error.id}</span>
                  <span className="error-title">{error.title}</span>
                </div>
                <FaChevronDown className={`chevron ${expandedError === error.id ? 'open' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedError === error.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="error-content"
                  >
                    <div className="error-description">
                      <strong>Meldung:</strong> {error.description}
                    </div>
                    <div className="error-cause">
                      <strong>Ursache:</strong> {error.cause}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Behördendeutsch */}
      <section className="research-section">
        <h3>📝 Behördendeutsch als Sludge</h3>
        <p className="section-intro">
          Komplexe juristische Terminologie erhöht die psychologischen Kosten 
          und reduziert die Inanspruchnahme.
        </p>
        <div className="behoerdendeutsch-table">
          <div className="table-header">
            <span>Begriff</span>
            <span>Bedeutung</span>
            <span>Problem</span>
          </div>
          {behoerdendeutsch.map((item, index) => (
            <motion.div
              key={index}
              className="table-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="term">{item.term}</span>
              <span className="meaning">{item.meaning}</span>
              <span className="problem">{item.problem}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* User Quotes */}
      <section className="research-section">
        <h3>💬 Stimmen aus der Community</h3>
        <div className="quotes-grid">
          {userQuotes.map((quote, index) => (
            <motion.div
              key={index}
              className="quote-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="quote-metaphor">"{quote.metaphor}"</div>
              <p className="quote-text">"{quote.quote}"</p>
              <div className="quote-rating">{quote.rating}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision for Improvement */}
      <section className="research-section">
        <h3>💡 Vision: Wie es besser geht</h3>
        <div className="vision-grid">
          {improvementVision.map((item, index) => (
            <motion.div
              key={index}
              className="vision-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="vision-icon">{item.icon}</span>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="research-section sources-section">
        <h3>📖 Quellen</h3>
        <div className="sources-grid">
          {researchSources.map((source, index) => (
            <motion.div
              key={index}
              className="source-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="source-category">{source.category}</span>
              <div className="source-title">
                {source.title} ({source.year})
              </div>
              <div className="source-description">{source.description}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResearchTab;