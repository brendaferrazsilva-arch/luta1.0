// ============================================================
// SISTEMA DE SAVE DO RANK
// ============================================================

class RankSave {
    constructor() {
        this.saveKey = 'streetBrawlRankData';
        this.defaultData = {
            points: 0,
            wins: 0,
            losses: 0,
            totalMatches: 0,
            currentRankIndex: 0,
            rankHistory: []
        };
    }

    // Carregar dados do rank
    load() {
        try {
            const saved = localStorage.getItem(this.saveKey);
            if (saved) {
                const data = JSON.parse(saved);
                return { ...this.defaultData, ...data };
            }
        } catch (e) {
            console.warn('Erro ao carregar dados do rank:', e);
        }
        return { ...this.defaultData };
    }

    // Salvar dados do rank
    save(data) {
        try {
            localStorage.setItem(this.saveKey, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Erro ao salvar dados do rank:', e);
            return false;
        }
    }

    // Resetar dados do rank
    reset() {
        localStorage.removeItem(this.saveKey);
        return { ...this.defaultData };
    }

    // Verificar se existe dados salvos
    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }
}

// Instância global
const rankSave = new RankSave();
window.rankSave = rankSave;

console.log('✅ Sistema de Save do Rank inicializado!');