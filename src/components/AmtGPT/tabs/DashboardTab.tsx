import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  burdenIndex,
  comparisonData,
  keyStats,
  trustpilotData,
  brhFindings,
} from '../dashboardData';

const DashboardTab = () => {
  return (
    <div className="dashboard-tab">
      {/* Key Stats Grid */}
      <section className="dashboard-section">
        <h3 className="section-title">📊 Kernzahlen</h3>
        <div className="key-stats-grid">
          {keyStats.map((stat, index) => (
            <motion.div
              key={index}
              className="key-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-source">{stat.source}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Burden Index Radar Chart */}
        <section className="dashboard-section chart-section">
          <h3 className="section-title">🎯 Administrative Burden Index</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={burdenIndex}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                />
                <Radar
                  name="Belastungsgrad"
                  dataKey="value"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-caption">
            Basierend auf Herd & Moynihan Framework (2022)
          </p>
        </section>

        {/* Comparison Bar Chart */}
        <section className="dashboard-section chart-section">
          <h3 className="section-title">⚖️ BA-Portal vs. Moderne Standards</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <YAxis 
                  dataKey="metric" 
                  type="category" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                  }}
                  formatter={(value, name) => {
                    const item = comparisonData.find(d => 
                      (name === 'BA-Portal' ? d.ba : d.modern) === value
                    );
                    return [`${value} ${item?.unit || ''}`, name];
                  }}
                />
                <Legend />
                <Bar dataKey="ba" name="BA-Portal" fill="#ef4444" radius={[0, 4, 4, 0]}>
                  {comparisonData.map((_, index) => (
                    <Cell key={`ba-${index}`} fill="#ef4444" />
                  ))}
                </Bar>
                <Bar dataKey="modern" name="Moderne Standards" fill="#10b981" radius={[0, 4, 4, 0]}>
                  {comparisonData.map((_, index) => (
                    <Cell key={`modern-${index}`} fill="#10b981" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Trustpilot Score */}
      <section className="dashboard-section">
        <h3 className="section-title">⭐ Nutzerbewertung (Trustpilot-Stil)</h3>
        <div className="trustpilot-box">
          <div className="trustpilot-rating">
            <span className="rating-value">{trustpilotData.rating}</span>
            <span className="rating-max">/ 5</span>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= Math.round(trustpilotData.rating) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="review-count">{trustpilotData.reviews} Bewertungen</span>
          </div>
          <div className="trustpilot-quotes">
            {trustpilotData.quotes.map((quote, index) => (
              <motion.div
                key={index}
                className="quote-chip"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                "{quote}"
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundesrechnungshof Findings */}
      <section className="dashboard-section">
        <h3 className="section-title">📋 Bundesrechnungshof 2025</h3>
        <div className="brh-findings">
          {brhFindings.map((finding, index) => (
            <motion.div
              key={index}
              className="brh-finding-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="finding-status">{finding.status}</span>
              <span className="finding-text">{finding.finding}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardTab;