// ============================================================
// CONFIGURAÇÃO DO SISTEMA DE RANK
// ============================================================

const RANK_CONFIG = {
    // Ranks em ordem crescente
    RANKS: [
        { id: 'bronze', name: 'Bronze', emoji: '🥉', minPoints: 0, color: '#cd7f32' },
        { id: 'prata', name: 'Prata', emoji: '🥈', minPoints: 100, color: '#c0c0c0' },
        { id: 'ouro', name: 'Ouro', emoji: '🥇', minPoints: 250, color: '#ffd700' },
        { id: 'platina', name: 'Platina', emoji: '💎', minPoints: 450, color: '#e5e4e2' },
        { id: 'diamante', name: 'Diamante', emoji: '💠', minPoints: 700, color: '#b9f2ff' },
        { id: 'mestre', name: 'Mestre', emoji: '👑', minPoints: 1000, color: '#ff6b00' },
        { id: 'grao_mestre', name: 'Grão-Mestre', emoji: '⚜️', minPoints: 1500, color: '#ff0000' }
    ],

    // Pontuação
    POINTS: {
        WIN_VS_BOT: 20,
        LOSS_VS_BOT: -10,
        WIN_VS_PLAYER: 30,
        LOSS_VS_PLAYER: -15
    },

    // Configurações
    RANKED_VS_BOT: true,     // Se partidas contra bot afetam o rank
    RANKED_VS_PLAYER: true,  // Se partidas PvP afetam o rank
    MIN_POINTS: 0,           // Pontos mínimos (não pode ficar abaixo disso)
    MAX_POINTS: 9999         // Pontos máximos
};

// Exportar para uso global
window.RANK_CONFIG = RANK_CONFIG;

console.log('✅ Configuração de Rank carregada!');