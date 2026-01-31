import React, { useState, useEffect, useRef } from 'react';
import { GitGraph, Share2, Table as TableIcon, Users, Download, Search, Filter, Award } from 'lucide-react';
import * as d3 from 'd3';
import { NetworkNode, Referral } from '../types';
import { useReferrals } from '../hooks/useReferrals';
import { useReports } from '../hooks/useReports';
import { useAuth } from '../hooks/useAuth';

const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'tree' | 'nodes' | 'table' | 'ranking'>('tree');
    const { referrals, isLoading: referralsLoading } = useReferrals();
    const { network, ranking, stats, fetchNetwork, fetchRanking, fetchStats, isLoading: reportsLoading } = useReports();
    const { user } = useAuth();

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'nodes' || activeTab === 'tree') {
            fetchNetwork();
        }
        if (activeTab === 'ranking') {
            fetchRanking();
        }
    }, [activeTab]);
    
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 h-[calc(100vh-80px)] overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-display font-black text-gray-900">Reportes</h2>
                <p className="text-gray-500">Selecciona el tipo de reporte que deseas visualizar</p>
            </div>

            {/* View Selector Grid (like in video) */}
            {activeTab === 'tree' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                     <ReportCard 
                        title="Árbol Jerárquico" 
                        desc="Visualiza tu red de referidos en forma de árbol expandible con niveles de profundidad." 
                        icon={GitGraph} 
                        color="text-orange-500"
                        bgColor="bg-orange-50"
                        active={true}
                        onClick={() => {}}
                    />
                    <ReportCard 
                        title="Vista de Nodos" 
                        desc="Grafo interactivo con nodos coloreados por rango y conexiones entre referidos." 
                        icon={Share2} 
                        color="text-amber-500"
                        bgColor="bg-amber-50"
                        active={false}
                        onClick={() => setActiveTab('nodes')}
                    />
                     <ReportCard 
                        title="Tabla de Referidos" 
                        desc="Lista detallada de todos tus referidos con búsqueda, filtros y exportación." 
                        icon={TableIcon} 
                        color="text-yellow-500"
                        bgColor="bg-yellow-50"
                        active={false}
                        onClick={() => setActiveTab('table')}
                    />
                     <ReportCard 
                        title="Cantidad por Usuario" 
                        desc="Ranking de usuarios ordenados por cantidad de referidos directos y descendientes." 
                        icon={Users} 
                        color="text-pink-500"
                        bgColor="bg-pink-50"
                        active={false}
                        onClick={() => setActiveTab('ranking')}
                    />
                </div>
            )}

             {activeTab !== 'tree' && (
                 <div className="mb-4">
                     <button onClick={() => setActiveTab('tree')} className="text-campaign-orange font-bold hover:underline flex items-center">
                         ← Volver al menú de reportes
                     </button>
                 </div>
             )}

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 min-h-[500px] relative overflow-hidden">
                {activeTab === 'tree' && <TreeView user={user} network={network} isLoading={reportsLoading} />}
                {activeTab === 'nodes' && <NetworkGraphView network={network} />}
                {activeTab === 'table' && <TableView referrals={referrals} isLoading={referralsLoading} />}
                {activeTab === 'ranking' && <RankingView ranking={ranking} stats={stats} isLoading={reportsLoading} />}
            </div>
        </div>
    );
};

const ReportCard = ({ title, desc, icon: Icon, color, bgColor, active, onClick }: any) => (
    <div 
        onClick={onClick}
        className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col items-start ${active ? 'border-campaign-orange ring-1 ring-campaign-orange shadow-md bg-white' : 'border-gray-100 bg-white hover:shadow-md hover:border-gray-200'}`}
    >
        <div className={`p-3 rounded-xl mb-4 ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
    </div>
);

// --- Sub-Views ---

