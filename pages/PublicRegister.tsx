import React, { useState, useEffect } from 'react';
import { UserPlus, Save, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface PublicRegisterProps {
  referralCode: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

const PublicRegister: React.FC<PublicRegisterProps> = ({ referralCode, onSuccess, onBack }) => {
  const { register, isLoading, error } = useAuth();
  const [referrerName, setReferrerName] = useState<string>('');
  const [isValidCode, setIsValidCode] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    identification: '',
    firstName: '',
    lastName: '',
    gender: '',
    department: '',
    municipality: '',
    zone: '',
    neighborhood: '',
    phone: '',
    email: '',
    birthDate: '',
    occupation: '',
    terms: false,
    privacy: false
  });

  // Validar código de referido al cargar
  useEffect(() => {
    const validateReferralCode = async () => {
      if (!referralCode) {
        setIsValidCode(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('referral_code', referralCode)
        .single();

      if (error || !data) {
        setIsValidCode(false);
        return;
      }

      setReferrerName(`${(data as any).first_name} ${(data as any).last_name}`);
      setIsValidCode(true);
    };

    validateReferralCode();
  }, [referralCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.terms || !formData.privacy) {
      toast.error('Debes aceptar los términos y condiciones');
      return;
    }

    if (!formData.identification || !formData.firstName || !formData.lastName || !formData.municipality) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    const result = await register({
      identification: formData.identification,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || undefined,
      department: formData.department || undefined,
      municipality: formData.municipality,
      zone: formData.zone || undefined,
      neighborhood: formData.neighborhood || undefined,
      birthDate: formData.birthDate || undefined,
      occupation: formData.occupation || undefined,
      referralCode: referralCode
    });

    if (result.success) {
      toast.success('¡Registro exitoso! Bienvenido a la red');
      onSuccess?.();
    } else {
      toast.error(result.error || 'Error al registrarse');
    }
  };

  if (isValidCode === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
            Código Inválido
          </h2>
          <p className="text-gray-500 mb-6">
            El código de referido "{referralCode}" no existe o ha expirado.
          </p>
          <button
            onClick={onBack}
            className="text-campaign-orange font-bold hover:underline flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (isValidCode === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-campaign-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-campaign-orange to-campaign-dark text-white rounded-2xl p-6 mb-6">
            <h1 className="text-2xl font-display font-black mb-2">
              🧡 Construyamos Juntos
            </h1>
            <p className="text-white/90">
              Gustavo García Figueroa - Senado #1
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-green-800 font-medium">
              Invitado por: <span className="font-bold">{referrerName}</span>
            </p>
            <p className="text-green-600 text-sm">
              Código: {referralCode}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-campaign-orange/10 p-4 border-b border-campaign-orange/20 flex items-center space-x-3">
            <div className="bg-campaign-orange/20 p-2 rounded-full">
              <UserPlus className="h-5 w-5 text-campaign-orange" />
            </div>
            <div>
              <h3 className="font-bold text-campaign-dark">Únete a la Red de Amigos</h3>
              <p className="text-xs text-campaign-orange">Completa tu registro para ser parte del movimiento</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <h4 className="font-display font-bold text-gray-900 mb-4 border-b pb-2">Información Personal</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Identificación *</label>
                  <input 
                    name="identification" 
                    value={formData.identification} 
                    onChange={handleChange} 
                    type="number" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" 
                    placeholder="1234567890" 
                  />
                  <p className="text-xs text-gray-400">Esta será tu contraseña de ingreso</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Fecha de Nacimiento</label>
                  <input 
                    name="birthDate" 
                    value={formData.birthDate} 
                    onChange={handleChange} 
                    type="date" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nombres *</label>
                  <input 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" 
                    placeholder="Juan Carlos" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Apellidos *</label>
                  <input 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" 
                    placeholder="Pérez García" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Sexo</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50"
                  >
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-gray-900 mb-4 border-b pb-2">Ubicación y Contacto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Departamento</label>
                  <select 
                    name="department" 
                    value={formData.department} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50"
                  >
                    <option value="">Seleccionar departamento</option>
                    <option value="Caquetá">Caquetá</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Municipio *</label>
                  <select 
                    name="municipality" 
                    value={formData.municipality} 
                    onChange={handleChange} 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50"
                  >
                    <option value="">Seleccionar municipio</option>
                    <option value="Florencia">Florencia</option>
                    <option value="Albania">Albania</option>
                    <option value="Belén de los Andaquíes">Belén de los Andaquíes</option>
                    <option value="Cartagena del Chairá">Cartagena del Chairá</option>
                    <option value="Curillo">Curillo</option>
                    <option value="El Doncello">El Doncello</option>
                    <option value="El Paujil">El Paujil</option>
                    <option value="La Montañita">La Montañita</option>
                    <option value="Milán">Milán</option>
                    <option value="Morelia">Morelia</option>
                    <option value="Puerto Rico">Puerto Rico</option>
                    <option value="San José del Fragua">San José del Fragua</option>
                    <option value="San Vicente del Caguán">San Vicente del Caguán</option>
                    <option value="Solano">Solano</option>
                    <option value="Solita">Solita</option>
                    <option value="Valparaíso">Valparaíso</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Zona</label>
                  <select 
                    name="zone" 
                    value={formData.zone} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Urbana">Urbana</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Barrio/Corregimiento</label>
                  <input 
                    name="neighborhood" 
                    value={formData.neighborhood} 
                    onChange={handleChange} 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" 
                    placeholder="Nombre del barrio" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Teléfono</label>
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    type="tel" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" 
                    placeholder="3001234567" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Ocupación</label>
                  <select 
                    name="occupation" 
                    value={formData.occupation} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Empleado">Empleado</option>
                    <option value="Independiente">Independiente</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Pensionado">Pensionado</option>
                    <option value="Desempleado">Desempleado</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Código de referido (solo lectura) */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="text-sm font-bold text-gray-700">Código de Referido</label>
              <input 
                type="text" 
                value={referralCode} 
                disabled
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed" 
              />
              <p className="text-xs text-gray-400 mt-1">Este código identifica a la persona que te invitó</p>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-start">
                <input 
                  id="terms" 
                  name="terms" 
                  checked={formData.terms} 
                  onChange={handleCheckbox} 
                  type="checkbox" 
                  required
                  className="mt-1 h-4 w-4 text-campaign-orange border-gray-300 rounded focus:ring-campaign-orange" 
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  Acepto los <span className="text-campaign-orange font-bold">términos y condiciones *</span>
                </label>
              </div>
              <div className="flex items-start">
                <input 
                  id="privacy" 
                  name="privacy" 
                  checked={formData.privacy} 
                  onChange={handleCheckbox} 
                  type="checkbox" 
                  required
                  className="mt-1 h-4 w-4 text-campaign-orange border-gray-300 rounded focus:ring-campaign-orange" 
                />
                <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                  Acepto la <span className="text-campaign-orange font-bold">Política de Tratamiento de Datos Personales</span>, conforme a la Ley 1581 de 2012 *
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent shadow-lg text-base font-bold rounded-xl text-white bg-gradient-to-r from-campaign-orange to-campaign-dark hover:from-campaign-dark hover:to-campaign-orange focus:outline-none transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Registrarme
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 pt-4">
              Al registrarte, recibirás tu propio código de referido para invitar amigos
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          #ConstruyamosJuntos #GustavoGarcíaSenador
        </p>
      </div>
    </div>
  );
};

export default PublicRegister;
