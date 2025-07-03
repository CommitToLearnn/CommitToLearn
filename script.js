document.addEventListener('DOMContentLoaded', () => {
    const homeContainer = document.getElementById('home-container');
    const languagesContainer = document.getElementById('languages-container');
    const articlesContainer = document.getElementById('articles-container');
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = ''; // Limpa o conteúdo anterior
    const converter = new showdown.Converter({ tables: true, strikethrough: true });
    let languagesData = null;

    function addCopyButtons(container) {
        const preBlocks = container.querySelectorAll('pre');
        preBlocks.forEach(preBlock => {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.innerText = 'Copiar';
            
            copyButton.addEventListener('click', () => {
                const codeElement = preBlock.querySelector('code');
                const codeToCopy = codeElement.innerText;
                navigator.clipboard.writeText(codeToCopy).then(() => {
                    copyButton.innerText = 'Copiado!';
                    setTimeout(() => {
                        copyButton.innerText = 'Copiar';
                    }, 2000);
                });
            });
            preBlock.appendChild(copyButton);
        });
    }

    fetch('data/languages.json')
        .then(response => response.json())
        .then(data => {
            languagesData = data;
            showHome();
        })
        .catch(error => {
            console.error('Erro ao carregar dados das linguagens:', error);
            showHome();
        });

    function showHome() {
        homeContainer.style.display = 'block';
        languagesContainer.style.display = 'none';
        articlesContainer.style.display = 'none';
        notesContainer.style.display = 'none';
        
        document.getElementById('nav-estudos').classList.remove('active');
        document.getElementById('nav-artigos').classList.remove('active');
        
        createTimeline();
    }

    function showStudies() {
        homeContainer.style.display = 'none';
        languagesContainer.style.display = 'block';
        articlesContainer.style.display = 'none';
        notesContainer.style.display = 'none';
        
        document.getElementById('nav-estudos').classList.add('active');
        document.getElementById('nav-artigos').classList.remove('active');
        
        createLanguageCards();
    }

    function showArticles() {
        homeContainer.style.display = 'none';
        languagesContainer.style.display = 'none';
        articlesContainer.style.display = 'block';
        notesContainer.style.display = 'none';
        
        document.getElementById('nav-estudos').classList.remove('active');
        document.getElementById('nav-artigos').classList.add('active');
        
        createArticleCards();
    }

    function createTimeline() {
        homeContainer.innerHTML = `
            <div class="publications-header">
                <h2>Jornada do Conhecimento</h2>
                <p>Explore todas as anotações e descubra novos conceitos em programação.</p>
            </div>
            <div class="publications-list" id="publications-list"></div>
        `;
        const publicationsList = document.getElementById('publications-list');
        
        if (!languagesData) {
            publicationsList.innerHTML = '<p>Carregando publicações...</p>';
            return;
        }

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

        allNotes.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (allNotes.length === 0) {
            publicationsList.innerHTML = '<p class="no-notes">Nenhuma publicação ainda.</p>';
            return;
        }

        allNotes.forEach(note => {
            const noteDate = new Date(note.date);
            const day = noteDate.getDate();
            const month = noteDate.toLocaleDateString('pt-BR', { month: 'long' });
            const year = noteDate.getFullYear();
            const formattedDate = `${day} de ${month} de ${year}`;

            publicationsList.innerHTML += `
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
        });
    }

    function createLanguageCards() {
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

        const algorithmsCard = document.createElement('div');
        algorithmsCard.className = 'language-card';
        algorithmsCard.innerHTML = `
            <div class="language-icon">🧠</div>
            <div class="language-name">Algoritmos</div>
            <div class="language-notes-count">Em breve...</div>
        `;
        
        algorithmsCard.addEventListener('click', () => {
            alert('Conteúdo de algoritmos em desenvolvimento! 🚧');
        });
        languagesGrid.appendChild(algorithmsCard);

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

    function showLanguageNotes(language) {
        homeContainer.style.display = 'none';
        languagesContainer.style.display = 'none';
        articlesContainer.style.display = 'none';
        notesContainer.style.display = 'block';
        
        notesContainer.innerHTML = `
            <button class="back-button" onclick="window.showStudies()">← Voltar para Estudos</button>
            <div class="language-notes-header">
                <h2>${language.icon} ${language.name}</h2>
            </div>
            <div class="notes-list" id="language-notes-list"></div>
        `;
        const notesList = document.getElementById('language-notes-list');
        
        if (language.notes.length === 0) {
            notesList.innerHTML = '<p>Nenhuma anotação disponível ainda para esta linguagem.</p>';
            return;
        }

        language.notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            noteItem.innerHTML = `
                <div class="note-title">${note.title}</div>
            `;
            
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

                notesContainer.innerHTML = `
                    <button class="back-button" onclick='${backButtonOnClick.replace(/'/g, "\'")}'>← Voltar para ${language.name}</button>
                    <div class="note">${converter.makeHtml(text)}</div>
                `;

                const codeBlocks = notesContainer.querySelectorAll('pre code');
                codeBlocks.forEach(codeBlock => {
                    hljs.highlightElement(codeBlock);
                });

                addCopyButtons(notesContainer);
            });
    }

    function showArticle(article) {
        fetch(article.file)
            .then(response => response.text())
            .then(text => {
                homeContainer.style.display = 'none';
                languagesContainer.style.display = 'none';
                articlesContainer.style.display = 'none';
                notesContainer.style.display = 'block';
                
                notesContainer.innerHTML = `
                    <button class="back-button" onclick="window.showArticles()">← Voltar para Artigos</button>
                    <div class="note">${converter.makeHtml(text)}</div>
                `;

                const codeBlocks = notesContainer.querySelectorAll('pre code');
                codeBlocks.forEach(codeBlock => {
                    hljs.highlightElement(codeBlock);
                });

                addCopyButtons(notesContainer);
            });
    }

    window.showHome = showHome;
    window.showStudies = showStudies;
    window.showArticles = showArticles;
    window.showLanguageNotes = showLanguageNotes;
    window.showNote = showNote;
    window.showArticle = showArticle;
});