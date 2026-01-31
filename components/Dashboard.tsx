import React, { useEffect } from 'react';
import { Users, UserPlus, TrendingUp, Award, Target, ArrowRight } from 'lucide-react';
import { ViewState } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useReports } from '../hooks/useReports';

// Define helper components first to avoid hoisting issues
const Share2Icon = ({ className }: { className?: string }) => (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

// IMPORTANTE: Guarda la foto del candidato como 'gustavo-dashboard.jpg' en la carpeta public.
const BG_IMAGE_ALONE = "./gustavo-dashboard.jpg"; 

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { stats, activity, fetchStats, fetchActivity, isLoading } = useReports();

  useEffect(() => {
    fetchStats();
    fetchActivity(5); // Obtener últimas 5 actividades
  }, []);

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return first + last || 'U';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-CO');
  };

  // Calcular meta del mes (ejemplo: 50 referidos)
  const monthlyGoal = 50;
  const monthlyProgress = Math.min(100, Math.round(((user?.total_referrals || 0) / monthlyGoal) * 100));
  const referralsRemaining = Math.max(0, monthlyGoal - (user?.total_referrals || 0));

  return (
    <div className="relative min-h-full pb-10">
      {/* Background Image with Transparency */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <img 
            src={BG_IMAGE_ALONE} 
            alt="Background" 
            className="w-full h-full object-cover opacity-50 filter grayscale-0"
            style={{ objectPosition: 'center top' }}
          />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-black text-gray-900">
            ¡Hola, {user?.first_name || 'Amigo'}! 👋
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Bienvenido a Construyamos Juntos. Aquí puedes gestionar tu red de amigos.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Referidos Directos</p>
                    <h3 className="text-3xl font-display font-bold text-gray-900 mt-2">
                      {isLoading ? '...' : (user?.total_referrals || 0)}
                    </h3>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{stats?.newThisMonth || 0} este mes</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Total en Red</p>
                    <h3 className="text-3xl font-display font-bold text-gray-900 mt-2">
                      {isLoading ? '...' : (user?.network_size || 0).toLocaleString()}
                    </h3>
                </div>
                <div className="bg-indigo-50 p-2 rounded-lg">
                    <Share2Icon className="h-6 w-6 text-indigo-600" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Multinivel activo</span>
            </div>
          </div>

           {/* Card 3 */}
           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Ranking Referidos</p>
                    <h3 className="text-3xl font-display font-bold text-gray-900 mt-2">
                      #{stats?.userRank || '-'}
                    </h3>
                </div>
                <div className="bg-amber-50 p-2 rounded-lg">
                    <Award className="h-6 w-6 text-amber-500" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                <span>{stats?.totalUsers ? `De ${stats.totalUsers} usuarios` : 'Calculando...'}</span>
            </div>
          </div>

           {/* Card 4 */}
           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Meta del Mes</p>
                    <h3 className="text-3xl font-display font-bold text-gray-900 mt-2">{monthlyProgress}%</h3>
                </div>
                <div className="bg-emerald-50 p-2 rounded-lg">
                    <Target className="h-6 w-6 text-emerald-500" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500 font-medium">
                <span>{referralsRemaining > 0 ? `${referralsRemaining} referidos restantes` : '¡Meta cumplida! 🎉'}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
            <h2 className="text-lg font-display font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                    onClick={() => onNavigate('register')}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group text-center"
                >
                    <div className="bg-campaign-orange/10 p-3 rounded-full mb-3 group-hover:bg-campaign-orange group-hover:text-white transition-colors">
                        <UserPlus className="h-6 w-6 text-campaign-orange group-hover:text-white" />
                    </div>
                    <span className="font-bold text-gray-800">Registrar Amigo</span>
                    <span className="text-xs text-gray-500 mt-1">Añade un nuevo amigo a tu red</span>
                </button>

                <button 
                    onClick={() => onNavigate('reports')}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group text-center"
                >
                    <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <TrendingUp className="h-6 w-6 text-blue-600 group-hover:text-white" />
                    </div>
                    <span className="font-bold text-gray-800">Ver Reportes</span>
                    <span className="text-xs text-gray-500 mt-1">Consulta estadísticas y rankings</span>
                </button>

                <button 
                    onClick={() => onNavigate('network')}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group text-center"
                >
                    <div className="bg-purple-50 p-3 rounded-full mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Share2Icon className="h-6 w-6 text-purple-600 group-hover:text-white" />
                    </div>
                    <span className="font-bold text-gray-800">Mi Red</span>
                    <span className="text-xs text-gray-500 mt-1">Visualiza tu árbol de referidos</span>
                </button>
            </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-display font-bold text-gray-800">Actividad Reciente</h2>
                <button 
                  onClick={() => onNavigate('reports')}
                  className="text-sm text-campaign-orange font-medium hover:underline"
                >
                  Ver todos
                </button>
            </div>
            
            <div className="space-y-4">
                {activity && activity.length > 0 ? (
                  activity.map((item, i) => (
                    <div key={item.id || i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-campaign-orange/10 flex items-center justify-center font-bold text-campaign-orange">
                                {getInitials(item.user_first_name, item.user_last_name)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {item.user_first_name} {item.user_last_name} {item.action_type === 'new_referral' ? 'se unió a tu red' : item.description}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.metadata?.municipality || 'Sin ubicación'} • {formatTimeAgo(item.created_at)}
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-300" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-medium">Sin actividad reciente</p>
                    <p className="text-sm">Registra tu primer amigo para comenzar</p>
                  </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;