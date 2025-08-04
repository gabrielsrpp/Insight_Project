import React, { useState } from 'react';
import './App.css';
import { FaFingerprint, FaChartBar, FaUserCheck, FaUsers, FaCog, FaRegSmileBeam, FaPercentage } from 'react-icons/fa';

const menu = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
  { id: 'recognition', label: 'Reconhecimento', icon: <FaFingerprint /> },
  { id: 'users', label: 'Usuários', icon: <FaUsers /> },
  { id: 'settings', label: 'Configurações', icon: <FaCog /> }
];

export default function App() {
  const [active, setActive] = useState('dashboard');

  return (
    <div className="app-container">
      <div className="floating-dashboard-container">
        <nav className="dashboard-nav">
          {menu.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${active === item.id ? "active" : ""}`}
              onClick={() => setActive(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="dashboard-content">
          {active === 'dashboard' && (
            <section>
              <h2>Dashboard</h2>

              <div className="card-row">
                <DashboardCard
                  icon={<FaPercentage />}
                  title="Precisão InsightFace"
                  value="98.5%"
                  color="#4c51bf"
                  description="Taxa de acerto do motor de reconhecimento facial"
                />
                <DashboardCard
                  icon={<FaUsers />}
                  title="Usuários Cadastrados"
                  value="0"
                  color="#10b981"
                  description="Total de usuários cadastrados"
                />
                <DashboardCard
                  icon={<FaUserCheck />}
                  title="Reconhecimentos Realizados"
                  value="0"
                  color="#f59e0b"
                  description="Total de reconhecimentos efetuados"
                />
              </div>
            </section>
          )}
          {active === 'recognition' && (
  <section>
    <h2>Reconhecimento Facial</h2>
    <div className="recognition-container">
      {/* Card de upload */}
      <div className="upload-card">
        <input type="file" accept="image/*" id="face-upload" className="upload-input" />
        <label htmlFor="face-upload" className="upload-label">
          <span role="img" aria-label="camera" style={{ fontSize: "2.2rem" }}>📷</span>
          <span>Escolher imagem</span>
        </label>
        <button className="recognition-btn" disabled>
          Reconhecer (simulado)
        </button>
      </div>
      {/* Resultado simulado */}
      <div className="recognition-result">
        <span className="result-title">Resultado:</span>
        <span className="result-value">Nenhum reconhecimento feito.</span>
      </div>
    </div>
  </section>
)}
          {active === 'users' && (
            <section>
              <h2>Usuários</h2>
              <p>Lista de usuários do sistema (simulado).</p>
            </section>
          )}
          {active === 'settings' && (
            <section>
              <h2>Configurações</h2>
              <p>Ajustes de parâmetros, integrações, etc.</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, value, color, description }) {
  return (
    <div className="dashboard-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="card-icon" style={{ color }}>
        {icon}
      </div>
      <div className="card-title">{title}</div>
      <div className="card-value" style={{ color }}>{value}</div>
      <div className="card-description">{description}</div>
    </div>
  );
}