const TreeView = ({ user, network, isLoading }: { user: any; network: any[]; isLoading: boolean }) => {
    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName?.charAt(0).toUpperCase() || '';
        const last = lastName?.charAt(0).toUpperCase() || '';
        return first + last || 'U';
    };

    const directReferrals = network?.filter(n => n.level === 1).length || 0;
    const totalNetwork = network?.length || 0;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Vista Jerárquica</h3>
                <button className="flex items-center space-x-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-gray-700 font-medium">
                    <Download className="h-4 w-4" /> <span>Exportar</span>
                </button>
            </div>
            
            <div className="flex space-x-8 mb-8 border-b pb-6">
                <div>
                    <p className="text-sm text-gray-500 uppercase font-bold">Referidos directos</p>
                    <p className="text-3xl font-display font-black text-gray-900">
                        {isLoading ? '...' : directReferrals}
                    </p>
                </div>
                 <div>
                    <p className="text-sm text-gray-500 uppercase font-bold">Total en red</p>
                    <p className="text-3xl font-display font-black text-orange-500">
                        {isLoading ? '...' : totalNetwork}
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                 <div className="inline-block p-4 rounded-full bg-white shadow-md mb-4">
                     <div className="h-12 w-12 rounded-full bg-campaign-orange flex items-center justify-center text-white font-bold text-xl">
                         {getInitials(user?.first_name, user?.last_name)}
                     </div>
                 </div>
                 <h4 className="font-bold text-gray-900">{user?.first_name} {user?.last_name}</h4>
                 <p className="text-sm text-gray-500">Tú (raíz del árbol)</p>
                 
                 {totalNetwork === 0 ? (
                     <div className="mt-8 text-gray-400">
                         Aún no tienes amigos registrados
                         <br/>
                         <span className="text-campaign-orange font-bold cursor-pointer hover:underline">Registrar mi primer amigo →</span>
                     </div>
                 ) : (
                     <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                         {network.filter(n => n.level === 1).slice(0, 8).map((node, i) => (
                             <div key={node.id || i} className="bg-white rounded-lg p-3 shadow-sm border">
                                 <div className="h-10 w-10 rounded-full bg-campaign-light/20 flex items-center justify-center text-campaign-orange font-bold mx-auto mb-2">
                                     {getInitials(node.first_name, node.last_name)}
                                 </div>
                                 <p className="text-xs font-medium text-gray-900 truncate">{node.first_name}</p>
                                 <p className="text-[10px] text-gray-500">{node.children_count || 0} referidos</p>
                             </div>
                         ))}
                     </div>
                 )}
            </div>
        </div>
    )
}

const NetworkGraphView = ({ network }: { network: any[] }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        
        const width = svgRef.current.clientWidth;
        const height = 500;

        // Transform network data to D3 format
        const nodes = network && network.length > 0 
            ? [
                { id: "Yo", group: 0 },
                ...network.map(n => ({ 
                    id: `${n.first_name || 'N'} ${n.last_name?.charAt(0) || ''}`.trim(), 
                    group: n.level || 1,
                    fullName: `${n.first_name} ${n.last_name}`
                }))
              ]
            : [
                { id: "Yo", group: 0 },
                { id: "Sin referidos", group: 1 },
              ];
        
        const links = network && network.length > 0
            ? network.map(n => ({
                source: "Yo",
                target: `${n.first_name || 'N'} ${n.last_name?.charAt(0) || ''}`.trim()
              }))
            : [];

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const simulation = d3.forceSimulation(nodes as any)
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .attr("stroke", "#e5e7eb")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 2);

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 10)
            .attr("fill", (d) => d.group === 1 ? "#FF6600" : "#F77E16")
            .call(drag(simulation) as any);

        node.append("title")
            .text(d => d.id);

        const labels = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(d => d.id)
            .style("font-size", "10px")
            .style("fill", "#555")
            .style("font-family", "DM Sans, sans-serif");


        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);
            
             labels
                .attr("x", (d: any) => d.x)
                .attr("y", (d: any) => d.y);
        });

        function drag(simulation: any) {
            function dragstarted(event: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event: any) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event: any) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

    }, []);

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Grafo de Red</h3>
                <div className="flex space-x-2">
                    <span className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-campaign-orange mr-1"></span> Tú (Raíz)</span>
                    <span className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-campaign-light mr-1"></span> Nivel 1</span>
                </div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 relative">
                 <svg ref={svgRef} className="w-full h-[500px]"></svg>
            </div>
        </div>
    );
};

