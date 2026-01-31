import React, { useState } from 'react';
import { User, Copy, QrCode, Mail, Calendar, Check, Phone, MapPin, Camera, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import QRCodeComponent, { downloadQRCode } from './QRCode';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
    const { user, isLoading } = useAuth();
    const { updateProfile, isUpdating } = useProfile();
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        phone: '',
        email: ''
    });

    const appUrl = import.meta.env.VITE_APP_URL || 'https://gustavogarcia.vercel.app';
    const referralCode = user?.referral_code || '';
    const referralLink = `${appUrl}/ref/${referralCode}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            toast.success('¡Link copiado al portapapeles!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Error al copiar el link');
        }
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(referralCode);
            toast.success('¡Código copiado!');
        } catch (error) {
            toast.error('Error al copiar');
        }
    };

    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName?.charAt(0).toUpperCase() || '';
        const last = lastName?.charAt(0).toUpperCase() || '';
        return first + last || 'U';
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Sin fecha';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getRoleName = (role?: string) => {
        const roles: Record<string, string> = {
            admin: 'Administrador',
            coordinator: 'Coordinador',
            leader: 'Líder',
            activist: 'Activista'
        };
        return roles[role || ''] || 'Activista';
    };

    const handleEditSubmit = async () => {
        const result = await updateProfile({
            phone: editForm.phone || undefined,
            email: editForm.email || undefined
        });

        if (result.success) {
            toast.success('Perfil actualizado');
            setIsEditing(false);
        } else {
            toast.error(result.error || 'Error al actualizar');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto p-4 sm:p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="bg-white rounded-3xl shadow-lg h-80"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-display font-black text-gray-900">Mi Perfil</h2>
                <p className="text-gray-500">Gestiona tu información personal y comparte tu link de referido.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-campaign-orange to-campaign-dark p-8 text-center text-white relative">
                    <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                        {getRoleName(user?.role)}
                    </div>
                    <div className="h-24 w-24 rounded-full bg-white text-campaign-orange text-3xl font-black flex items-center justify-center mx-auto mb-4 border-4 border-white/30 shadow-xl relative group">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            getInitials(user?.first_name, user?.last_name)
                        )}
                        <button className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <h2 className="text-2xl font-display font-bold">
                        {user?.first_name} {user?.last_name}
                    </h2>
                    <p className="text-white/80">Frente Amplio Unitario • Senado #1</p>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Identificación</p>
                            <p className="font-medium text-gray-900">{user?.identification || '---'}</p>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase font-bold">Teléfono</p>
                            <p className="font-medium text-gray-900">{user?.phone || 'No registrado'}</p>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase font-bold">Email de contacto</p>
                            <p className="font-medium text-gray-900">{user?.email || 'No registrado'}</p>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Municipio</p>
                            <p className="font-medium text-gray-900">{user?.municipality || 'No registrado'}</p>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Miembro desde</p>
                            <p className="font-medium text-gray-900">{formatDate(user?.created_at)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-campaign-orange/10 rounded-3xl p-6 border border-campaign-orange/20">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="bg-campaign-orange/20 p-2 rounded-lg">
                        <QrCode className="h-6 w-6 text-campaign-orange" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-display">Link de Referido</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">Comparte este link con tus amigos para que se registren en tu red automáticamente.</p>
                
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-campaign-orange/20">
                    <div className="text-center sm:text-left mb-4 sm:mb-0">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Tu código único</p>
                        <button 
                            onClick={handleCopyCode}
                            className="text-xl font-black text-campaign-orange tracking-wider hover:text-campaign-dark transition-colors"
                        >
                            {referralCode || 'Generando...'}
                        </button>
                    </div>
                    
                    {referralCode && (
                        <div className="bg-white p-2 rounded-lg shadow-sm text-center">
                            <QRCodeComponent
                                value={referralLink}
                                size={80}
                                fgColor="#FF6600"
                                bgColor="#FFFFFF"
                                id="profile-qr-code"
                            />
                        </div>
                    )}
                </div>
                
                <div className="mt-4 flex space-x-2">
                    <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-500 text-sm truncate">
                        {referralLink}
                    </div>
                    <button
                        onClick={handleCopyLink}
                        className={`border font-bold px-4 py-3 rounded-xl flex items-center transition-all ${
                            copied
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 mr-2" /> Copiado
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 mr-2" /> Copiar
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => {
                            const success = downloadQRCode('profile-qr-code', `qr-referido-${referralCode}`);
                            if (success) {
                                toast.success('¡QR descargado!');
                            } else {
                                toast.error('Error al descargar el QR');
                            }
                        }}
                        className="border font-bold px-4 py-3 rounded-xl flex items-center transition-all bg-campaign-orange border-campaign-orange text-white hover:bg-campaign-dark"
                    >
                        <Download className="h-4 w-4 mr-2" /> QR
                    </button>
                </div>

                <div className="mt-6">
                    <h4 className="font-bold text-gray-800 mb-2">Cómo funciona:</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1 ml-1">
                        <li>Comparte tu link con amigos y familiares.</li>
                        <li>Ellos pueden registrarse usando tu código.</li>
                        <li>Sus referidos se agregan automáticamente a tu red.</li>
                        <li>Gana puntos y sube en el ranking.</li>
                    </ol>
                </div>
            </div>

            {/* Stats Section */}
            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                    <p className="text-3xl font-black text-campaign-orange">{user?.total_referrals || 0}</p>
                    <p className="text-sm text-gray-500">Referidos Directos</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                    <p className="text-3xl font-black text-campaign-dark">{user?.network_size || 0}</p>
                    <p className="text-sm text-gray-500">Red Total</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;