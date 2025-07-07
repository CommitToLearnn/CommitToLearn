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
        strikethrough: true 
    });
    
    // Variável global para dados das linguagens
    let languagesData = null;

    /* ===== FUNCIONALIDADES DE INTERFACE ===== */

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
    fetch('data/languages.json')
        .then(response => response.json())
        .then(data => {
            languagesData = data;
            showHome(); // Exibe a página inicial
        })
        .catch(error => {
            console.error('Erro ao carregar dados das linguagens:', error);
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
        const allNotes = [];
        languagesData.languages.forEach(language => {
            language.notes.forEach(note => {
                allNotes.push({
                    ...note,
                    language: language.name,
                    languageIcon: language.icon,
                    languageObj: language
                });
            });
        });

        // Ordena por data (mais recente primeiro)
        allNotes.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Verifica se há anotações para exibir
        if (allNotes.length === 0) {
            publicationsList.innerHTML = '<p class="no-notes">Nenhuma publicação ainda.</p>';
            return;
        }

        // Função para criar um card de publicação
        async function createPublicationCard(note) {
            // Formatação da data em português
            const parts = note.date.split('-');
            const noteDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

            const day = noteDate.getUTCDate();
            const month = noteDate.toLocaleDateString('pt-BR', { month: 'long', timeZone: 'UTC' });
            const year = noteDate.getUTCFullYear();
            const formattedDate = `${day} de ${month} de ${year}`;

            // Carrega o conteúdo da nota para calcular tempo de leitura
            try {
                const response = await fetch(note.file);
                const content = await response.text();
                const readingTime = calculateReadingTime(content);

                return `
                    <article class="publication-item" onclick="window.showNote(${JSON.stringify(note).replace(/"/g, '&quot;')})">
                        <div class="publication-date">
                            ${formattedDate}
                        </div>
                        <div class="publication-content">
                            <h3 class="publication-title">${note.title}</h3>
                            <div class="publication-meta">
                                <span class="publication-language">
                                    <span class="language-icon">${note.languageIcon}</span>
                                    ${note.language.toUpperCase()}
                                </span>
                                <span class="reading-time">
                                    <span class="reading-time-icon">🕒</span>
                                    ${readingTime}
                                </span>
                            </div>
                            <p class="publication-description">${note.description || 'Clique para ler mais sobre este tópico.'}</p>
                            <div class="read-more">
                                Ler mais →
                            </div>
                        </div>
                    </article>
                `;
            } catch (error) {
                // Se houver erro ao carregar, exibe sem tempo de leitura
                return `
                    <article class="publication-item" onclick="window.showNote(${JSON.stringify(note).replace(/"/g, '&quot;')})">
                        <div class="publication-date">
                            ${formattedDate}
                        </div>
                        <div class="publication-content">
                            <h3 class="publication-title">${note.title}</h3>
                            <div class="publication-meta">
                                <span class="publication-language">
                                    <span class="language-icon">${note.languageIcon}</span>
                                    ${note.language.toUpperCase()}
                                </span>
                            </div>
                            <p class="publication-description">${note.description || 'Clique para ler mais sobre este tópico.'}</p>
                            <div class="read-more">
                                Ler mais →
                            </div>
                        </div>
                    </article>
                `;
            }
        }

        // Cria todos os cards de forma assíncrona
        Promise.all(allNotes.map(createPublicationCard))
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
                <div class="language-icon">${language.icon}</div>
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

        languagesData.articles.forEach(article => {
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
            articlesGrid.appendChild(articleCard);
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
        fetch(note.file)
            .then(response => response.text())
            .then(text => {
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

                // Aplicar syntax highlighting apenas para blocos com linguagem específica
                const codeBlocks = notesContainer.querySelectorAll('pre code');
                codeBlocks.forEach(codeBlock => {
                    // Verifica se o bloco tem uma linguagem específica
                    const hasLanguageClass = codeBlock.classList.length > 0 && 
                        Array.from(codeBlock.classList).some(cls => cls.startsWith('language-'));
                    
                    if (hasLanguageClass) {
                        // Para blocos com linguagem específica, aplica syntax highlighting
                        if (typeof hljs !== 'undefined') {
                            // Remove qualquer highlight anterior
                            codeBlock.removeAttribute('data-highlighted');
                            hljs.highlightElement(codeBlock);
                        }
                    } else {
                        // Para blocos genéricos, remove qualquer highlight e força estilo neutro
                        codeBlock.className = '';
                        codeBlock.removeAttribute('data-highlighted');
                        codeBlock.style.color = 'var(--text-primary)';
                        codeBlock.style.background = 'transparent';
                        // Remove qualquer HTML de syntax highlighting
                        const originalText = codeBlock.textContent;
                        codeBlock.innerHTML = originalText;
                    }
                });

                // Adiciona botões de copiar
                addCopyButtons(notesContainer);

                // Carrega os comentários do Disqus
                loadDisqusComments(note.slug || note.title.toLowerCase().replace(/\s+/g, '-'));
            });
    }

    // Exibe um artigo específico
    function showArticle(article) {
        // Carrega o conteúdo do arquivo do artigo
        fetch(article.file)
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

                // Aplicar syntax highlighting apenas para blocos com linguagem específica
                const codeBlocks = notesContainer.querySelectorAll('pre code');
                codeBlocks.forEach(codeBlock => {
                    // Verifica se o bloco tem uma linguagem específica
                    const hasLanguageClass = codeBlock.classList.length > 0 && 
                        Array.from(codeBlock.classList).some(cls => cls.startsWith('language-'));
                    
                    if (hasLanguageClass) {
                        // Para blocos com linguagem específica, aplica syntax highlighting
                        if (typeof hljs !== 'undefined') {
                            // Remove qualquer highlight anterior
                            codeBlock.removeAttribute('data-highlighted');
                            hljs.highlightElement(codeBlock);
                        }
                    } else {
                        // Para blocos genéricos, remove qualquer highlight e força estilo neutro
                        codeBlock.className = '';
                        codeBlock.removeAttribute('data-highlighted');
                        codeBlock.style.color = 'var(--text-primary)';
                        codeBlock.style.background = 'transparent';
                        // Remove qualquer HTML de syntax highlighting
                        const originalText = codeBlock.textContent;
                        codeBlock.innerHTML = originalText;
                    }
                });

                // Adiciona botões de copiar
                addCopyButtons(notesContainer);

                // Carrega os comentários do Disqus
                loadDisqusComments(article.slug || article.title.toLowerCase().replace(/\s+/g, '-'));
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