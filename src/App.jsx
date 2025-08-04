import React, { useState } from 'react';
import './App.css';
import { FaFingerprint, FaChartBar, FaUserCheck, FaUsers, FaCog, FaRegSmileBeam, FaPercentage, FaSearch, FaEdit, FaTrash, FaUserPlus, FaUser } from 'react-icons/fa';


const menu = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
  { id: 'recognition', label: 'Reconhecimento', icon: <FaFingerprint /> },
  { id: 'users', label: 'Usuários', icon: <FaUsers /> },
  { id: 'settings', label: 'Configurações', icon: <FaCog /> }
];

// Dados simulados de usuários para ter uma base
const mockUsers = [
  { id: 1, name: "exemplo", email: "exemplo@exemplo.com", status: "Ativo", image: "" },
];

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

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
              
              <div className="users-actions">
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="add-user-btn">
                  <FaUserPlus />
                  <span>Novo Usuário</span>
                </button>
              </div>
              
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Usuário</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map(user => (
                      <tr key={user.id}>
                        <td className="user-cell">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="user-avatar" />
                          ) : (
                            <div className="user-avatar">
                              <FaUser />
                            </div>
                          )}
                          <span>{user.name}</span>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`status-badge ${user.status === 'Ativo' ? 'active' : 'inactive'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button className="action-btn edit-btn" title="Editar">
                            <FaEdit />
                          </button>
                          <button className="action-btn delete-btn" title="Excluir">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="pagination">
                <button className="pagination-btn active">1</button>
              </div>
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