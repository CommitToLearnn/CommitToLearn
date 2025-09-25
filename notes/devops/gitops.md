### **GitOps: A Governança da Infraestrutura como Código**

GitOps é uma **metodologia operacional para IaC e entrega contínua que utiliza o Git como a única fonte da verdade**. Pense no GitOps como a **Prefeitura de uma cidade, onde a Planta Mestra registrada no cartório (o repositório Git) dita, de forma auditável e automática, como a cidade deve ser**.

**O Problema Resolvido**
Ter a infraestrutura como código (IaC) é o primeiro passo. O próximo desafio é gerenciar o ciclo de vida desse código. Quem pode aprovar mudanças? Como garantimos que o que está em produção é *exatamente* o que está na branch `main` do repositório? A aplicação manual (`terraform apply`) ainda pode introduzir erros ou desvios.

**A Solução: O Fluxo de Trabalho GitOps**
GitOps estabelece um fluxo de trabalho rigoroso e automatizado:

1.  **Estado Desejado no Git:** Todo o estado desejado do sistema (configurações de infraestrutura, versões de aplicações, políticas de rede) é descrito de forma declarativa em um repositório Git.
2.  **Mudanças via Pull Request (PR):** Para realizar qualquer alteração, um operador ou desenvolvedor abre um Pull Request. Ninguém modifica o ambiente de produção diretamente.
3.  **Revisão e Merge:** O PR passa por um processo de revisão por pares (code review), testes automatizados e aprovações. Uma vez aprovado, é mesclado na branch principal (ex: `main`).
4.  **Reconciliação Automática:** Um agente de software (como **Argo CD** ou **Flux**), em execução no ambiente de destino (ex: um cluster Kubernetes), monitora continuamente o repositório Git.
5.  **Sincronização:** Ao detectar uma divergência entre o estado definido no Git e o estado real do sistema, o agente automaticamente aplica as mudanças necessárias para reconciliar o ambiente, fazendo com que ele corresponda à fonte da verdade no Git.

**Vantagens Fundamentais:**
*   **Rastreabilidade e Auditoria:** O histórico do Git fornece um log completo e imutável de todas as mudanças, incluindo autor, data e justificativa.
*   **Segurança e Consistência:** Remove a necessidade de credenciais de acesso direto aos ambientes de produção para a maioria da equipe, centralizando as mudanças em um fluxo de revisão controlado.
*   **Recuperação Rápida:** Se uma mudança introduzir um problema, o rollback é tão simples quanto reverter um commit no Git (`git revert`). O agente se encarrega de restaurar o sistema ao estado funcional anterior.
*   **Produtividade:** Unifica o fluxo de trabalho para desenvolvedores e operadores. A mesma prática de PRs usada para o código da aplicação é usada para a infraestrutura.

**Caso de Uso Principal:** Gerenciamento de clusters Kubernetes e implantação de aplicações, onde ferramentas declarativas se encaixam perfeitamente no modelo de reconciliação contínua.