// ============================================================
// SISTEMA PRINCIPAL DE RANK
// ============================================================

class RankSystem {
    constructor() {
        this.config = RANK_CONFIG;
        this.save = rankSave;
        this.data = this.save.load();
        
        // Atualiza o rank atual baseado nos pontos
        this.updateCurrentRank();
        
        // Configura listeners de eventos
        this.setupEventListeners();
        
        // Atualiza UI se disponível
        this.updateUI();
    }

    // ============================================================
    // CONFIGURAÇÃO DE EVENTOS
    // ============================================================
    
    setupEventListeners() {
        // Escuta eventos de batalha
        gameEvents.on('battle-end', (result) => {
            this.handleBattleResult(result);
        });
        
        // Escuta evento de reset
        window.addEventListener('rank:reset', () => {
            this.resetRank();
        });
        
        // Escuta evento para obter dados
        window.addEventListener('rank:get-data', (e) => {
            if (e.detail && e.detail.callback) {
                e.detail.callback(this.getRankData());
            }
        });
    }

    // ============================================================
    // LÓGICA PRINCIPAL
    // ============================================================
    
    handleBattleResult(result) {
        const { winner, mode, isPlayer1 } = result;
        
        // Determina se o jogador (P1) venceu
        const playerWon = (winner === 'p1');
        
        // Verifica se a partida deve ser rankeada
        const isRanked = this.isMatchRanked(mode);
        if (!isRanked) return;
        
        // Calcula os pontos
        let pointsChange = 0;
        let isWin = false;
        
        if (playerWon) {
            // Vitória
            pointsChange = mode === 'bot' ? 
                this.config.POINTS.WIN_VS_BOT : 
                this.config.POINTS.WIN_VS_PLAYER;
            isWin = true;
        } else {
            // Derrota
            pointsChange = mode === 'bot' ? 
                this.config.POINTS.LOSS_VS_BOT : 
                this.config.POINTS.LOSS_VS_PLAYER;
            isWin = false;
        }
        
        // Aplica mudança de pontos
        this.addPoints(pointsChange, isWin, mode);
        
        // Dispara evento de atualização do rank
        gameEvents.emit('rank-updated', this.getRankData());
    }
    
    isMatchRanked(mode) {
        if (mode === 'bot') return this.config.RANKED_VS_BOT;
        if (mode === 'pvp') return this.config.RANKED_VS_PLAYER;
        return false;
    }
    
    addPoints(points, isWin, mode) {
        // Salva o rank anterior para comparação
        const previousRank = this.getCurrentRank();
        const previousRankIndex = this.data.currentRankIndex;
        
        // Atualiza pontos
        this.data.points = Math.max(
            this.config.MIN_POINTS,
            Math.min(this.config.MAX_POINTS, this.data.points + points)
        );
        
        // Atualiza estatísticas
        this.data.totalMatches++;
        if (isWin) {
            this.data.wins++;
        } else {
            this.data.losses++;
        }
        
        // Atualiza o rank baseado nos pontos
        this.updateCurrentRank();
        
        // Verifica se houve mudança de rank
        const rankChanged = previousRankIndex !== this.data.currentRankIndex;
        
        // Salva dados
        this.save.save(this.data);
        
        // Dispara evento de resultado
        gameEvents.emit('rank-result', {
            pointsChange: points,
            isWin: isWin,
            mode: mode,
            previousRank: previousRank,
            currentRank: this.getCurrentRank(),
            rankChanged: rankChanged,
            points: this.data.points,
            wins: this.data.wins,
            losses: this.data.losses
        });
        
        // Atualiza UI
        this.updateUI();
    }
    
    updateCurrentRank() {
        const ranks = this.config.RANKS;
        let newIndex = 0;
        
        for (let i = ranks.length - 1; i >= 0; i--) {
            if (this.data.points >= ranks[i].minPoints) {
                newIndex = i;
                break;
            }
        }
        
        this.data.currentRankIndex = newIndex;
    }
    
    // ============================================================
    // GETTERS
    // ============================================================
    
    getCurrentRank() {
        return this.config.RANKS[this.data.currentRankIndex] || this.config.RANKS[0];
    }
    
    getRankData() {
        const currentRank = this.getCurrentRank();
        const nextRank = this.getNextRank();
        
        return {
            points: this.data.points,
            wins: this.data.wins,
            losses: this.data.losses,
            totalMatches: this.data.totalMatches,
            currentRank: currentRank,
            currentRankIndex: this.data.currentRankIndex,
            nextRank: nextRank,
            progressToNext: this.getProgressToNext(),
            pointsToNext: this.getPointsToNext(),
            allRanks: this.config.RANKS
        };
    }
    
    getNextRank() {
        const nextIndex = this.data.currentRankIndex + 1;
        if (nextIndex < this.config.RANKS.length) {
            return this.config.RANKS[nextIndex];
        }
        return null;
    }
    
    getProgressToNext() {
        const currentRank = this.getCurrentRank();
        const nextRank = this.getNextRank();
        
        if (!nextRank) return 100; // Já está no rank máximo
        
        const currentMin = currentRank.minPoints;
        const nextMin = nextRank.minPoints;
        const points = this.data.points;
        
        const range = nextMin - currentMin;
        const progress = points - currentMin;
        
        return Math.min(100, Math.max(0, (progress / range) * 100));
    }
    
    getPointsToNext() {
        const nextRank = this.getNextRank();
        if (!nextRank) return 0;
        return Math.max(0, nextRank.minPoints - this.data.points);
    }
    
    // ============================================================
    // UI
    // ============================================================
    
    updateUI() {
        // Dispara evento para atualizar a UI do rank
        gameEvents.emit('rank-ui-update', this.getRankData());
    }
    
    // ============================================================
    // RESET
    // ============================================================
    
    resetRank() {
        this.data = this.save.reset();
        this.updateCurrentRank();
        this.updateUI();
        gameEvents.emit('rank-reset', this.getRankData());
    }
}

// Instância global
const rankSystem = new RankSystem();
window.rankSystem = rankSystem;

console.log('✅ Sistema de Rank inicializado!');