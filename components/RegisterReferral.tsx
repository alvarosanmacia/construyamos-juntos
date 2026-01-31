import React, { useState } from 'react';
import { UserPlus, Save, CheckCircle } from 'lucide-react';
import { useReferrals } from '../hooks/useReferrals';
import toast from 'react-hot-toast';

const RegisterReferral: React.FC = () => {
    const { addReferral } = useReferrals();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSave = async () => {
        if (!formData.identification || !formData.firstName || !formData.lastName || !formData.municipality) {
            toast.error('Por favor completa los campos obligatorios');
            return;
        }

        if (!formData.terms || !formData.privacy) {
            toast.error('Debes aceptar los términos y condiciones');
            return;
        }

        setIsSubmitting(true);

        const result = await addReferral({
            identification: formData.identification,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone || null,
            email: formData.email || null,
            municipality: formData.municipality,
            department: formData.department || null,
            zone: formData.zone as 'Urbana' | 'Rural' | null,
            neighborhood: formData.neighborhood || null,
            birth_date: formData.birthDate || null,
            gender: formData.gender as 'M' | 'F' | 'O' | null,
            occupation: formData.occupation || null,
            terms_accepted: formData.terms,
            privacy_accepted: formData.privacy
        });

        setIsSubmitting(false);

        if (result.success) {
            toast.success('¡Amigo registrado exitosamente!');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 4000);

            // Limpiar formulario
            setFormData({
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
        } else {
            toast.error(result.error || 'Error al registrar amigo');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-20">
            {showNotification && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 min-w-[320px]">
                        <CheckCircle className="h-6 w-6 flex-shrink-0" />
                        <div>
                            <p className="font-bold">¡Referido agregado!</p>
                            <p className="text-sm text-green-100">Se ha agregado un nuevo amigo a tu red</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-2xl font-display font-black text-gray-900">Registrar Amigo</h2>
                <p className="text-gray-500">Agrega un nuevo amigo a tu red para la campaña de Gustavo García.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-campaign-orange/10 p-4 border-b border-campaign-orange/20 flex items-center space-x-3">
                    <div className="bg-campaign-orange/20 p-2 rounded-full">
                        <UserPlus className="h-5 w-5 text-campaign-orange" />
                    </div>
                    <div>
                        <h3 className="font-bold text-campaign-dark">Registro de Nuevo Amigo</h3>
                        <p className="text-xs text-campaign-orange">Ingresa la información de la persona que deseas agregar</p>
                    </div>
                </div>

                <form className="p-6 space-y-6">
                    <div>
                        <h4 className="font-display font-bold text-gray-900 mb-4 border-b pb-2">Información Personal</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Identificación *</label>
                                <input name="identification" value={formData.identification} onChange={handleChange} type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" placeholder="1234567890" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Fecha de Nacimiento</label>
                                <input name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Nombres *</label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" placeholder="Juan Carlos" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Apellidos *</label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" placeholder="Pérez García" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-gray-700">Sexo *</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50">
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
                                <label className="text-sm font-bold text-gray-700">Departamento *</label>
                                <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50">
                                    <option value="">Seleccionar departamento</option>
                                    <option value="Caquetá">Caquetá</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Municipio *</label>
                                <select name="municipality" value={formData.municipality} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50">
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
                                <label className="text-sm font-bold text-gray-700">Zona *</label>
                                <select name="zone" value={formData.zone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50">
                                    <option value="">Seleccionar</option>
                                    <option value="Urbana">Urbana</option>
                                    <option value="Rural">Rural</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Barrio/Corregimiento *</label>
                                <input name="neighborhood" value={formData.neighborhood} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" placeholder="Nombre del barrio" />
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Teléfono</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" placeholder="3001234567" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Correo electrónico</label>
                                <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50" placeholder="correo@ejemplo.com" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-gray-700">Ocupación</label>
                                <select name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-campaign-orange focus:border-transparent outline-none bg-gray-50">
                                    <option value="">Seleccionar</option>
                                    <option value="Estudiante">Estudiante</option>
                                    <option value="Empleado">Empleado</option>
                                    <option value="Independiente">Independiente</option>
                                    <option value="Hogar">Hogar</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <div className="flex items-start">
                            <input id="terms" name="terms" checked={formData.terms} onChange={handleCheckbox} type="checkbox" className="mt-1 h-4 w-4 text-campaign-orange border-gray-300 rounded focus:ring-campaign-orange" />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">Acepto los <span className="text-campaign-orange font-bold">términos y condiciones *</span></label>
                        </div>
                         <div className="flex items-start">
                            <input id="privacy" name="privacy" checked={formData.privacy} onChange={handleCheckbox} type="checkbox" className="mt-1 h-4 w-4 text-campaign-orange border-gray-300 rounded focus:ring-campaign-orange" />
                            <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">Acepto la <span className="text-campaign-orange font-bold">Política de Tratamiento de Datos Personales</span>, conforme a la Ley 1581 de 2012 *</label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="button" 
                            onClick={handleSave} 
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center py-4 px-6 border border-transparent shadow-lg text-base font-bold rounded-xl text-white bg-gradient-to-r from-campaign-orange to-campaign-dark hover:from-campaign-dark hover:to-campaign-orange focus:outline-none transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    Guardar Amigo
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterReferral;