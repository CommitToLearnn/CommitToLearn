/* ===== CONFIGURAÇÃO DE CAMINHOS ===== */

// Detecta se está rodando no GitHub Pages
const isGitHubPages = window.location.hostname === 'committolearnn.github.io';
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const basePath = isGitHubPages ? '/CommitToLearn' : '';

// Debug logs
console.log('🔍 Debug de Caminhos:');
console.log('- Hostname:', window.location.hostname);
console.log('- Is GitHub Pages:', isGitHubPages);
console.log('- Is Localhost:', isLocalhost);
console.log('- Base Path:', basePath);
console.log('- Full URL:', window.location.href);

// Função para resolver caminhos
function resolvePath(path) {
    // Remove barra inicial se existir para evitar dupla barra
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    if (isGitHubPages) {
        // No GitHub Pages, adiciona o basePath
        const resolvedPath = basePath + '/' + cleanPath;
        console.log(`📁 GitHub Pages - Resolvendo caminho: "${path}" -> "${resolvedPath}"`);
        return resolvedPath;
    } else {
        // Localmente (localhost ou file://), usa o caminho original
        console.log(`📁 Local - Mantendo caminho: "${path}" -> "${cleanPath}"`);
        return cleanPath;
    }
}

/* ===== INICIALIZAÇÃO E CONFIGURAÇÃO ===== */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicialização do sistema i18n
    i18n.updatePageLanguage();
    
    // Configurar botão de troca de idioma
    const languageToggle = document.getElementById('language-toggle');
    const langText = languageToggle.querySelector('.lang-text');
    
    // Atualiza o texto do botão baseado no idioma atual
    function updateLanguageButton() {
        langText.textContent = i18n.isEnglish() ? 'PT' : 'EN';
    }
    
    // Listener para trocar idioma
    languageToggle.addEventListener('click', () => {
        const newLocale = i18n.isEnglish() ? 'pt-BR' : 'en-US';
        i18n.setLocale(newLocale);
        updateLanguageButton();
        refreshCurrentView();
    });
    
    updateLanguageButton();
    
    // Função para atualizar textos da navegação
    function updateNavigationTexts() {
        document.getElementById('nav-estudos').textContent = i18n.t('nav.studies');
        document.getElementById('nav-artigos').textContent = i18n.t('nav.articles');
    }
    
    // Função para recarregar a view atual após troca de idioma
    function refreshCurrentView() {
        updateNavigationTexts();
        
        if (homeContainer.style.display !== 'none') {
            createTimeline();
        } else if (languagesContainer.style.display !== 'none') {
            createLanguageCards();
        } else if (articlesContainer.style.display !== 'none') {
            createArticleCards();
        }
        // Notas específicas não precisam ser recarregadas pois o markdown não muda
    }
    
    updateNavigationTexts();
    
    // Elementos principais do DOM
    const homeContainer = document.getElementById('home-container');
    const languagesContainer = document.getElementById('languages-container');
    const articlesContainer = document.getElementById('articles-container');
    const notesContainer = document.getElementById('notes-container');
    
    // Limpa o conteúdo anterior das anotações
    notesContainer.innerHTML = '';
    
    // Configuração do conversor Markdown
    const converter = new showdown.Converter({ 
        tables: true, 
        strikethrough: true,
        ghCodeBlocks: true,
        ghCompatibleHeaderId: true,
        tasklists: true,
        smoothLivePreview: true,
        parseImgDimensions: true,
        simplifiedAutoLink: true,
        literalMidWordUnderscores: true
    });
    
    // Variável global para dados das linguagens
    let languagesData = null;

    /* ===== FUNCIONALIDADES DE INTERFACE ===== */

    // Função auxiliar para detectar se o conteúdo deve ser destacado
    function shouldHighlight(content) {
        // Detecta padrões comuns de código
        const codePatterns = [
            /\bclass\s+\w+/,           // class declaration
            /\bpublic\s+static\s+void/, // Java main method
            /\bimport\s+[\w.]+/,       // import statements
            /\bfunction\s+\w+/,        // function declaration
            /\bdef\s+\w+/,             // Python function
            /\bpackage\s+\w+/,         // package declaration
            /\bfunc\s+\w+/,            // Go function
            /\breturn\s+\w+/,          // return statement
            /\b(if|for|while)\s*\(/   // control structures
        ];
        
        return codePatterns.some(pattern => pattern.test(content));
    }

    // Função auxiliar para detectar código Java especificamente
    function isJavaCode(content) {
        const javaPatterns = [
            /\bpublic\s+class\s+\w+/,
            /\bpublic\s+static\s+void\s+main/,
            /\bimport\s+java\./,
            /\bSystem\.out\.print/,
            /\bnew\s+\w+\s*\(/,
            /\b(ArrayList|HashMap|String)\s*</,
            /\bpublic\s+\w+\s+\w+\s*\(/,
            /\bprivate\s+\w+\s+\w+/,
            /\b@Override\b/,
            /\bextends\s+\w+/,
            /\bimplements\s+\w+/
        ];
        
        return javaPatterns.some(pattern => pattern.test(content));
    }

    // Função auxiliar para detectar código Python
    function isPythonCode(content) {
        const pythonPatterns = [
            /\bdef\s+\w+\s*\(/,
            /\bimport\s+\w+/,
            /\bfrom\s+\w+\s+import/,
            /\bclass\s+\w+\s*\(/,
            /\bclass\s+\w+\s*:/,
            /\bif\s+__name__\s*==\s*['""]__main__['""]:/,
            /\bprint\s*\(/,
            /\bself\./,
            /\brange\s*\(/
        ];
        
        return pythonPatterns.some(pattern => pattern.test(content));
    }

    // Função auxiliar para detectar código Go
    function isGoCode(content) {
        const goPatterns = [
            /\bpackage\s+\w+/,
            /\bfunc\s+\w+\s*\(/,
            /\bfunc\s+main\s*\(\s*\)/,
            /\bimport\s*\(/,
            /\bvar\s+\w+\s+\w+/,
            /\bfmt\./,
            /\bmake\s*\(/,
            /\btype\s+\w+\s+struct/,
            /\b:=\b/,
            /\bfunc\s*\(/
        ];
        
        return goPatterns.some(pattern => pattern.test(content));
    }

    // Função auxiliar para detectar código Docker/Dockerfile
    function isDockerCode(content) {
        const dockerPatterns = [
            /^\s*FROM\s+[\w\/\:\.-]+/m,
            /^\s*RUN\s+/m,
            /^\s*COPY\s+/m,
            /^\s*ADD\s+/m,
            /^\s*WORKDIR\s+/m,
            /^\s*EXPOSE\s+\d+/m,
            /^\s*ENV\s+\w+/m,
            /^\s*CMD\s*\[/m,
            /^\s*ENTRYPOINT\s*\[/m,
            /^\s*VOLUME\s+/m,
            /^\s*USER\s+/m,
            /^\s*LABEL\s+/m,
            /^\s*ARG\s+/m,
            /^\s*HEALTHCHECK\s+/m,
            /^\s*ONBUILD\s+/m,
            /^\s*SHELL\s*\[/m,
            /^\s*STOPSIGNAL\s+/m,
            /\$\{.*\}/,                    // Variáveis Docker ${VAR}
            /--no-cache/,                  // Flags típicos do Docker
            /apt-get\s+update/,            // Comandos típicos em containers
            /apk\s+add/,                   // Alpine package manager
            /docker\s+build/,              // Comandos docker
            /docker\s+run/
        ];
        
        const detected = dockerPatterns.some(pattern => pattern.test(content));
        if (detected) {
            console.log('🐳 Docker code detected! Patterns found in:', content.substring(0, 100));
        }
        return detected;
    }

    // Função para aplicar highlighting manual ao Docker
    function applyDockerHighlighting(codeBlock) {
        const content = codeBlock.textContent;
        
        // Define padrões e cores para Docker
        const dockerHighlightRules = [
            { pattern: /^(FROM|RUN|COPY|ADD|WORKDIR|EXPOSE|ENV|CMD|ENTRYPOINT|VOLUME|USER|LABEL|ARG|HEALTHCHECK|ONBUILD|SHELL|STOPSIGNAL)\b/gm, class: 'docker-command' },
            { pattern: /^#.*/gm, class: 'docker-comment' },
            { pattern: /"[^"]*"/g, class: 'docker-string' },
            { pattern: /'[^']*'/g, class: 'docker-string' },
            { pattern: /\$\{[^}]+\}/g, class: 'docker-variable' },
            { pattern: /\b\d+\b/g, class: 'docker-number' },
            { pattern: /--[\w-]+/g, class: 'docker-flag' }
        ];

        let highlightedContent = content;
        
        // Aplica cada regra
        dockerHighlightRules.forEach(rule => {
            highlightedContent = highlightedContent.replace(rule.pattern, `<span class="${rule.class}">$&</span>`);
        });

        // Aplica o conteúdo destacado
        codeBlock.innerHTML = highlightedContent;
        
        console.log('🎨 Docker highlighting manual aplicado');
    }

    // Função para aplicar syntax highlighting inteligente
    function applySyntaxHighlighting(container) {
        // Aguarda um pequeno delay para garantir que o DOM foi atualizado
        setTimeout(() => {
            const codeBlocks = container.querySelectorAll('pre code');
            console.log(`🔍 Processando ${codeBlocks.length} blocos de código`);
            
            codeBlocks.forEach((codeBlock, index) => {
                // Verifica se o bloco tem uma linguagem específica
                const hasLanguageClass = codeBlock.classList.length > 0 && 
                    Array.from(codeBlock.classList).some(cls => cls.startsWith('language-'));
                
                // Detecta linguagem pelo conteúdo
                const codeContent = codeBlock.textContent || '';
                console.log(`📝 Bloco ${index}: hasLanguageClass=${hasLanguageClass}, classes=${codeBlock.className}`);
                
                // Reset do bloco
                codeBlock.removeAttribute('data-highlighted');
                codeBlock.classList.remove('hljs');
                
                // Determina se deve aplicar highlight
                let shouldApplyHighlight = hasLanguageClass || shouldHighlight(codeContent);
                
                if (shouldApplyHighlight) {
                    if (typeof hljs !== 'undefined') {
                        // Se não tem classe de linguagem mas parece ser código, detecta a linguagem
                        if (!hasLanguageClass) {
                            if (isDockerCode(codeContent)) {
                                codeBlock.classList.add('language-dockerfile');
                                console.log(`🐳 Detectado Docker/Dockerfile no bloco ${index}`);
                                // Aplicar highlighting manual se necessário
                                applyDockerHighlighting(codeBlock);
                            } else if (isJavaCode(codeContent)) {
                                codeBlock.classList.add('language-java');
                                console.log(`☕ Detectado Java no bloco ${index}`);
                            } else if (isPythonCode(codeContent)) {
                                codeBlock.classList.add('language-python');
                                console.log(`🐍 Detectado Python no bloco ${index}`);
                            } else if (isGoCode(codeContent)) {
                                codeBlock.classList.add('language-go');
                                console.log(`🔷 Detectado Go no bloco ${index}`);
                            }
                        }
                        
                        // Aplica o highlight
                        try {
                            if (codeBlock.classList.contains('language-dockerfile')) {
                                // Para Docker, tenta hljs primeiro, depois fallback manual
                                try {
                                    hljs.highlightElement(codeBlock);
                                    console.log(`✅ HLJS Docker highlight aplicado ao bloco ${index}`);
                                } catch (dockerError) {
                                    console.warn(`⚠️ HLJS falhou para Docker, usando highlight manual no bloco ${index}`);
                                    applyDockerHighlighting(codeBlock);
                                }
                            } else {
                                hljs.highlightElement(codeBlock);
                            }
                            console.log(`✅ Highlight aplicado ao bloco ${index} com classes: ${codeBlock.className}`);
                        } catch (error) {
                            console.warn(`⚠️ Erro ao aplicar syntax highlighting no bloco ${index}:`, error);
                            // Se é Docker e hljs falhou, tenta highlighting manual
                            if (codeBlock.classList.contains('language-dockerfile')) {
                                applyDockerHighlighting(codeBlock);
                            }
                        }
                    } else {
                        console.warn('❌ hljs não está disponível');
                    }
                } else {
                    // Para blocos genéricos, mantém estilo neutro
                    console.log(`ℹ️ Bloco ${index} mantido sem highlight`);
                }
            });
        }, 200);
    }

    // Adiciona botões de copiar aos blocos de código
    function addCopyButtons(container) {
        const preBlocks = container.querySelectorAll('pre');
        
        preBlocks.forEach(preBlock => {
            // Cria o botão de copiar
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.innerText = 'Copiar';
            
            // Adiciona funcionalidade de cópia
            copyButton.addEventListener('click', () => {
                const codeElement = preBlock.querySelector('code');
                const codeToCopy = codeElement.innerText;
                
                // Copia para a área de transferência
                navigator.clipboard.writeText(codeToCopy).then(() => {
                    // Feedback visual temporário
                    copyButton.innerText = 'Copiado!';
                    setTimeout(() => {
                        copyButton.innerText = 'Copiar';
                    }, 2000);
                });
            });
            
            // Adiciona o botão ao bloco de código
            preBlock.appendChild(copyButton);
        });
    }

    // Calcula o tempo estimado de leitura baseado na contagem de palavras
    function calculateReadingTime(text) {
        // Remove markdown e HTML tags para contagem mais precisa
        const cleanText = text
            .replace(/```[\s\S]*?```/g, '') // Remove blocos de código
            .replace(/`[^`]*`/g, '') // Remove código inline
            .replace(/<[^>]*>/g, '') // Remove tags HTML
            .replace(/[#*_~`[\]()]/g, '') // Remove caracteres markdown
            .replace(/\s+/g, ' ') // Normaliza espaços
            .trim();

        // Conta palavras (considerando caracteres especiais do português)
        const wordCount = cleanText
            .split(/\s+/)
            .filter(word => word.length > 0).length;

        // Velocidade média de leitura: 200 palavras por minuto (ajustada para conteúdo técnico)
        const wordsPerMinute = 200;
        const minutes = Math.ceil(wordCount / wordsPerMinute);

        // Formata o tempo de leitura
        if (minutes < 1) {
            return i18n.t('code.lessThanOneMin');
        } else if (minutes === 1) {
            return i18n.t('code.oneMin');
        } else {
            return i18n.t('code.minutesRead', { minutes });
        }
    }

    /* ===== CARREGAMENTO DE DADOS ===== */

    // Carrega dados das linguagens do arquivo JSON
    const languagesJsonPath = resolvePath('data/languages.json');
    console.log('🔄 Carregando languages.json de:', languagesJsonPath);
    
    fetch(languagesJsonPath)
        .then(response => {
            console.log('📥 Resposta languages.json:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Languages.json carregado com sucesso');
            languagesData = data;
            showHome(); // Exibe a página inicial
        })
        .catch(error => {
            console.error('❌ Erro ao carregar dados das linguagens:', error);
            console.error('URL tentada:', languagesJsonPath);
            showHome(); // Exibe a página inicial mesmo em caso de erro
        });

    /* ===== FUNÇÕES DE NAVEGAÇÃO ===== */

    // Exibe a página inicial
    function showHome() {
        // Controla visibilidade dos containers
        homeContainer.style.display = 'block';
        languagesContainer.style.display = 'none';
        articlesContainer.style.display = 'none';
        notesContainer.style.display = 'none';
        
        // Remove classes ativas da navegação
        document.getElementById('nav-estudos').classList.remove('active');
        document.getElementById('nav-artigos').classList.remove('active');
        
        // Cria a timeline de publicações
        createTimeline();
    }

    // Exibe a página de estudos (linguagens)
    function showStudies() {
        // Controla visibilidade dos containers
        homeContainer.style.display = 'none';
        languagesContainer.style.display = 'block';
        articlesContainer.style.display = 'none';
        notesContainer.style.display = 'none';
        
        // Atualiza navegação ativa
        document.getElementById('nav-estudos').classList.add('active');
        document.getElementById('nav-artigos').classList.remove('active');
        
        // Cria os cards das linguagens
        createLanguageCards();
    }

    // Exibe a página de artigos
    function showArticles() {
        // Controla visibilidade dos containers
        homeContainer.style.display = 'none';
        languagesContainer.style.display = 'none';
        articlesContainer.style.display = 'block';
        notesContainer.style.display = 'none';
        
        // Atualiza navegação ativa
        document.getElementById('nav-estudos').classList.remove('active');
        document.getElementById('nav-artigos').classList.add('active');
        
        // Cria os cards dos artigos
        createArticleCards();
    }

    // Renderização de artigos 
    function createArticleCards() {
        if (!languagesData) {
            articlesContainer.innerHTML = `<p class="loading-center">${i18n.t('loading')}</p>`;
            return;
        }
        const articles = languagesData.articles || [];
        if (articles.length === 0) {
            articlesContainer.innerHTML = `
                <div class="articles-header">
                    <h2>${i18n.t('nav.articles')}</h2>
                    <p>${i18n.t('articles.noArticles')}</p>
                </div>`;
            return;
        }
        // Header + grid
        articlesContainer.innerHTML = `
            <div class="articles-header">
                <h2>${i18n.t('nav.articles')}</h2>
                <p>${i18n.t('articles.subtitle')}</p>
            </div>
            <div class="articles-grid" id="articles-grid"></div>
        `;
        const grid = document.getElementById('articles-grid');
        // Ordena por data desc
        const sorted = [...articles].sort((a,b)=> new Date(b.date) - new Date(a.date));
        sorted.forEach(article => {
            const d = new Date(article.date);
            const dateLabel = d.toLocaleDateString(i18n.getCurrentLocale(),{ day:'2-digit', month:'short', year:'numeric'});
            const card = document.createElement('article');
            card.className = 'article-card';
            card.innerHTML = `
                <div class="article-card-inner">
                    <div class="article-card-meta">
                        <span class="article-badge">${i18n.t('articles.badge')}</span>
                        <span class="article-date">${dateLabel}</span>
                    </div>
                    <h3 class="article-card-title">${article.title}</h3>
                    <p class="article-card-desc">${article.description || i18n.t('articles.clickToRead')}</p>
                    <div class="article-card-footer">
                        <span class="article-open">${i18n.t('code.read')}</span>
                    </div>
                </div>`;
            card.addEventListener('click', ()=> showArticle(article));
            grid.appendChild(card);
        });
    }

    /* ===== CRIAÇÃO DE INTERFACE ===== */

    // Cria a timeline de publicações na página inicial
    function createTimeline() {
        // Placeholder enquanto carrega
        homeContainer.innerHTML = `<div class="home-hero loading">${i18n.t('loading')}</div>`;

        if (!languagesData) return;

        // Coleta dados agregados
        const allItems = [];
        let totalNotes = 0;
        let earliestDate = null;
        languagesData.languages.forEach(language => {
            totalNotes += language.notes.length;
            language.notes.forEach(note => {
                const d = new Date(note.date);
                if (!earliestDate || d < earliestDate) earliestDate = d;
                allItems.push({
                    ...note,
                    type: 'note',
                    language: language.name,
                    languageIcon: language.icon,
                    languageObj: language
                });
            });
        });
        if (languagesData.articles) {
            languagesData.articles.forEach(article => {
                const d = new Date(article.date);
                if (!earliestDate || d < earliestDate) earliestDate = d;
                allItems.push({
                    ...article,
                    type: 'article',
                    language: article.category,
                    languageIcon: '📝',
                    languageObj: null
                });
            });
        }
        const totalArticles = languagesData.articles ? languagesData.articles.length : 0;
        const distinctLanguages = languagesData.languages.length;
        allItems.sort((a,b)=> new Date(b.date) - new Date(a.date));
        const latest = allItems.slice(0,8);
        const daysSinceStart = earliestDate ? Math.ceil((Date.now()-earliestDate.getTime())/86400000) : 0;

        homeContainer.innerHTML = `
            <section class="home-hero">
                <div class="hero-content">
                    <h1><span class="hero-highlight">${i18n.t('home.hero.title')}</span></h1>
                    <p class="hero-sub">${i18n.t('home.hero.subtitle')}</p>
                    <div class="hero-actions">
                        <button class="hero-btn primary" onclick="showStudies()">${i18n.t('home.hero.cta')}</button>
                        <button class="hero-btn ghost" onclick="showArticles()">${i18n.t('nav.articles')}</button>
                    </div>
                    <div class="hero-stats">
                        <div class="stat"><span class="stat-value">${totalNotes}</span><span class="stat-label">${i18n.isEnglish() ? 'Notes' : 'Anotações'}</span></div>
                        <div class="stat"><span class="stat-value">${totalArticles}</span><span class="stat-label">${i18n.isEnglish() ? 'Articles' : 'Artigos'}</span></div>
                        <div class="stat"><span class="stat-value">${distinctLanguages}</span><span class="stat-label">${i18n.isEnglish() ? 'Areas' : 'Áreas'}</span></div>
                        <div class="stat"><span class="stat-value">${daysSinceStart}</span><span class="stat-label">${i18n.isEnglish() ? 'Days' : 'Dias'}</span></div>
                    </div>
                </div>
                <div class="hero-aside">
                    <div class="hero-aside-inner">
                        <h3>${i18n.t('home.philosophy.title')}</h3>
                        <p>${i18n.t('home.philosophy.description')}</p>
                        <ul class="hero-principles">
                            <li>${i18n.t('home.philosophy.principle1')}</li>
                            <li>${i18n.t('home.philosophy.principle2')}</li>
                            <li>${i18n.t('home.philosophy.principle3')}</li>
                        </ul>
                    </div>
                </div>
            </section>
            <section class="home-latest">
                <div class="latest-header">
                    <h2>${i18n.t('home.latest.title')}</h2>
                    <button class="see-all-btn" onclick="showStudies()">${i18n.t('home.latest.seeAll')}</button>
                </div>
                <div class="latest-grid" id="latest-grid"></div>
            </section>
        `;

        const latestGrid = document.getElementById('latest-grid');

        function buildLatestCard(item){
            const d = new Date(item.date);
            const dateLabel = d.toLocaleDateString(i18n.getCurrentLocale(),{day:'2-digit',month:'short'});
            const isArticle = item.type==='article';
            // Escapa apenas aspas duplas para uso em atributo com aspas duplas (permite títulos com ' sem quebrar)
            const payload = JSON.stringify(item).replace(/\"/g,'&quot;');
            const badgeText = isArticle ? i18n.t('articles.badge') : i18n.t('notes.badge');
            const readText = i18n.t('code.read');
            return `<article class="latest-card ${isArticle?'article':''}" onclick="${isArticle?`showArticle(${payload})`:`showNote(${payload})`}">
                <div class="latest-meta">
                    <span class="latest-badge ${isArticle?'badge-article':'badge-note'}">${badgeText}</span>
                    <span class="latest-date">${dateLabel}</span>
                </div>
                <h3 class="latest-title">${item.title}</h3>
                <div class="latest-bottom">
                    <span class="latest-lang">${item.languageIcon} ${item.language}</span>
                    <span class="latest-open">${readText}</span>
                </div>
            </article>`;
        }

        latestGrid.innerHTML = latest.map(buildLatestCard).join('');
    }
    // Fim createTimeline

    // Cria os cards das linguagens de programação
    function createLanguageCards() {
        // HTML da estrutura da página de estudos com barra de controle
        languagesContainer.innerHTML = `
            <div class="studies-header studies-languages-header">
                <h2>${i18n.t('studies.title')}</h2>
                <p>${i18n.t('studies.subtitle')}</p>
                <div class="languages-controls">
                    <div class="languages-search-wrapper">
                        <input type="text" id="languages-search" placeholder="${i18n.t('studies.searchPlaceholder')}" aria-label="${i18n.t('studies.searchLabel')}">
                        <span class="search-icon">🔍</span>
                    </div>
                    <div class="languages-sorting">
                        <button class="sort-btn active" data-sort="notes">${i18n.t('studies.sortMostNotes')}</button>
                        <button class="sort-btn" data-sort="az">${i18n.t('studies.sortAZ')}</button>
                        <button class="sort-btn" data-sort="recent">${i18n.t('studies.sortRecent')}</button>
                    </div>
                </div>
            </div>
            <div class="languages-grid enhanced" id="languages-grid"></div>
        `;
        const languagesGrid = document.getElementById('languages-grid');
        const searchInput = document.getElementById('languages-search');
        const sorting = languagesContainer.querySelector('.languages-sorting');
        
        if (!languagesData) {
            languagesGrid.innerHTML = '<p>Carregando estudos...</p>';
            return;
        }

        // Pré-cálculo para progress (normaliza pela linguagem com mais notas)
        const maxNotes = Math.max(...languagesData.languages.map(l => l.notes.length || 0), 1);

        // Função para criar card individual
        function buildLanguageCard(language) {
            const percent = Math.round((language.notes.length / maxNotes) * 100);
            // Determinar a data mais recente entre as notas (se houver)
            let lastDate = null;
            language.notes.forEach(n => { if (n.date) { const d = new Date(n.date); if (!lastDate || d > lastDate) lastDate = d; } });
            const recentLabel = lastDate ? lastDate.toLocaleDateString('pt-BR', { day:'2-digit', month:'short' }) : '—';
            const card = document.createElement('div');
            card.className = 'language-card enhanced';
            card.setAttribute('tabindex','0');
            card.setAttribute('role','button');
            card.setAttribute('aria-label', `${language.name} com ${language.notes.length} anotações`);
            card.innerHTML = `
                <div class="language-card-top">
                    <div class="language-icon-wrapper">
                        <div class="language-icon-main">${language.icon.endsWith && language.icon.endsWith('.svg') ? 
                            `<img src="${language.icon}" alt="${language.name}" width="48" height="48">` : 
                            language.icon}</div>
                        <div class="language-progress" style="--progress:${percent};" aria-hidden="true">
                            <span class="language-progress-value">${language.notes.length}</span>
                        </div>
                    </div>
                    <div class="language-meta">
                        <h3 class="language-name">${language.name}</h3>
                        <div class="language-info-line">
                            <span class="language-notes-count">${language.notes.length} ${i18n.t('studies.notesCount')}</span>
                            <span class="language-last-date" title="${i18n.t('studies.lastUpdate')}">🗓 ${recentLabel}</span>
                        </div>
                    </div>
                </div>
                <div class="language-tags">${language.tags ? language.tags.map(t=>`<span class='lang-tag'>${t}</span>`).join('') : ''}</div>
                <div class="language-card-footer">
                    <button class="open-language-btn" aria-label="${i18n.t('studies.openLabel')} ${language.name}">${i18n.t('studies.viewNotes')}</button>
                </div>
            `;
            card.addEventListener('click', () => showLanguageNotes(language));
            card.addEventListener('keypress', (e) => { if (e.key === 'Enter') showLanguageNotes(language); });
            card.querySelector('.open-language-btn').addEventListener('click', (e) => { e.stopPropagation(); showLanguageNotes(language); });
            return card;
        }

        // Estado atual de filtro e ordenação
        let currentList = [...languagesData.languages];
        let currentSort = 'notes';

        function applySort(list) {
            const sorted = list.slice();
            if (currentSort === 'notes') {
                sorted.sort((a,b)=> b.notes.length - a.notes.length);
            } else if (currentSort === 'az') {
                sorted.sort((a,b)=> a.name.localeCompare(b.name, i18n.getCurrentLocale()));
            } else if (currentSort === 'recent') {
                // Usa data mais recente de nota
                function latest(l){
                    let d=null; l.notes.forEach(n=>{ if(n.date){ const dn=new Date(n.date); if(!d||dn>d)d=dn; }}); return d?d.getTime():0; }
                sorted.sort((a,b)=> latest(b)-latest(a));
            }
            return sorted;
        }

        function render() {
            languagesGrid.innerHTML='';
            applySort(currentList).forEach(language => languagesGrid.appendChild(buildLanguageCard(language)));
            if (languagesGrid.children.length===0) {
                languagesGrid.innerHTML = `<div class='no-languages-results'>${i18n.t('studies.noResults')}</div>`;
            }
        }

        // Busca dinâmica (debounce leve)
        let searchTimer=null;
        searchInput.addEventListener('input', (e)=>{
            const q = e.target.value.trim().toLowerCase();
            clearTimeout(searchTimer);
            searchTimer = setTimeout(()=>{
                if (!q) { currentList = [...languagesData.languages]; render(); return; }
                currentList = languagesData.languages.filter(lang => {
                    if (lang.name.toLowerCase().includes(q)) return true;
                    // Busca também dentro dos títulos das notas
                    return lang.notes.some(n => (n.title||'').toLowerCase().includes(q));
                });
                render();
            },150);
        });

        // Ordenação
        sorting.addEventListener('click', (e)=>{
            const btn = e.target.closest('.sort-btn');
            if(!btn) return;
            sorting.querySelectorAll('.sort-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            currentSort = btn.dataset.sort;
            render();
        });

        // Render inicial
        render();
    }

    /* ===== FUNÇÕES DE EXIBIÇÃO DE CONTEÚDO ===== */

    // Exibe as anotações de uma linguagem específica
    function showLanguageNotes(language) {
        // Controla visibilidade dos containers
        homeContainer.style.display = 'none';
        languagesContainer.style.display = 'none';
        articlesContainer.style.display = 'none';
        notesContainer.style.display = 'block';
        
        // Cria a estrutura da página de anotações
        notesContainer.innerHTML = `
            <button class="back-button" onclick="window.showStudies()">${i18n.t('notes.backToStudies')}</button>
            <div class="language-notes-header">
                <h2>${language.icon} ${language.name}</h2>
            </div>
            <div class="notes-list" id="language-notes-list"></div>
        `;
        
        const notesList = document.getElementById('language-notes-list');
        
        // Verifica se há anotações disponíveis
        if (language.notes.length === 0) {
            notesList.innerHTML = `<p>${i18n.t('notes.noNotes')}</p>`;
            return;
        }

        // Cria um item para cada anotação
        language.notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            noteItem.innerHTML = `
                <div class="note-title">${note.title}</div>
            `;
            
            // Adiciona evento de clique para exibir a anotação
            noteItem.addEventListener('click', () => showNote({ ...note, languageObj: language }));
            notesList.appendChild(noteItem);
        });
    }

    function showNote(note) {
        const noteFilePath = resolvePath(note.file);
        console.log('🔄 Carregando nota de:', noteFilePath);
        console.log('🔍 Arquivo original:', note.file);
        console.log('🌐 URL atual:', window.location.href);
        
        fetch(noteFilePath)
            .then(response => {
                console.log('📥 Resposta nota:', response.status, response.statusText);
                console.log('📍 URL tentada:', response.url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText} - URL: ${response.url}`);
                }
                return response.text();
            })
            .then(text => {
                console.log('✅ Nota carregada com sucesso');
                homeContainer.style.display = 'none';
                languagesContainer.style.display = 'none';
                articlesContainer.style.display = 'none';
                notesContainer.style.display = 'block';
                
                const language = note.languageObj;
                const backButtonPayload = JSON.stringify(language).replace(/\"/g,'&quot;');
                const readingTime = calculateReadingTime(text);

                notesContainer.innerHTML = `
                    <button class="back-button" onclick="window.showLanguageNotes(${backButtonPayload})">${i18n.t('notes.backTo')} ${language.name}</button>
                    <div class="note-header">
                        <div class="reading-time">
                            <span class="reading-time-icon">📖</span>
                            <span class="reading-time-text">${readingTime}</span>
                        </div>
                    </div>
                    <div class="note">${converter.makeHtml(text)}</div>
                    <div class="comments-section">
                        <h3 class="comments-title">${i18n.t('notes.comments')}</h3>
                        <div id="disqus_thread"></div>
                    </div>
                `;

                // Aplicar syntax highlighting inteligente
                applySyntaxHighlighting(notesContainer);

                // Adiciona botões de copiar
                addCopyButtons(notesContainer);

                // Intercepta links markdown para navegação interna
                interceptMarkdownLinks(notesContainer);

                // Carrega os comentários do Disqus
                loadDisqusComments(note.slug || note.title.toLowerCase().replace(/\s+/g, '-'));
            })
            .catch(error => {
                console.error('❌ Erro ao carregar nota:', error);
                console.error('📍 Caminho tentado:', noteFilePath);
                console.error('📄 Arquivo original:', note.file);
                
                // Exibe mensagem de erro para o usuário
                notesContainer.innerHTML = `
                    <button class="back-button" onclick="window.showLanguageNotes(${JSON.stringify(note.languageObj).replace(/\"/g,'&quot;')})">${i18n.t('notes.backTo')} ${note.languageObj.name}</button>
                    <div class="error-message">
                        <h2>${i18n.t('notes.loadError')}</h2>
                        <p><strong>${i18n.t('notes.file')}:</strong> ${note.file}</p>
                        <p><strong>${i18n.t('notes.pathAttempted')}:</strong> ${noteFilePath}</p>
                        <p><strong>${i18n.t('notes.error')}:</strong> ${error.message}</p>
                        <p>Verifique se o arquivo existe no caminho correto.</p>
                    </div>
                `;
            });
    }

    // Exibe um artigo específico
    function showArticle(article) {
        // Carrega o conteúdo do arquivo do artigo
        fetch(resolvePath(article.file))
            .then(response => response.text())
            .then(text => {
                // Controla visibilidade dos containers
                homeContainer.style.display = 'none';
                languagesContainer.style.display = 'none';
                articlesContainer.style.display = 'none';
                notesContainer.style.display = 'block';
                
                // Cria a estrutura do artigo
                const readingTime = calculateReadingTime(text);
                
                notesContainer.innerHTML = `
                    <button class="back-button" onclick="window.showArticles()">${i18n.t('articles.backToArticles')}</button>
                    <div class="note-header">
                        <div class="reading-time">
                            <span class="reading-time-icon">📖</span>
                            <span class="reading-time-text">${readingTime}</span>
                        </div>
                    </div>
                    <div class="note">${converter.makeHtml(text)}</div>
                    <div class="comments-section">
                        <h3 class="comments-title">${i18n.t('notes.comments')}</h3>
                        <div id="disqus_thread"></div>
                    </div>
                `;

                // Aplicar syntax highlighting inteligente
                applySyntaxHighlighting(notesContainer);

                // Adiciona botões de copiar
                addCopyButtons(notesContainer);

                // Intercepta links markdown para navegação interna
                interceptMarkdownLinks(notesContainer);

                // Carrega os comentários do Disqus
                loadDisqusComments(article.slug || article.title.toLowerCase().replace(/\s+/g, '-'));
            });
    }

    // Função para interceptar cliques em links markdown e processar através do sistema de navegação
    function interceptMarkdownLinks(container) {
        const links = container.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Verifica se é um link para arquivo .md interno
            if (href && href.endsWith('.md') && !href.startsWith('http')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault(); // Impede navegação normal
                    
                    console.log('🔗 Link markdown interceptado:', href);
                    
                    // Resolve o caminho correto
                    let resolvedPath = href;
                    
                    // Se o link começa com '../', ajusta para o caminho correto
                    if (href.startsWith('../')) {
                        resolvedPath = 'notes/' + href.substring(3);
                    } else if (!href.startsWith('notes/')) {
                        resolvedPath = 'notes/' + href;
                    }
                    
                    console.log('🎯 Caminho resolvido:', resolvedPath);
                    
                    // Encontra a nota correspondente no languages.json
                    if (languagesData) {
                        let foundNote = null;
                        let foundLanguage = null;
                        
                        // Procura em todas as linguagens
                        for (const language of languagesData.languages) {
                            const note = language.notes.find(n => n.file === resolvedPath);
                            if (note) {
                                foundNote = note;
                                foundLanguage = language;
                                break;
                            }
                        }
                        
                        if (foundNote && foundLanguage) {
                            console.log('✅ Nota encontrada:', foundNote.title, 'em', foundLanguage.name);
                            showNote({ ...foundNote, languageObj: foundLanguage });
                        } else {
                            console.warn('❌ Nota não encontrada no languages.json:', resolvedPath);
                            // Fallback: tenta carregar diretamente
                            const fakeNote = {
                                title: 'Carregando...',
                                file: resolvedPath,
                                languageObj: { name: 'Voltar', icon: '📄' }
                            };
                            showNote(fakeNote);
                        }
                    }
                });
            }
        });
    }

    /* ===== SISTEMA DE COMENTÁRIOS DISQUS ===== */

    // Configurações do Disqus
    const DISQUS_SHORTNAME = 'committolearn'; 

    // Carrega os comentários do Disqus
    function loadDisqusComments(pageIdentifier) {
        // Remove instância anterior do Disqus se existir
        if (window.DISQUS) {
            window.DISQUS.reset({
                reload: true,
                config: function() {
                    this.page.identifier = pageIdentifier;
                    this.page.url = window.location.href;
                    this.page.title = document.title;
                }
            });
        } else {
            // Configuração inicial do Disqus
            window.disqus_config = function() {
                this.page.url = window.location.href;
                this.page.identifier = pageIdentifier;
                this.page.title = document.title;
            };

            // Carrega o script do Disqus
            const script = document.createElement('script');
            script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
            script.setAttribute('data-timestamp', +new Date());
            (document.head || document.body).appendChild(script);
        }
    }

    /* ===== EXPOSIÇÃO DE FUNÇÕES GLOBAIS ===== */
    
    // Torna as funções acessíveis globalmente para uso em onclick
    window.showHome = showHome;
    window.showStudies = showStudies;
    window.showArticles = showArticles;
    window.showLanguageNotes = showLanguageNotes;
    window.showNote = showNote;
    window.showArticle = showArticle;

});