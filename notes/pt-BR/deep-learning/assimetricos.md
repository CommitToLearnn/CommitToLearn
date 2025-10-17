# Criptografia Assimétrica e Funções de Hash

Imagine que você tem um cofre com duas fechaduras e duas chaves diferentes: uma **chave pública** e uma **chave privada**.

-   **Chave Pública:** Você pode distribuir cópias desta chave para qualquer pessoa. Ela serve apenas para **trancar** o cofre. Uma vez que algo é colocado dentro e o cofre é trancado com a chave pública, essa mesma chave não consegue abri-lo.
-   **Chave Privada:** Esta chave é só sua e você a guarda em segredo. Ela é a única que consegue **abrir** o cofre que foi trancado com a sua chave pública.

A **função de hash** é como tirar uma "impressão digital" única de um documento. Não importa o tamanho do documento, a impressão digital (o hash) terá sempre o mesmo tamanho. É impossível recriar o documento a partir da impressão digital, mas qualquer mínima alteração no documento original gera uma impressão digital completamente diferente.

### O que são e por que usar?

**Criptografia Assimétrica** (ou criptografia de chave pública) é um sistema que utiliza um par de chaves para criptografar e descriptografar dados. O que uma chave criptografa, somente a outra pode descriptografar. Isso resolve o principal problema da criptografia simétrica: a necessidade de compartilhar uma chave secreta de forma segura.

**Funções de Hash** são algoritmos que transformam uma entrada de dados de qualquer tamanho em uma saída de tamanho fixo, chamada de "hash" ou "digest". Esse processo é unidirecional (one-way), o que significa que é computacionalmente inviável reverter o processo.

**Principais Benefícios Combinados:**

-   **Confidencialidade:** Apenas o destinatário com a chave privada pode ler a mensagem.
-   **Autenticidade:** É possível provar que uma mensagem veio de um remetente específico.
-   **Integridade:** Garante que a mensagem não foi alterada no caminho.
-   **Não Repúdio:** O remetente não pode negar ter enviado a mensagem.

### Exemplos Práticos

#### Cenário 1: Enviar uma Mensagem Confidencial

Alice quer enviar uma mensagem secreta para Bob.

1.  **Bob compartilha sua chave pública** com Alice (e com o mundo todo, se quiser).
2.  **Alice usa a chave pública de Bob** para criptografar a mensagem.
3.  Alice envia a mensagem criptografada para Bob.
4.  **Bob usa sua chave privada** (que só ele tem) para descriptografar e ler a mensagem.
    -   Mesmo que um invasor (Eve) intercepte a mensagem, ela não conseguirá lê-la, pois não possui a chave privada de Bob.

```python
# Exemplo conceitual com a biblioteca 'cryptography'
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

# 1. Bob gera seu par de chaves
private_key_bob = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key_bob = private_key_bob.public_key()

# 2. Alice usa a chave pública de Bob para criptografar
mensagem = b"Minha mensagem super secreta!"
mensagem_criptografada = public_key_bob.encrypt(
    mensagem,
    padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None)
)

# 3. Bob usa sua chave privada para descriptografar
mensagem_descriptografada = private_key_bob.decrypt(
    mensagem_criptografada,
    padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None)
)

print(mensagem_descriptografada.decode()) # Saída: Minha mensagem super secreta!
```

#### Cenário 2: Assinatura Digital (Garantir Autenticidade e Integridade)

Alice quer enviar um contrato para Bob e provar que foi ela quem enviou e que o contrato não foi alterado.

1.  **Alice cria um hash** do contrato. Isso gera uma "impressão digital" única do documento.
2.  **Alice criptografa o hash com sua chave privada**. O resultado é a **assinatura digital**.
3.  Alice envia o contrato original (em texto plano) junto com a assinatura digital para Bob.
4.  **Bob recebe o material e faz duas coisas:**
    a.  Ele mesmo calcula o hash do contrato que recebeu.
    b.  Ele usa a **chave pública de Alice** para descriptografar a assinatura digital. O resultado deve ser o hash original que Alice calculou.
5.  Bob compara os dois hashes (o que ele calculou e o que ele obteve da assinatura). Se forem idênticos, ele tem certeza de que o contrato veio de Alice e não foi modificado.

```python
# Exemplo conceitual
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa

# Alice gera seu par de chaves
private_key_alice = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key_alice = private_key_alice.public_key()

contrato = b"Este e o contrato oficial."

# 1. Alice calcula o hash do contrato
sha256 = hashes.SHA256()
h = hashes.Hash(sha256)
h.update(contrato)
digest = h.finalize()

# 2. Alice assina o hash com sua chave privada
assinatura = private_key_alice.sign(
    digest,
    padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
    hashes.SHA256()
)

# 4. Bob verifica a assinatura com a chave pública de Alice
try:
    public_key_alice.verify(
        assinatura,
        digest, # Bob recalcula o digest do contrato recebido
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
        hashes.SHA256()
    )
    print("Assinatura valida! O contrato e autentico e integro.")
except Exception:
    print("Assinatura invalida! O contrato foi alterado ou nao veio de Alice.")
```

### Armadilhas Comuns

1.  **Criptografar Dados Grandes com Chave Assimétrica:** A criptografia assimétrica é computacionalmente cara (lenta). Ela não foi projetada para criptografar arquivos grandes. A solução é usar um **envelope híbrido**:
    -   Gere uma chave simétrica aleatória (rápida).
    -   Use a chave simétrica para criptografar o arquivo grande.
    -   Use a chave pública do destinatário para criptografar a chave simétrica.
    -   Envie o arquivo criptografado junto com a chave simétrica criptografada.
2.  **Confundir Criptografia com Assinatura:**
    -   **Criptografia (Confidencialidade):** Usa a chave **pública** do destinatário.
    -   **Assinatura (Autenticidade):** Usa a chave **privada** do remetente.
3.  **Armazenamento Inseguro da Chave Privada:** A segurança de todo o sistema depende do sigilo da chave privada. Se ela for comprometida, a identidade pode ser forjada.

### Boas Práticas

-   **Use Algoritmos Modernos:** Prefira RSA com padding OAEP e assinaturas PSS, ou use criptografia de curva elíptica (ECC), que oferece a mesma segurança com chaves menores. Para hashes, use SHA-256 ou superior.
-   **Proteja sua Chave Privada:** Armazene-a em um local seguro, como um Hardware Security Module (HSM) ou, no mínimo, protegida por uma senha forte.
-   **Gerenciamento de Chaves:** Tenha um plano para rotacionar (trocar) chaves periodicamente e revogar chaves que foram comprometidas (usando uma Certificate Revocation List - CRL).
-   **Não Reimplemente a Criptografia:** Sempre use bibliotecas criptográficas bem estabelecidas e auditadas. A chance de introduzir uma vulnerabilidade ao implementar do zero é altíssima.

### Resumo Rápido

| Operação | Chave Usada para "Fechar" | Chave Usada para "Abrir" | Propósito |
| :--- | :--- | :--- | :--- |
| **Criptografia** | Chave **Pública** do Destinatário | Chave **Privada** do Destinatário | Confidencialidade |
| **Assinatura Digital** | Chave **Privada** do Remetente | Chave **Pública** do Remetente | Autenticidade e Integridade |
