// ============================================================
// MENU PRINCIPAL
// ============================================================

class MainMenu {
    constructor() {
        this.isVisible = false;
        this.selectedIndex = 0;
        this.menuItems = [
            { id: 'play', label: '⚔️ PLAY', action: () => this.play() },
            { id: 'rank', label: '🏆 RANK', action: () => this.showRank() },
            { id: 'settings', label: '⚙️ SETTINGS', action: () => this.showSettings() },
            { id: 'quit', label: '🚪 QUIT', action: () => this.quit() }
        ];
        
        this.overlay = null;
        
        // Configura listeners
        this.setupEventListeners();
        
        // Cria a UI
        this.createUI();
    }

    setupEventListeners() {
        // Escuta evento para mostrar o menu
        window.addEventListener('menu:show', () => this.show());
        window.addEventListener('menu:hide', () => this.hide());
        window.addEventListener('menu:toggle', () => this.toggle());
        
        // Escuta teclas para navegação
        document.addEventListener('keydown', (e) => {
            if (!this.isVisible) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigate(e.key === 'ArrowUp' ? -1 : 1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.selectCurrent();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.hide();
                    break;
            }
        });
        
        // Escuta quando o jogo volta para o menu
        gameEvents.on('menu', () => {
            if (!this.isVisible) {
                this.show();
            }
        });
    }

    // ============================================================
    // CRIAÇÃO DA UI
    // ============================================================
    
    createUI() {
        // Verifica se já existe
        if (this.overlay) return;
        
        this.overlay = document.createElement('div');
        this.overlay.id = 'main-menu-overlay';
        this.overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 60px;
            z-index: 40;
            padding: 40px;
            backdrop-filter: blur(10px);
            font-family: 'Rajdhani', 'Segoe UI', sans-serif;
        `;
        
        // Título do jogo
        const title = document.createElement('div');
        title.style.cssText = `
            font-family: 'Black Ops One', cursive;
            font-size: 3.5rem;
            color: #f7d44a;
            text-shadow: 0 0 60px rgba(247,212,74,0.2);
            margin-bottom: 40px;
            letter-spacing: 4px;
        `;
        title.textContent = '⚔️ STREET BRAWL';
        this.overlay.appendChild(title);
        
        // Subtítulo
        const subtitle = document.createElement('div');
        subtitle.style.cssText = `
            font-size: 0.9rem;
            color: rgba(179, 214, 240, 0.5);
            margin-bottom: 40px;
            letter-spacing: 6px;
        `;
        subtitle.textContent = '✦ ULTIMATE EDITION ✦';
        this.overlay.appendChild(subtitle);
        
        // Container dos itens do menu
        const menuContainer = document.createElement('div');
        menuContainer.id = 'menu-items-container';
        menuContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
            width: 100%;
            max-width: 350px;
        `;
        
        // Cria os itens do menu
        this.menuItems.forEach((item, index) => {
            const btn = document.createElement('button');
            btn.dataset.index = index;
            btn.dataset.id = item.id;
            btn.style.cssText = `
                background: rgba(255,255,255,0.03);
                border: 2px solid rgba(255,255,255,0.05);
                color: rgba(255,255,255,0.6);
                padding: 15px 30px;
                border-radius: 50px;
                font-family: 'Rajdhani', sans-serif;
                font-size: 1.2rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                letter-spacing: 2px;
                text-align: center;
                width: 100%;
                position: relative;
                overflow: hidden;
            `;
            btn.textContent = item.label;
            
            // Efeito hover
            btn.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                this.updateSelection();
            });
            
            btn.addEventListener('click', () => {
                this.selectedIndex = index;
                this.selectCurrent();
            });
            
            menuContainer.appendChild(btn);
        });
        
        this.overlay.appendChild(menuContainer);
        
        // Versão do jogo
        const version = document.createElement('div');
        version.style.cssText = `
            position: absolute;
            bottom: 20px;
            font-size: 0.6rem;
            color: rgba(255,255,255,0.1);
            letter-spacing: 2px;
        `;
        version.textContent = 'v2.0.0 • STREET BRAWL ULTIMATE';
        this.overlay.appendChild(version);
        
        // Adiciona ao wrapper
        const wrapper = document.getElementById('gameWrapper');
        wrapper.appendChild(this.overlay);
        
        // Atualiza a seleção inicial
        this.updateSelection();
    }

    // ============================================================
    // NAVEGAÇÃO
    // ============================================================
    
    navigate(direction) {
        const total = this.menuItems.length;
        this.selectedIndex = (this.selectedIndex + direction + total) % total;
        this.updateSelection();
    }
    
    updateSelection() {
        const buttons = this.overlay.querySelectorAll('#menu-items-container button');
        buttons.forEach((btn, index) => {
            const isSelected = index === this.selectedIndex;
            btn.style.background = isSelected ? 'rgba(247,212,74,0.12)' : 'rgba(255,255,255,0.03)';
            btn.style.borderColor = isSelected ? 'rgba(247,212,74,0.3)' : 'rgba(255,255,255,0.05)';
            btn.style.color = isSelected ? '#f7d44a' : 'rgba(255,255,255,0.6)';
            btn.style.transform = isSelected ? 'scale(1.03)' : 'scale(1)';
            btn.style.boxShadow = isSelected ? '0 0 30px rgba(247,212,74,0.05)' : 'none';
        });
    }
    
    selectCurrent() {
        const item = this.menuItems[this.selectedIndex];
        if (item && item.action) {
            item.action();
        }
    }

    // ============================================================
    // AÇÕES
    // ============================================================
    
    play() {
        this.hide();
        // Mostra a tela de seleção de personagem
        const charSelect = document.getElementById('charSelect');
        if (charSelect) {
            charSelect.classList.remove('hidden');
        }
    }
    
    showRank() {
        // Mostra a tela de rank
        window.dispatchEvent(new CustomEvent('rank:show'));
    }
    
    showSettings() {
        // Aqui você pode integrar com o sistema de configurações
        // Por enquanto, mostra um alerta simples
        alert('⚙️ Configurações\n\nMúsica: ON/OFF\nVolume da Música: 0-100%\n\n(Em desenvolvimento)');
    }
    
    quit() {
        if (confirm('Tem certeza que deseja sair?')) {
            // Tenta fechar a janela ou redirecionar
            window.close();
            // Fallback
            document.body.innerHTML = '<h1 style="color:white;text-align:center;margin-top:50px;">Obrigado por jogar!</h1>';
        }
    }

    // ============================================================
    // EXIBIÇÃO
    // ============================================================
    
    show() {
        // Esconde a tela de seleção de personagem
        const charSelect = document.getElementById('charSelect');
        if (charSelect) {
            charSelect.classList.add('hidden');
        }
        
        this.isVisible = true;
        this.overlay.style.display = 'flex';
        this.updateSelection();
        
        // Dispara evento
        gameEvents.emit('menu-shown');
    }
    
    hide() {
        this.isVisible = false;
        this.overlay.style.display = 'none';
        
        // Dispara evento
        gameEvents.emit('menu-hidden');
    }
    
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// Instância global
const mainMenu = new MainMenu();
window.mainMenu = mainMenu;

// Mostra o menu ao carregar
window.addEventListener('load', () => {
    setTimeout(() => {
        mainMenu.show();
    }, 500);
});

console.log('✅ Menu Principal inicializado!');