const TableView = ({ referrals, isLoading }: { referrals: any[]; isLoading: boolean }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredReferrals = referrals.filter(r => 
        r.identification?.includes(searchTerm) ||
        r.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h3 className="font-bold text-lg">Listado General ({referrals.length})</h3>
                <div className="flex space-x-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o cédula" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full focus:ring-campaign-orange focus:border-campaign-orange" 
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    <button className="flex items-center px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                        <Filter className="h-4 w-4 mr-2" /> Filtros
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-campaign-orange mx-auto"></div>
                    <p className="text-gray-500 mt-4">Cargando referidos...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Nacimiento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReferrals.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={6}>
                                        {searchTerm ? 'No se encontraron resultados' : 'Aún no tienes referidos registrados.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredReferrals.map((referral) => (
                                    <tr key={referral.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{referral.identification}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{referral.first_name} {referral.last_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {referral.birth_date ? new Date(referral.birth_date).toLocaleDateString('es-CO') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{referral.municipality || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{referral.phone || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${referral.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {referral.status === 'active' ? 'Activo' : 'Pendiente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const RankingView = ({ ranking, stats, isLoading }: { ranking: any[]; stats: any; isLoading: boolean }) => {
    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName?.charAt(0).toUpperCase() || '';
        const last = lastName?.charAt(0).toUpperCase() || '';
        return first + last || 'U';
    };

    const totalReferrals = ranking?.reduce((sum, r) => sum + (r.total_referrals || 0), 0) || 0;
    const avgReferrals = ranking?.length > 0 ? (totalReferrals / ranking.length).toFixed(1) : '0.0';

    return (
        <div className="p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Cantidad por Usuario</h3>
                <button className="flex items-center space-x-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-gray-700 font-medium">
                    <Download className="h-4 w-4" /> <span>Exportar</span>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 font-bold uppercase">Total Usuarios</p>
                    <p className="text-2xl font-black text-gray-900">{isLoading ? '...' : (stats?.totalUsers || ranking?.length || 0)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-xs text-green-600 font-bold uppercase">Total Referidos</p>
                    <p className="text-2xl font-black text-green-600">{isLoading ? '...' : totalReferrals}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-600 font-bold uppercase">Promedio</p>
                    <p className="text-2xl font-black text-blue-600">{isLoading ? '...' : avgReferrals}</p>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-campaign-orange mx-auto"></div>
                </div>
            ) : ranking && ranking.length > 0 ? (
                <div className="space-y-2">
                    {ranking.map((user, index) => (
                        <div 
                            key={user.id} 
                            className={`rounded-xl p-4 flex items-center justify-between border ${
                                index === 0 ? 'bg-yellow-50 border-yellow-100' : 
                                index === 1 ? 'bg-gray-100 border-gray-200' :
                                index === 2 ? 'bg-orange-50 border-orange-100' :
                                'bg-white border-gray-100'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                {index < 3 ? (
                                    <Award className={`h-8 w-8 ${
                                        index === 0 ? 'text-yellow-500' :
                                        index === 1 ? 'text-gray-400' :
                                        'text-orange-400'
                                    }`} />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                                        {index + 1}
                                    </div>
                                )}
                                <div className="h-10 w-10 rounded-full bg-campaign-orange/10 flex items-center justify-center font-bold text-campaign-orange">
                                    {getInitials(user.first_name, user.last_name)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{user.first_name} {user.last_name}</p>
                                    <p className="text-xs text-gray-500">{user.municipality || 'Sin ubicación'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-xl text-gray-900">{user.total_referrals || 0}</p>
                                <p className="text-[10px] text-gray-500 uppercase">Directos</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-xl text-gray-900">{user.network_size || 0}</p>
                                <p className="text-[10px] text-gray-500 uppercase">Total Red</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>No hay usuarios en el ranking aún</p>
                </div>
            )}
        </div>
    )
}

export default Reports;