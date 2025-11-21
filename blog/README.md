# CommitToLearn - Redesign Moderno

Um blog de estudos reimaginado com visualizações 3D impactantes usando Astro, React, Three.js e Tailwind CSS.

## 🚀 Características

- **Astro + React**: Performance otimizada com islands architecture
- **Visualizações 3D**: Three.js com @react-three/fiber e @react-three/drei
- **Design Moderno**: Tailwind CSS com gradientes e efeitos glassmorphism
- **Animações Elegantes**: Framer Motion para transições suaves
- **Suporte i18n**: Conteúdo em Português e Inglês
- **Markdown**: Artigos e notas em formato markdown

## 🎨 Componentes 3D

### GraphNodes
Visualização de nós conectados para artigos sobre grafos, estruturas de dados e algoritmos.

### DockerBlocks
Blocos empilhados representando containers Docker, microserviços e arquitetura.

### NeuralNetwork
Rede neural interativa para artigos sobre Machine Learning e Deep Learning.


## 🛠️ Setup e Desenvolvimento

### Instalar dependências
```sh
npm install
```

### Copiar conteúdo existente
Copie os artigos e notas do projeto antigo:

```powershell
# No Windows PowerShell
xcopy ..\articles .\articles\ /E /I
xcopy ..\notes .\notes\ /E /I
xcopy ..\data .\data\ /E /I
```

### Desenvolvimento
```sh
npm run dev
```
O site estará disponível em `http://localhost:4321`

### Build para produção
```sh
npm run build
```

## 📝 Adicionando Conteúdo

Adicione arquivos `.md` em:
- `articles/` - Artigos em Português
- `articles/en-US/` - Artigos em Inglês
- `notes/pt-BR/categoria/` - Notas em Português

## 🚀 Deploy

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Configure no `astro.config.mjs`

## 📚 Tecnologias

- [Astro](https://astro.build/) - Framework web
- [React](https://react.dev/) - UI library
- [Three.js](https://threejs.org/) - Visualizações 3D
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer para Three.js
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animações
