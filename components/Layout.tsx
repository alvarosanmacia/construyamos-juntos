import React, { useState } from 'react';
import { Menu, X, Home, UserPlus, FileBarChart, User, LogOut, Share2 } from 'lucide-react';
import { ViewState } from '../types';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return first + last || 'U';
  };

  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'register', label: 'Registro', icon: UserPlus },
    { id: 'reports', label: 'Reportes', icon: FileBarChart },
    { id: 'profile', label: 'Mi Perfil', icon: User },
  ];

  const handleNav = (view: string) => {
    onChangeView(view as ViewState);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-campaign-orange text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 flex flex-col">
                 <span className="font-display font-black tracking-tight text-lg leading-none">GUSTAVO GARCÍA #1 SENADO</span>
                 <span className="text-xs font-medium text-white/80">Construyamos Juntos</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
                <div className="bg-white/20 rounded-full p-1 border border-white/30">
                     <div className="h-8 w-8 rounded-full bg-white text-campaign-orange flex items-center justify-center font-bold font-display">
                         {getInitials(user?.first_name, user?.last_name)}
                     </div>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-40 bg-gradient-to-br from-campaign-orange to-campaign-dark flex flex-col items-center justify-center text-white relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
             
             <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-campaign-orange font-display font-black text-2xl shadow-lg mb-2 relative z-10">
                 {getInitials(user?.first_name, user?.last_name)}
             </div>
             <div className="text-center relative z-10">
                 <h3 className="font-bold font-display">{user?.first_name} {user?.last_name}</h3>
                 <p className="text-xs opacity-80">Red de Amigos</p>
             </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-campaign-orange/10 text-campaign-orange shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-campaign-orange' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </button>
             <p className="text-center text-[10px] text-gray-400 mt-4">
                Desarrollado por Amazonico.dev
             </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
