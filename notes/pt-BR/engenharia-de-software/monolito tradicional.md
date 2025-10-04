### **O Monolito Tradicional: A Loja de Departamentos**

Pense em um monolito como uma **grande loja de departamentos**. Tudo está sob o mesmo teto: vendas, estoque, faturamento, RH. Todos os processos estão contidos em uma única e grande estrutura.

**Ideia Central:**
Uma aplicação monolítica é construída como uma **única unidade de implantação (um único arquivo `.jar`, `.war`, ou um único executável)**. Todo o código-fonte para todas as funcionalidades de negócio está em uma única base de código.

**Características:**
*   **Base de Código Única:** O código de UI, a lógica de negócio e a camada de acesso a dados estão todos juntos.
*   **Fortemente Acoplado:** Módulos e componentes frequentemente têm conhecimento direto uns dos outros, chamando funções e métodos diretamente. Uma mudança em um componente pode facilmente impactar outro.
*   **Implantação "Tudo ou Nada":** Para atualizar a menor parte da aplicação, a aplicação inteira precisa ser reconstruída, testada e implantada novamente.
*   **Banco de Dados Centralizado:** Geralmente, todos os módulos compartilham o mesmo esquema de banco de dados.

**Vantagens:**
*   **Simplicidade Inicial:** Fácil de começar a desenvolver, testar e implantar quando a aplicação é pequena.
*   **Desempenho (em teoria):** A comunicação entre componentes é feita através de chamadas de função em memória, que são extremamente rápidas.

**Desvantagens (O "Monolithic Hell"):**
*   **Escalabilidade Ineficiente:** Se o módulo de processamento de pagamentos precisa de mais recursos, você precisa escalar a aplicação inteira, desperdiçando recursos nos módulos menos usados.
*   **Baixa Resiliência:** Uma falha em um único componente (ex: um loop infinito no módulo de relatórios) pode derrubar a aplicação inteira.
*   **Tecnologia "Presa no Tempo":** Adotar uma nova tecnologia ou linguagem de programação é extremamente difícil, pois exigiria reescrever grandes partes da aplicação.
*   **Desenvolvimento Lento em Escala:** Conforme a equipe e a base de código crescem, a complexidade aumenta exponencialmente, os tempos de build se tornam longos e o risco de conflitos de merge é alto.