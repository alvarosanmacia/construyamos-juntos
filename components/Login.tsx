import React, { useState } from 'react';
import { User, Lock, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const CAMPAIGN_IMAGE_URL = "./gustavo-login.jpg";

const Login: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  // Controlled form state using Context7 best practices
  const [formData, setFormData] = useState({
    identification: '',
    password: '',
    rememberMe: false
  });

  // Single event handler for form inputs (Context7 pattern)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    clearError();
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.identification || !formData.password) {
      toast.error('Por favor ingresa tu identificación y contraseña');
      return;
    }

    const success = await login(formData.identification, formData.password);
    
    if (success) {
      toast.success('¡Bienvenido!');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:grid lg:grid-cols-[35%_65%]">
      {/* Mobile Image - Shows on top in mobile */}
      <div className="lg:hidden relative w-full h-[50vh] overflow-hidden">
        <img
          src={CAMPAIGN_IMAGE_URL}
          alt="Gustavo García Figueroa - Candidato al Senado"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Left Column - Form (Compact) */}
      <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-10 xl:px-12 py-8 lg:py-8">
        {/* Logo/Header */}
        <div className="mb-6">
          <div className="flex items-start space-x-2 mb-4">
            {/* Icon Box */}
            <div className="bg-campaign-orange rounded-lg p-2 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            {/* #1 Badge with Lightning */}
            <div className="bg-gray-900 rounded-lg px-2.5 py-1.5 flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-bold text-xs">#1</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-3xl font-display font-black leading-tight mb-2">
            <span className="text-campaign-orange">CONSTRUYAMOS JUNTOS</span>
            <br />
            <span className="text-campaign-orange">RED DE AMIGOS</span>
          </h1>
          <div className="border-l-4 border-campaign-orange pl-2.5 mb-5">
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">GUSTAVO GARCÍA FIGUEROA</p>
            <p className="text-[13px] text-gray-600">#1 Frente Amplio Unitario - Senado</p>
          </div>

          {/* Welcome Text */}
          <h2 className="text-xl font-bold text-gray-900 mb-1">Bienvenido</h2>
          <p className="text-gray-600 text-xs">
            Ingresa tus credenciales para gestionar tu red de amigos.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* Identification Input */}
          <div className="space-y-1.5">
            <label htmlFor="identification" className="block text-xs font-medium text-gray-900">
              Número de Identificación
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="identification"
                name="identification"
                type="text"
                required
                value={formData.identification}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-campaign-orange focus:border-transparent transition"
                placeholder="Ej. 123456789"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-medium text-gray-900">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-campaign-orange focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-3.5 w-3.5 text-campaign-orange focus:ring-campaign-orange border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-1.5 block text-gray-700">
                Recordarme
              </label>
            </div>
            <div>
              <a href="#" className="font-medium text-campaign-orange hover:text-campaign-dark transition">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-campaign-orange hover:bg-campaign-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-campaign-orange shadow-lg transition-all ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ingresando...
              </>
            ) : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">#CONSTRUYAMOSJUNTOS</p>
        </div>
      </div>

      {/* Right Column - Image (Full Coverage) */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src={CAMPAIGN_IMAGE_URL}
          alt="Gustavo García Figueroa - Candidato al Senado"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;