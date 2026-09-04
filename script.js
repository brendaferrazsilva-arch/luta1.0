// ============================================================
// SISTEMA DE EVENTOS - COMUNICAÇÃO ENTRE MÓDULOS
// ============================================================

class GameEvents {
    constructor() {
        this.listeners = {};
    }

    // Registrar um evento
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    // Disparar um evento
    emit(event, data = null) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.warn(`Erro no evento ${event}:`, e);
                }
            });
        }
        
        // Também dispara evento DOM para compatibilidade com código existente
        window.dispatchEvent(new CustomEvent(`game:${event}`, { 
            detail: data 
        }));
    }

    // Remover um listener
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
}

// Instância global
const gameEvents = new GameEvents();
window.gameEvents = gameEvents;

console.log('✅ Sistema de Eventos inicializado!');