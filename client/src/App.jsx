import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import History from './History';
import Cards from './Cards';
import Loans from './Loans';
import Admin from './Admin';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeScreen = (newScreen) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(newScreen);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-hidden">
      
      <style>{`
        .screen-enter {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }
        .screen-exit {
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.3s ease-in, transform 0.3s ease-in;
        }
      `}</style>

      <div className={isTransitioning ? 'screen-exit' : 'screen-enter'}>
        {currentScreen === 'login' && <Login onLogin={() => changeScreen('dashboard')} onNavigateToRegister={() => changeScreen('register')} />}
        {currentScreen === 'register' && <Register onNavigateToLogin={() => changeScreen('login')} />}
        
        {/* We pass changeScreen to Dashboard here as 'onNavigate' */}
        {currentScreen === 'dashboard' && <Dashboard onNavigate={changeScreen} />}
        
        {currentScreen === 'history' && <History />}
        {currentScreen === 'cards' && <Cards />}
        {currentScreen === 'loans' && <Loans />}
        {currentScreen === 'admin' && <Admin />}
      </div>
    </div>
  );
}