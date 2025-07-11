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

    // Função para aplicar syntax highlighting inteligente
    function applySyntaxHighlighting(container) {
        // Aguarda um pequeno delay para garantir que o DOM foi atualizado
        setTimeout(() => {
            const codeBlocks = container.querySelectorAll('pre code');
            console.log(`Processando ${codeBlocks.length} blocos de código`);
            
            codeBlocks.forEach((codeBlock, index) => {
                // Verifica se o bloco tem uma linguagem específica
                const hasLanguageClass = codeBlock.classList.length > 0 && 
                    Array.from(codeBlock.classList).some(cls => cls.startsWith('language-'));
                
                // Detecta linguagem pelo conteúdo
                const codeContent = codeBlock.textContent || '';
                console.log(`Bloco ${index}: hasLanguageClass=${hasLanguageClass}, classes=${codeBlock.className}`);
                
                // Reset do bloco
                codeBlock.removeAttribute('data-highlighted');
                codeBlock.classList.remove('hljs');
                
                // Determina se deve aplicar highlight
                let shouldApplyHighlight = hasLanguageClass || shouldHighlight(codeContent);
                
                if (shouldApplyHighlight) {
                    if (typeof hljs !== 'undefined') {
                        // Se não tem classe de linguagem mas parece ser código, detecta a linguagem
                        if (!hasLanguageClass) {
                            if (isJavaCode(codeContent)) {
                                codeBlock.classList.add('language-java');
                                console.log(`Detectado Java no bloco ${index}`);
                            } else if (isPythonCode(codeContent)) {
                                codeBlock.classList.add('language-python');
                                console.log(`Detectado Python no bloco ${index}`);
                            } else if (isGoCode(codeContent)) {
                                codeBlock.classList.add('language-go');
                                console.log(`Detectado Go no bloco ${index}`);
                            }
                        }
                        
                        // Aplica o highlight
                        try {
                            hljs.highlightElement(codeBlock);
                            console.log(`Highlight aplicado ao bloco ${index} com classes: ${codeBlock.className}`);
                        } catch (error) {
                            console.warn(`Erro ao aplicar syntax highlighting no bloco ${index}:`, error);
                        }
                    } else {
                        console.warn('hljs não está disponível');
                    }
                } else {
                    // Para blocos genéricos, mantém estilo neutro
                    console.log(`Bloco ${index} mantido sem highlight`);
                }
            });
        }, 100);
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
            return 'Menos de 1 min';
        } else if (minutes === 1) {
            return '1 min de leitura';
        } else {
            return `${minutes} min de leitura`;
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

    /* ===== CRIAÇÃO DE INTERFACE ===== */

    // Cria a timeline de publicações na página inicial
    function createTimeline() {
        // HTML da estrutura da timeline
        homeContainer.innerHTML = `
            <div class="publications-header">
                <h2>Jornada do Conhecimento</h2>
                <p>Explore todas as anotações e descubra novos conceitos em programação.</p>
            </div>
            <div class="publications-list" id="publications-list"></div>
        `;
        
        const publicationsList = document.getElementById('publications-list');
        
        // Verifica se os dados foram carregados
        if (!languagesData) {
            publicationsList.innerHTML = '<p>Carregando publicações...</p>';
            return;
        }

        // Coleta todas as anotações de todas as linguagens
        const allItems = [];
        
        // Adiciona todas as notas
        languagesData.languages.forEach(language => {
            language.notes.forEach(note => {
                allItems.push({
                    ...note,
                    type: 'note',
                    language: language.name,
                    languageIcon: language.icon,
                    languageObj: language
                });
            });
        });

        // Adiciona todos os artigos
        if (languagesData.articles) {
            languagesData.articles.forEach(article => {
                allItems.push({
                    ...article,
                    type: 'article',
                    language: article.category,
                    languageIcon: '📝', // Ícone para artigos
                    languageObj: null
                });
            });
        }

        // Ordena por data (mais recente primeiro)
        allItems.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Verifica se há itens para exibir
        if (allItems.length === 0) {
            publicationsList.innerHTML = '<p class="no-notes">Nenhuma publicação ainda.</p>';
            return;
        }

        // Função para criar um card de publicação
        async function createPublicationCard(item) {
            // Formatação da data em português
            const parts = item.date.split('-');
            const itemDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

            const day = itemDate.getUTCDate();
            const month = itemDate.toLocaleDateString('pt-BR', { month: 'long', timeZone: 'UTC' });
            const year = itemDate.getUTCFullYear();
            const formattedDate = `${day} de ${month} de ${year}`;

            // Carrega o conteúdo para calcular tempo de leitura
            try {
                const response = await fetch(resolvePath(item.file));
                const content = await response.text();
                const readingTime = calculateReadingTime(content);

                // Define a função de clique baseada no tipo
                const clickHandler = item.type === 'article' ? 
                    `window.showArticle(${JSON.stringify(item).replace(/"/g, '&quot;')})` :
                    `window.showNote(${JSON.stringify(item).replace(/"/g, '&quot;')})`;

                return `
                    <article class="publication-item" onclick="${clickHandler}">
                        <div class="publication-date">
                            ${formattedDate}
                        </div>
                        <div class="publication-content">
                            <h3 class="publication-title">${item.title}</h3>
                            <div class="publication-meta">
                                <span class="publication-language">
                                    <span class="language-icon">${item.languageIcon.endsWith('.svg') ? 
                                        `<img src="${item.languageIcon}" alt="${item.language}" width="16" height="16">` : 
                                        item.languageIcon}</span>
                                    ${item.language.toUpperCase()}
                                </span>
                                <span class="reading-time">
                                    <span class="reading-time-icon">🕒</span>
                                    ${readingTime}
                                </span>
                            </div>
                            <p class="publication-description">${item.description || 'Clique para ler mais sobre este tópico.'}</p>
                            <div class="read-more">
                                Ler mais →
                            </div>
                        </div>
                    </article>
                `;
            } catch (error) {
                // Se houver erro ao carregar, exibe sem tempo de leitura
                const clickHandler = item.type === 'article' ? 
                    `window.showArticle(${JSON.stringify(item).replace(/"/g, '&quot;')})` :
                    `window.showNote(${JSON.stringify(item).replace(/"/g, '&quot;')})`;

                return `
                    <article class="publication-item" onclick="${clickHandler}">
                        <div class="publication-date">
                            ${formattedDate}
                        </div>
                        <div class="publication-content">
                            <h3 class="publication-title">${item.title}</h3>
                            <div class="publication-meta">
                                <span class="publication-language">
                                    <span class="language-icon">${item.languageIcon.endsWith('.svg') ? 
                                        `<img src="${item.languageIcon}" alt="${item.language}" width="16" height="16">` : 
                                        item.languageIcon}</span>
                                    ${item.language.toUpperCase()}
                                </span>
                            </div>
                            <p class="publication-description">${item.description || 'Clique para ler mais sobre este tópico.'}</p>
                            <div class="read-more">
                                Ler mais →
                            </div>
                        </div>
                    </article>
                `;
            }
        }

        // Cria todos os cards de forma assíncrona
        Promise.all(allItems.map(createPublicationCard))
            .then(cardsHTML => {
                publicationsList.innerHTML = cardsHTML.join('');
            })
            .catch(error => {
                console.error('Erro ao criar timeline:', error);
                publicationsList.innerHTML = '<p class="no-notes">Erro ao carregar publicações.</p>';
            });
    }

    // Cria os cards das linguagens de programação
    function createLanguageCards() {
        // HTML da estrutura da página de estudos
        languagesContainer.innerHTML = `
            <div class="studies-header">
                <h2>Área de Estudos</h2>
                <p>Explore conceitos e anotações organizados por linguagem</p>
            </div>
            <div class="languages-grid" id="languages-grid"></div>
        `;
        const languagesGrid = document.getElementById('languages-grid');
        
        if (!languagesData) {
            languagesGrid.innerHTML = '<p>Carregando estudos...</p>';
            return;
        }

        languagesData.languages.forEach(language => {
            const languageCard = document.createElement('div');
            languageCard.className = 'language-card';
            
            languageCard.innerHTML = `
                <div class="language-icon">${language.icon.endsWith('.svg') ? 
                    `<img src="${language.icon}" alt="${language.name}" width="32" height="32">` : 
                    language.icon}</div>
                <div class="language-name">${language.name}</div>
                <div class="language-notes-count">${language.notes.length} anotação(ões)</div>
            `;
            
            languageCard.addEventListener('click', () => showLanguageNotes(language));
            languagesGrid.appendChild(languageCard);
        });
    }

    function createArticleCards() {
        articlesContainer.innerHTML = `
            <div class="studies-header">
                <h2>Artigos</h2>
                <p>Reflexões e insights sobre programação e desenvolvimento</p>
            </div>
            <div class="languages-grid" id="articles-grid"></div>
        `;
        const articlesGrid = document.getElementById('articles-grid');
        
        if (!languagesData || !languagesData.articles || languagesData.articles.length === 0) {
            articlesGrid.innerHTML = `
                <div class="no-content">
                    <h3>Em breve...</h3>
                    <p>Novos artigos e reflexões sobre programação serão publicados em breve!</p>
                </div>
            `;
            return;
        }

        // Função para criar card de artigo
        function createArticleCard(article) {
            const articleCard = document.createElement('div');
            articleCard.className = 'language-card article-card';
            
            const articleDate = new Date(article.date);
            const formattedDate = articleDate.toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
            
            articleCard.innerHTML = `
                <div class="language-icon">📝</div>
                <div class="language-name">${article.title}</div>
                <div class="language-notes-count">${article.category} • ${formattedDate}</div>
            `;
            
            articleCard.addEventListener('click', () => showArticle(article));
            return articleCard;
        }

        // Cria todos os cards
        languagesData.articles.forEach(article => {
            const card = createArticleCard(article);
            articlesGrid.appendChild(card);
        });
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
            <button class="back-button" onclick="window.showStudies()">← Voltar para Estudos</button>
            <div class="language-notes-header">
                <h2>${language.icon} ${language.name}</h2>
            </div>
            <div class="notes-list" id="language-notes-list"></div>
        `;
        
        const notesList = document.getElementById('language-notes-list');
        
        // Verifica se há anotações disponíveis
        if (language.notes.length === 0) {
            notesList.innerHTML = '<p>Nenhuma anotação disponível ainda para esta linguagem.</p>';
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
                const backButtonOnClick = `window.showLanguageNotes(${JSON.stringify(language)})`;
                const readingTime = calculateReadingTime(text);

                notesContainer.innerHTML = `
                    <button class="back-button" onclick='${backButtonOnClick.replace(/'/g, "\'")}'>← Voltar para ${language.name}</button>
                    <div class="note-header">
                        <div class="reading-time">
                            <span class="reading-time-icon">📖</span>
                            <span class="reading-time-text">${readingTime}</span>
                        </div>
                    </div>
                    <div class="note">${converter.makeHtml(text)}</div>
                    <div class="comments-section">
                        <h3 class="comments-title">💬 Comentários</h3>
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
                    <button class="back-button" onclick='window.showLanguageNotes(${JSON.stringify(note.languageObj)})'>← Voltar para ${note.languageObj.name}</button>
                    <div class="error-message">
                        <h2>❌ Erro ao carregar nota</h2>
                        <p><strong>Arquivo:</strong> ${note.file}</p>
                        <p><strong>Caminho tentado:</strong> ${noteFilePath}</p>
                        <p><strong>Erro:</strong> ${error.message}</p>
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
                    <button class="back-button" onclick="window.showArticles()">← Voltar para Artigos</button>
                    <div class="note-header">
                        <div class="reading-time">
                            <span class="reading-time-icon">📖</span>
                            <span class="reading-time-text">${readingTime}</span>
                        </div>
                    </div>
                    <div class="note">${converter.makeHtml(text)}</div>
                    <div class="comments-section">
                        <h3 class="comments-title">💬 Comentários</h3>
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