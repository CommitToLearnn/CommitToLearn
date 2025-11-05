### **RPC (Remote Procedure Call)**

Imagine que você tem um assistente pessoal muito eficiente, mas que trabalha em outro prédio.

Quando você precisa que ele calcule as despesas do mês, você simplesmente pega o telefone e diz: "Fulano, calcule as despesas com estes dados aqui".

*   **Para você**, foi como se você tivesse pedido para alguém que estava ao seu lado. Você fez uma pergunta e recebeu uma resposta.
*   **Na realidade**, sua voz viajou por fios (rede), o assistente processou tudo no cérebro dele (servidor remoto) e te devolveu o resultado pela linha telefônica.

**RPC (Chamada de Procedimento Remoto)** é exatamente isso. É fazer com que a chamada de uma função que está em *outro computador* pareça ser uma chamada de função *local* no seu próprio código.

### O Conceito em Detalhes

**O Truque da Ilusão Local**

A ideia central do RPC é esconder a complexidade da rede.
No seu código, você escreve:
`resultado = servico.somar(5, 10)`

Você não escreve código para abrir conexão de rede, serializar dados, enviar pacotes, esperar resposta, deserializar... O RPC faz tudo isso nos bastidores.

**Como funciona por baixo dos panos (O "Stub")**

Para essa mágica acontecer, existe um componente chamado **Stub**.
*   **No seu lado (Cliente):** Existe um "stub cliente". Ele finge ser a função real. Quando você o chama, ele empacota os dados e os envia pela rede.
*   **No outro lado (Servidor):** Existe um "stub servidor". Ele recebe o pacote, desempacota, chama a função real de verdade, pega o resultado, empacota de novo e manda de volta.

**Não é uma tecnologia específica**

RPC é um **conceito**, uma forma de pensar. REST é um estilo de arquitetura; RPC é outro.
Enquanto REST foca em **recursos** (substantivos), RPC foca em **ações** (verbos).
*   REST: `POST /usuarios/123/calculo-salario`
*   RPC: `calcularSalario(usuario_id=123)`

### Por Que Isso Importa?

*   **Simplicidade de Código:** Seu código de negócio fica limpo. Você chama funções, não monta requisições HTTP complexas.
*   **Ações Claras:** É muito intuitivo para comandos. "Desligar sistema", "Calcular rota", "Processar pagamento".
*   **Desacoplamento:** Você pode ter serviços escritos em linguagens diferentes conversando entre si, desde que falem o mesmo protocolo RPC.

### Exemplos Práticos

**Cenário:** Você quer redimensionar uma imagem.

**Abordagem Local (se tudo estivesse no mesmo PC):**
```python
imagem = carregar("foto.jpg")
imagem_pequena = redimensionar(imagem, 100, 100) # Função local
```

**Abordagem RPC (o processamento pesado está em outro servidor):**
```python
# No código, parece igual!
rpc_client = connect_rpc("servidor-de-imagens")
imagem = carregar("foto.jpg")
# O RPC cuida de enviar os bytes da imagem pela rede e trazer de volta
imagem_pequena = rpc_client.redimensionar(imagem, 100, 100)
```

### Armadilhas Comuns

*   **A Falácia da Computação Local:** O maior erro é *esquecer* que a função é remota.
    *   Uma função local leva milissegundos e raramente falha.
    *   Uma chamada RPC pode demorar segundos (latência de rede) ou falhar completamente (cabo desconectado).
    *   Se você tratar RPC exatamente como local, seu app vai travar quando a rede oscilar.
*   **Acoplamento Forte:** Se o servidor mudar o nome da função de `somar` para `somarNumeros`, o cliente quebra imediatamente.

### Boas Práticas

*   **Trate Erros de Rede:** Sempre envolva chamadas RPC em blocos try/catch que esperam timeouts ou falhas de conexão.
*   **Use para Ações, não para Dados:** RPC brilha quando você quer executar um *processo*. Para apenas buscar dados simples (CRUD), REST costuma ser mais flexível.

### Resumo Rápido

*   **O que é?** Uma técnica para chamar uma função em outro computador como se ela fosse local.
*   **Foco:** Ações (Verbos).
*   **Mecanismo:** Usa "stubs" para esconder a complexidade da comunicação de rede.
*   **Vantagem:** Código mais simples e direto.
*   **Perigo:** Esquecer que a rede existe e pode falhar.