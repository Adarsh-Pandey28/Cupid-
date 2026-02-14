import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/constants';
import { BentoMap, getEmptyClassrooms } from './BentoMap';
import { useTheme } from '../ThemeContext';
import { Search, Layers, Zap, Map as MapIcon, Maximize, ZoomIn, ZoomOut, BookOpen, X, ChevronRight, Calendar, MapPin, Users } from 'lucide-react';

export const FullMapView = ({ locations, events, selected, onSelect }) => {
    const { themeId } = useTheme();
    const [scale, setScale] = useState(1);
    const [filter, setFilter] = useState('all');
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showClassrooms, setShowClassrooms] = useState(false);

    // Fix zoom to be independent of browser zoom
    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.8));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.6));
    const handleResetZoom = () => setScale(1);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn("h-screen w-full relative overflow-hidden bg-[var(--bg-page)]")}
        >
            {/* Map Container with Zoom */}
            <motion.div
                className="w-full h-full absolute inset-0 z-0 origin-center"
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                style={{ transformOrigin: 'center center' }}
            >
                <BentoMap
                    locations={locations}
                    events={events}
                    selected={selected}
                    onSelect={onSelect}
                    fullScreen={true}
                />
            </motion.div>

            {/* --- HUD LAYOUT --- */}

            {/* Top Bar (Fixed Z-Index High) */}
            <div className="absolute top-0 left-0 right-0 p-4 lg:p-6 lg:pl-36 z-40 pointer-events-none">
                <div className="flex flex-col md:flex-row justify-between items-start pointer-events-auto gap-4 max-w-7xl mx-auto">

                    {/* Title Card */}
                    <div className="p-5 obsidian-card rounded-3xl max-w-sm backdrop-blur-xl border border-[var(--border-color)] shadow-2xl bg-[var(--bg-card)]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <MapIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold font-display text-[var(--text-primary)] leading-none">Tactical View</h2>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[11px] text-[var(--text-secondary)] font-medium">Live Feed Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-3 items-end">
                        <div className="flex items-center gap-2 p-1.5 obsidian-card rounded-2xl bg-[var(--surface-glass)] backdrop-blur-xl border border-[var(--border-color)]">
                            {[
                                { id: 'all', label: 'All', icon: Layers },
                                { id: 'study', label: 'Study', icon: Search },
                                { id: 'events', label: 'Events', icon: Zap },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    className={cn(
                                        "p-2.5 rounded-xl transition-all flex items-center gap-2",
                                        filter === f.id
                                            ? "bg-[var(--bg-card-hover)] text-[var(--text-primary)] shadow-lg border border-[var(--border-color)]"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                                    )}
                                >
                                    <f.icon className="w-4 h-4" />
                                    <span className="text-xs font-bold hidden sm:block">{f.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <button
                                onClick={() => setShowClassrooms(!showClassrooms)}
                                className={cn(
                                    "px-4 py-3 rounded-xl border transition-all text-xs font-bold flex items-center gap-2 obsidian-card bg-[var(--surface-glass)] backdrop-blur-xl hover:bg-[var(--bg-card-hover)] cursor-pointer z-50",
                                    showClassrooms
                                        ? "border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-500/10"
                                        : "border-[var(--border-color)] text-[var(--text-primary)]"
                                )}
                            >
                                <BookOpen className="w-4 h-4" />
                                Classrooms
                                {showClassrooms && <ChevronRight className="w-3 h-3 ml-1" />}
                            </button>

                            <button
                                onClick={() => setShowHeatmap(!showHeatmap)}
                                className={cn(
                                    "px-4 py-3 rounded-xl border transition-all text-xs font-bold flex items-center gap-2 obsidian-card bg-[var(--surface-glass)] backdrop-blur-xl hover:bg-[var(--bg-card-hover)]",
                                    showHeatmap
                                        ? "border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)] bg-rose-500/10"
                                        : "border-[var(--border-color)] text-[var(--text-primary)]"
                                )}
                            >
                                <div className={cn("w-2 h-2 rounded-full", showHeatmap ? "bg-rose-500 animate-pulse" : "bg-gray-400")} />
                                Heatmap
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar (Moved to top level for Z-Index safety) */}
            <AnimatePresence>
                {showClassrooms && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="absolute right-0 top-0 bottom-0 w-80 md:w-96 bg-[var(--bg-page)]/95 backdrop-blur-2xl border-l border-[var(--border-color)] shadow-2xl z-[60] flex flex-col pt-4 md:pt-0"
                    >
                        {/* Sidebar Header */}
                        <div className="p-6 pt-24 md:pt-6 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-card)]/50">
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-emerald-400" />
                                    Empty Classrooms
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">Live tracking • {getEmptyClassrooms().length} Available</p>
                            </div>
                            <button
                                onClick={() => setShowClassrooms(false)}
                                className="p-2 hover:bg-[var(--bg-card-hover)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {getEmptyClassrooms().map((room, i) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-4 bg-[var(--bg-card-hover)] hover:bg-emerald-500/10 rounded-2xl border border-[var(--border-color)] hover:border-emerald-500/30 cursor-pointer transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-base font-bold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">{room.id}</span>
                                        <span className="text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg font-bold tracking-wide">AVAILABLE</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                                        <span>{room.block}</span>
                                        <span className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                                        <span>Floor {room.floor}</span>
                                        <span className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                                        <span className="text-[var(--text-primary)]">{room.capacity} seats</span>
                                    </div>
                                    {/* Decor */}
                                    <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-3xl -mr-4 -mt-4" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Zoom Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
                <button onClick={handleZoomIn} className="p-3 obsidian-card rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition active:scale-95 bg-[var(--surface-glass)] backdrop-blur-md border border-[var(--border-color)]">
                    <ZoomIn className="w-5 h-5" />
                </button>
                <button onClick={handleResetZoom} className="p-3 obsidian-card rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition active:scale-95 bg-[var(--surface-glass)] backdrop-blur-md border border-[var(--border-color)]">
                    <Maximize className="w-5 h-5" />
                </button>
                <button onClick={handleZoomOut} className="p-3 obsidian-card rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition active:scale-95 bg-[var(--surface-glass)] backdrop-blur-md border border-[var(--border-color)]">
                    <ZoomOut className="w-5 h-5" />
                </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 lg:left-40 z-30 hidden md:block">
                <div className="p-4 obsidian-card rounded-2xl flex gap-6 bg-[var(--surface-glass)] backdrop-blur-md border border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                        <span className="text-xs font-bold text-[var(--text-primary)]">Quiet</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
                        <span className="text-xs font-bold text-[var(--text-primary)]">Busy</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
                        <span className="text-xs font-bold text-[var(--text-primary)]">Full</span>
                    </div>
                </div>
            </div>

            {/* Event/Location Details Panel */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '-100%', opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="absolute left-0 top-0 bottom-0 w-80 md:w-96 bg-[var(--bg-page)]/95 backdrop-blur-2xl border-r border-[var(--border-color)] shadow-2xl z-[60] flex flex-col pt-4 md:pt-0"
                    >
                        {/* Header */}
                        <div className="p-6 pt-24 md:pt-6 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-card)]/50">
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                    {selected.type === 'event' ? <Calendar className="w-5 h-5 text-amber-400" /> : <MapPin className="w-5 h-5 text-blue-400" />}
                                    {selected.type === 'event' ? 'Event Details' : 'Location Details'}
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">{selected.type === 'event' ? 'Active Event' : 'Campus Location'}</p>
                            </div>
                            <button
                                onClick={() => onSelect(null)}
                                className="p-2 hover:bg-[var(--bg-card-hover)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {/* Name */}
                            <div>
                                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Name</p>
                                <p className="text-base font-bold text-[var(--text-primary)]">{selected.name || selected.title}</p>
                            </div>

                            {/* Location */}
                            {(selected.location_name || selected.block) && (
                                <div>
                                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">📍 Location</p>
                                    <p className="text-sm text-[var(--text-primary)]">{selected.location_name || selected.block}</p>
                                </div>
                            )}

                            {/* Occupancy */}
                            {selected.occupancy !== undefined && (
                                <div>
                                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Occupancy</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-[var(--bg-card-hover)] rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full transition-all",
                                                    selected.occupancy > 70 ? "bg-rose-500" : selected.occupancy > 40 ? "bg-amber-500" : "bg-emerald-500"
                                                )}
                                                style={{ width: `${selected.occupancy}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-[var(--text-primary)]">{selected.occupancy}%</span>
                                    </div>
                                </div>
                            )}

                            {/* Event-specific details */}
                            {selected.type === 'event' && (
                                <>
                                    {selected.start_time && (
                                        <div>
                                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">📅 Time</p>
                                            <p className="text-sm text-[var(--text-primary)]">
                                                {new Date(selected.start_time).toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                    {selected.attendees && (
                                        <div>
                                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">👥 Attendees</p>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-amber-400" />
                                                <p className="text-sm text-[var(--text-primary)]">{selected.attendees?.length || 0} people joined</p>
                                            </div>
                                        </div>
                                    )}

                                    {selected.description && (
                                        <div>
                                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Description</p>
                                            <p className="text-sm text-[var(--text-primary)]">{selected.description}</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Location-specific details */}
                            {!selected.type || selected.type !== 'event' && (
                                <>
                                    {selected.capacity && (
                                        <div>
                                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Capacity</p>
                                            <p className="text-sm text-[var(--text-primary)]">{selected.capacity} people</p>
                                        </div>
                                    )}
                                    {selected.type && (
                                        <div>
                                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Type</p>
                                            <span className="inline-block px-3 py-1 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] rounded-lg text-xs font-bold">
                                                {selected.type}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Improved Heatmap Overlay */}
            {showHeatmap && (
                <div className="absolute inset-0 pointer-events-none z-10 opacity-70">
                    {/* Render occupancy-based heatmap circles */}
                    {locations.map((loc) => {
                        const normalize = (val) => Math.min(Math.max((val / 1000) * 80 + 10, 10), 90);
                        const x = normalize(loc.coords?.x || 500);
                        const y = normalize(loc.coords?.y || 500);
                        const occupancy = loc.occupancy || 50;
                        const intensity = occupancy / 100;
                        
                        return (
                            <div
                                key={`heatmap-${loc.id}`}
                                className="absolute rounded-full blur-3xl"
                                style={{
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: `${200 + occupancy * 2}px`,
                                    height: `${200 + occupancy * 2}px`,
                                    backgroundColor: occupancy > 70 
                                        ? `rgba(244, 63, 94, ${intensity * 0.4})` 
                                        : occupancy > 40 
                                        ? `rgba(245, 158, 11, ${intensity * 0.3})` 
                                        : `rgba(16, 185, 129, ${intensity * 0.25})`,
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
};
