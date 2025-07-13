# Algoritmos SHA (Secure Hash Algorithm)

## O que são Algoritmos SHA?

SHA (Secure Hash Algorithm) é uma família de funções de hash criptográficas projetadas pela NSA (National Security Agency) e publicadas pelo NIST (National Institute of Standards and Technology). São amplamente utilizados em segurança digital, integridade de dados e blockchains.

## Características Fundamentais

### Propriedades de uma Função Hash Criptográfica
- **Determinística**: Mesma entrada produz sempre a mesma saída
- **Unidirecional**: Computacionalmente impossível reverter
- **Resistente a Colisões**: Difícil encontrar duas entradas com mesmo hash
- **Efeito Avalanche**: Pequena mudança na entrada altera drasticamente a saída
- **Tamanho Fixo**: Saída sempre tem mesmo tamanho independente da entrada

### Exemplo do Efeito Avalanche
```
SHA-256("Hello") = 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969
SHA-256("Hello!") = 334d016f755cd6dc58c53a86e183882f8ec14f52fb05345887c8a5edd42c87b7
```

## Família SHA

### SHA-0 (1993) - OBSOLETO
- **Tamanho**: 160 bits
- **Status**: Vulnerável, não deve ser usado
- **Problema**: Vulnerabilidades de colisão descobertas

### SHA-1 (1995) - DEPRECIADO
- **Tamanho**: 160 bits
- **Status**: Depreciado desde 2017
- **Uso**: Ainda usado em alguns sistemas legados
- **Vulnerabilidade**: Ataques de colisão demonstrados

### SHA-2 (2001) - ATUAL
Família com diferentes tamanhos de hash:
- **SHA-224**: 224 bits
- **SHA-256**: 256 bits ⭐ (mais comum)
- **SHA-384**: 384 bits
- **SHA-512**: 512 bits
- **SHA-512/224**: 224 bits (baseado em SHA-512)
- **SHA-512/256**: 256 bits (baseado em SHA-512)

### SHA-3 (2015) - MAIS RECENTE
- **Keccak**: Algoritmo base
- **Tamanhos**: 224, 256, 384, 512 bits
- **Estrutura**: Diferente do SHA-2 (sponge construction)

## Implementação SHA-256

### Implementação Completa em Python
```python
import struct
import math

class SHA256:
    def __init__(self):
        # Constantes iniciais (primeiros 32 bits das raízes quadradas dos primeiros 8 primos)
        self.h = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ]
        
        # Constantes de round (primeiros 32 bits das raízes cúbicas dos primeiros 64 primos)
        self.k = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ]
    
    def _rotr(self, x, n):
        """Rotação à direita de n bits"""
        return ((x >> n) | (x << (32 - n))) & 0xffffffff
    
    def _ch(self, x, y, z):
        """Função choose: se x então y senão z"""
        return (x & y) ^ (~x & z)
    
    def _maj(self, x, y, z):
        """Função majority: resultado da maioria dos bits"""
        return (x & y) ^ (x & z) ^ (y & z)
    
    def _sigma0(self, x):
        """Função Sigma0"""
        return self._rotr(x, 2) ^ self._rotr(x, 13) ^ self._rotr(x, 22)
    
    def _sigma1(self, x):
        """Função Sigma1"""
        return self._rotr(x, 6) ^ self._rotr(x, 11) ^ self._rotr(x, 25)
    
    def _gamma0(self, x):
        """Função Gamma0"""
        return self._rotr(x, 7) ^ self._rotr(x, 18) ^ (x >> 3)
    
    def _gamma1(self, x):
        """Função Gamma1"""
        return self._rotr(x, 17) ^ self._rotr(x, 19) ^ (x >> 10)
    
    def _preprocess(self, message):
        """Pré-processamento: padding e length encoding"""
        if isinstance(message, str):
            message = message.encode('utf-8')
        
        # Comprimento original em bits
        original_length = len(message) * 8
        
        # Adicionar bit '1' seguido de zeros
        message += b'\x80'
        
        # Padding com zeros até que o comprimento seja ≡ 448 (mod 512)
        while (len(message) % 64) != 56:
            message += b'\x00'
        
        # Adicionar comprimento original como 64-bit big-endian
        message += struct.pack('>Q', original_length)
        
        return message
    
    def _process_chunk(self, chunk):
        """Processa um chunk de 512 bits"""
        # Quebrar chunk em 16 palavras de 32 bits
        w = list(struct.unpack('>16I', chunk))
        
        # Estender para 64 palavras
        for i in range(16, 64):
            s0 = self._gamma0(w[i-15])
            s1 = self._gamma1(w[i-2])
            w.append((w[i-16] + s0 + w[i-7] + s1) & 0xffffffff)
        
        # Inicializar working variables
        a, b, c, d, e, f, g, h = self.h
        
        # 64 rounds de processing
        for i in range(64):
            S1 = self._sigma1(e)
            ch = self._ch(e, f, g)
            temp1 = (h + S1 + ch + self.k[i] + w[i]) & 0xffffffff
            S0 = self._sigma0(a)
            maj = self._maj(a, b, c)
            temp2 = (S0 + maj) & 0xffffffff
            
            h = g
            g = f
            f = e
            e = (d + temp1) & 0xffffffff
            d = c
            c = b
            b = a
            a = (temp1 + temp2) & 0xffffffff
        
        # Atualizar hash values
        self.h[0] = (self.h[0] + a) & 0xffffffff
        self.h[1] = (self.h[1] + b) & 0xffffffff
        self.h[2] = (self.h[2] + c) & 0xffffffff
        self.h[3] = (self.h[3] + d) & 0xffffffff
        self.h[4] = (self.h[4] + e) & 0xffffffff
        self.h[5] = (self.h[5] + f) & 0xffffffff
        self.h[6] = (self.h[6] + g) & 0xffffffff
        self.h[7] = (self.h[7] + h) & 0xffffffff
    
    def digest(self, message):
        """Calcula hash SHA-256 da mensagem"""
        # Reset state
        self.h = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ]
        
        # Pré-processar mensagem
        processed_message = self._preprocess(message)
        
        # Processar em chunks de 512 bits (64 bytes)
        for i in range(0, len(processed_message), 64):
            chunk = processed_message[i:i+64]
            self._process_chunk(chunk)
        
        # Produzir hash final
        return ''.join(f'{x:08x}' for x in self.h)
    
    def hexdigest(self, message):
        """Alias para digest (compatibilidade com hashlib)"""
        return self.digest(message)

# Exemplo de uso
def test_sha256():
    sha = SHA256()
    
    test_cases = [
        "",
        "abc",
        "message digest",
        "abcdefghijklmnopqrstuvwxyz",
        "The quick brown fox jumps over the lazy dog"
    ]
    
    print("Testando implementação SHA-256:")
    print("-" * 60)
    
    for test in test_cases:
        result = sha.digest(test)
        print(f"Input: '{test}'")
        print(f"SHA-256: {result}")
        
        # Verificar com hashlib
        import hashlib
        expected = hashlib.sha256(test.encode()).hexdigest()
        match = "✓" if result == expected else "✗"
        print(f"Match: {match}")
        print()

if __name__ == "__main__":
    test_sha256()
```

### Implementação Otimizada com Numpy
```python
import numpy as np

class FastSHA256:
    def __init__(self):
        self.h = np.array([
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ], dtype=np.uint32)
        
        self.k = np.array([
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ], dtype=np.uint32)
    
    def _rotr(self, x, n):
        """Rotação vetorizada"""
        return np.bitwise_or(np.right_shift(x, n), np.left_shift(x, 32 - n))
    
    def digest_multiple(self, messages):
        """Calcula hash de múltiplas mensagens em paralelo"""
        results = []
        for message in messages:
            # Implementação simplificada - na prática usaria vetorização completa
            result = self.digest(message)
            results.append(result)
        return results
```

## Comparação entre Variantes SHA

### SHA-1 vs SHA-2 vs SHA-3
```python
import hashlib
import time

def compare_sha_algorithms():
    """Compara diferentes algoritmos SHA"""
    
    test_data = "The quick brown fox jumps over the lazy dog" * 1000
    algorithms = {
        'SHA-1': hashlib.sha1,
        'SHA-224': hashlib.sha224,
        'SHA-256': hashlib.sha256,
        'SHA-384': hashlib.sha384,
        'SHA-512': hashlib.sha512,
        'SHA3-256': hashlib.sha3_256,
        'SHA3-512': hashlib.sha3_512
    }
    
    print("Algoritmo\tTamanho Hash\tTempo (ms)\tHash (primeiros 16 chars)")
    print("-" * 80)
    
    for name, algo_func in algorithms.items():
        start_time = time.time()
        
        # Executar 1000 vezes para medir performance
        for _ in range(1000):
            hasher = algo_func()
            hasher.update(test_data.encode())
            result = hasher.hexdigest()
        
        end_time = time.time()
        duration_ms = (end_time - start_time) * 1000
        
        print(f"{name}\t\t{len(result)*4} bits\t\t{duration_ms:.2f}\t\t{result[:16]}...")

if __name__ == "__main__":
    compare_sha_algorithms()
```

## Aplicações Práticas

### Sistema de Integridade de Arquivos
```python
import os
import hashlib
import json
from pathlib import Path

class FileIntegrityChecker:
    def __init__(self, algorithm='sha256'):
        self.algorithm = algorithm
        self.hash_func = getattr(hashlib, algorithm)
    
    def calculate_file_hash(self, filepath):
        """Calcula hash de um arquivo"""
        hasher = self.hash_func()
        
        try:
            with open(filepath, 'rb') as f:
                # Ler arquivo em chunks para arquivos grandes
                for chunk in iter(lambda: f.read(4096), b""):
                    hasher.update(chunk)
            
            return hasher.hexdigest()
        except IOError as e:
            return f"Error: {e}"
    
    def create_manifest(self, directory):
        """Cria manifesto com hashes de todos os arquivos"""
        manifest = {}
        directory_path = Path(directory)
        
        for filepath in directory_path.rglob('*'):
            if filepath.is_file():
                relative_path = str(filepath.relative_to(directory_path))
                file_hash = self.calculate_file_hash(filepath)
                
                manifest[relative_path] = {
                    'hash': file_hash,
                    'size': filepath.stat().st_size,
                    'algorithm': self.algorithm
                }
        
        return manifest
    
    def verify_manifest(self, directory, manifest):
        """Verifica integridade usando manifesto"""
        results = {
            'verified': [],
            'modified': [],
            'missing': [],
            'new_files': []
        }
        
        directory_path = Path(directory)
        current_files = set()
        
        # Verificar arquivos no manifesto
        for relative_path, file_info in manifest.items():
            filepath = directory_path / relative_path
            current_files.add(relative_path)
            
            if not filepath.exists():
                results['missing'].append(relative_path)
                continue
            
            current_hash = self.calculate_file_hash(filepath)
            if current_hash == file_info['hash']:
                results['verified'].append(relative_path)
            else:
                results['modified'].append({
                    'file': relative_path,
                    'expected': file_info['hash'],
                    'actual': current_hash
                })
        
        # Verificar arquivos novos
        for filepath in directory_path.rglob('*'):
            if filepath.is_file():
                relative_path = str(filepath.relative_to(directory_path))
                if relative_path not in current_files:
                    results['new_files'].append(relative_path)
        
        return results
    
    def save_manifest(self, manifest, filepath):
        """Salva manifesto em arquivo JSON"""
        with open(filepath, 'w') as f:
            json.dump(manifest, f, indent=2)
    
    def load_manifest(self, filepath):
        """Carrega manifesto de arquivo JSON"""
        with open(filepath, 'r') as f:
            return json.load(f)

# Exemplo de uso
def demo_file_integrity():
    checker = FileIntegrityChecker(algorithm='sha256')
    
    # Criar manifesto
    print("Criando manifesto...")
    manifest = checker.create_manifest('/path/to/directory')
    checker.save_manifest(manifest, 'integrity_manifest.json')
    
    # Verificar integridade
    print("Verificando integridade...")
    results = checker.verify_manifest('/path/to/directory', manifest)
    
    print(f"Arquivos verificados: {len(results['verified'])}")
    print(f"Arquivos modificados: {len(results['modified'])}")
    print(f"Arquivos faltando: {len(results['missing'])}")
    print(f"Arquivos novos: {len(results['new_files'])}")
```

### Sistema de Autenticação com Salt
```python
import hashlib
import secrets
import base64
import time

class SecurePasswordManager:
    def __init__(self, hash_algorithm='sha256', iterations=100000):
        self.hash_algorithm = hash_algorithm
        self.iterations = iterations
    
    def generate_salt(self, length=32):
        """Gera salt criptograficamente seguro"""
        return secrets.token_bytes(length)
    
    def hash_password(self, password, salt=None):
        """Hash de senha com salt usando PBKDF2"""
        if salt is None:
            salt = self.generate_salt()
        
        if isinstance(password, str):
            password = password.encode('utf-8')
        
        # PBKDF2 com SHA-256
        hashed = hashlib.pbkdf2_hmac(
            self.hash_algorithm,
            password,
            salt,
            self.iterations
        )
        
        return {
            'hash': base64.b64encode(hashed).decode('ascii'),
            'salt': base64.b64encode(salt).decode('ascii'),
            'iterations': self.iterations,
            'algorithm': self.hash_algorithm
        }
    
    def verify_password(self, password, stored_hash_info):
        """Verifica senha contra hash armazenado"""
        salt = base64.b64decode(stored_hash_info['salt'])
        
        if isinstance(password, str):
            password = password.encode('utf-8')
        
        # Recalcular hash com mesmos parâmetros
        hashed = hashlib.pbkdf2_hmac(
            stored_hash_info['algorithm'],
            password,
            salt,
            stored_hash_info['iterations']
        )
        
        computed_hash = base64.b64encode(hashed).decode('ascii')
        return computed_hash == stored_hash_info['hash']
    
    def benchmark_iterations(self, target_time=0.1):
        """Encontra número de iterações para tempo alvo"""
        password = "test_password"
        iterations = 1000
        
        while True:
            start_time = time.time()
            self.hash_password(password)
            duration = time.time() - start_time
            
            if duration >= target_time:
                return iterations
            
            iterations *= 2

# Sistema de autenticação
class AuthenticationSystem:
    def __init__(self):
        self.password_manager = SecurePasswordManager()
        self.users = {}  # Em produção seria um banco de dados
    
    def register_user(self, username, password):
        """Registra novo usuário"""
        if username in self.users:
            return {"success": False, "message": "Usuário já existe"}
        
        hash_info = self.password_manager.hash_password(password)
        self.users[username] = hash_info
        
        return {"success": True, "message": "Usuário registrado com sucesso"}
    
    def authenticate_user(self, username, password):
        """Autentica usuário"""
        if username not in self.users:
            return {"success": False, "message": "Usuário não encontrado"}
        
        stored_hash = self.users[username]
        is_valid = self.password_manager.verify_password(password, stored_hash)
        
        if is_valid:
            return {"success": True, "message": "Autenticação bem-sucedida"}
        else:
            return {"success": False, "message": "Senha incorreta"}
    
    def change_password(self, username, old_password, new_password):
        """Altera senha do usuário"""
        # Verificar senha atual
        auth_result = self.authenticate_user(username, old_password)
        if not auth_result["success"]:
            return {"success": False, "message": "Senha atual incorreta"}
        
        # Gerar novo hash
        new_hash_info = self.password_manager.hash_password(new_password)
        self.users[username] = new_hash_info
        
        return {"success": True, "message": "Senha alterada com sucesso"}

# Exemplo de uso
def demo_authentication():
    auth_system = AuthenticationSystem()
    
    # Registrar usuário
    result = auth_system.register_user("alice", "minha_senha_secreta")
    print(result)
    
    # Tentar autenticar
    result = auth_system.authenticate_user("alice", "minha_senha_secreta")
    print(result)
    
    # Tentar senha errada
    result = auth_system.authenticate_user("alice", "senha_errada")
    print(result)
    
    # Alterar senha
    result = auth_system.change_password("alice", "minha_senha_secreta", "nova_senha")
    print(result)
```

### Merkle Tree para Verificação de Integridade
```python
class MerkleTree:
    def __init__(self, data_blocks, hash_func=hashlib.sha256):
        self.hash_func = hash_func
        self.leaves = self._hash_leaves(data_blocks)
        self.tree = self._build_tree(self.leaves)
        self.root = self.tree[0] if self.tree else None
    
    def _hash_data(self, data):
        """Hash de um bloco de dados"""
        if isinstance(data, str):
            data = data.encode('utf-8')
        return self.hash_func(data).hexdigest()
    
    def _hash_leaves(self, data_blocks):
        """Hash de todas as folhas"""
        return [self._hash_data(block) for block in data_blocks]
    
    def _build_tree(self, hashes):
        """Constrói árvore Merkle bottom-up"""
        if not hashes:
            return []
        
        tree_levels = [hashes]
        current_level = hashes
        
        while len(current_level) > 1:
            next_level = []
            
            # Processar pares de hashes
            for i in range(0, len(current_level), 2):
                left = current_level[i]
                
                # Se número ímpar, duplicar último hash
                if i + 1 < len(current_level):
                    right = current_level[i + 1]
                else:
                    right = left
                
                # Hash combinado
                combined = left + right
                parent_hash = self._hash_data(combined)
                next_level.append(parent_hash)
            
            tree_levels.insert(0, next_level)
            current_level = next_level
        
        return tree_levels
    
    def get_proof(self, leaf_index):
        """Gera prova de inclusão para uma folha"""
        if leaf_index >= len(self.leaves):
            return None
        
        proof = []
        current_index = leaf_index
        
        # Percorrer níveis da árvore de baixo para cima
        for level in reversed(self.tree[1:]):  # Pular o root
            # Determinar índice do sibling
            if current_index % 2 == 0:
                sibling_index = current_index + 1
                is_left = True
            else:
                sibling_index = current_index - 1
                is_left = False
            
            # Adicionar sibling à prova se existir
            if sibling_index < len(level):
                sibling_hash = level[sibling_index]
            else:
                sibling_hash = level[current_index]  # Duplicar se ímpar
            
            proof.append({
                'hash': sibling_hash,
                'is_left': is_left
            })
            
            # Subir para o próximo nível
            current_index = current_index // 2
        
        return proof
    
    def verify_proof(self, leaf_data, leaf_index, proof):
        """Verifica prova de inclusão"""
        current_hash = self._hash_data(leaf_data)
        
        for proof_element in proof:
            sibling_hash = proof_element['hash']
            is_left = proof_element['is_left']
            
            if is_left:
                combined = sibling_hash + current_hash
            else:
                combined = current_hash + sibling_hash
            
            current_hash = self._hash_data(combined)
        
        return current_hash == self.root
    
    def update_leaf(self, leaf_index, new_data):
        """Atualiza uma folha e reconstrói a árvore"""
        if leaf_index >= len(self.leaves):
            return False
        
        # Atualizar folha
        self.leaves[leaf_index] = self._hash_data(new_data)
        
        # Reconstruir árvore
        self.tree = self._build_tree(self.leaves)
        self.root = self.tree[0] if self.tree else None
        
        return True

# Exemplo de uso
def demo_merkle_tree():
    # Dados de exemplo
    data_blocks = [
        "Bloco de dados 1",
        "Bloco de dados 2", 
        "Bloco de dados 3",
        "Bloco de dados 4"
    ]
    
    # Criar árvore Merkle
    merkle_tree = MerkleTree(data_blocks)
    print(f"Root hash: {merkle_tree.root}")
    
    # Gerar prova para o primeiro bloco
    proof = merkle_tree.get_proof(0)
    print(f"Prova para bloco 0: {proof}")
    
    # Verificar prova
    is_valid = merkle_tree.verify_proof(data_blocks[0], 0, proof)
    print(f"Prova válida: {is_valid}")
    
    # Tentar verificar com dados incorretos
    is_valid_fake = merkle_tree.verify_proof("Dados falsos", 0, proof)
    print(f"Prova com dados falsos: {is_valid_fake}")
```

## Análise de Segurança

### Ataques Conhecidos

#### 1. Ataque de Colisão
```python
def collision_resistance_test():
    """Demonstra a resistência a colisões"""
    import random
    import string
    
    def generate_random_string(length=10):
        return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
    
    hashes_seen = set()
    attempts = 0
    max_attempts = 1000000
    
    print("Testando resistência a colisões (SHA-256)...")
    
    while attempts < max_attempts:
        random_string = generate_random_string()
        hash_value = hashlib.sha256(random_string.encode()).hexdigest()
        
        if hash_value in hashes_seen:
            print(f"COLISÃO ENCONTRADA após {attempts} tentativas!")
            return True
        
        hashes_seen.add(hash_value)
        attempts += 1
        
        if attempts % 100000 == 0:
            print(f"Tentativas: {attempts}, hashes únicos: {len(hashes_seen)}")
    
    print(f"Nenhuma colisão encontrada em {attempts} tentativas")
    return False
```

#### 2. Ataque de Pré-imagem
```python
def preimage_resistance_test():
    """Demonstra resistência a ataques de pré-imagem"""
    target_hash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"  # SHA-256 de string vazia
    
    print(f"Procurando pré-imagem para hash: {target_hash}")
    
    attempts = 0
    max_attempts = 1000000
    
    while attempts < max_attempts:
        # Tentar strings aleatórias
        candidate = f"attempt_{attempts}_{random.randint(1, 1000000)}"
        candidate_hash = hashlib.sha256(candidate.encode()).hexdigest()
        
        if candidate_hash == target_hash:
            print(f"PRÉ-IMAGEM ENCONTRADA: '{candidate}'")
            return True
        
        attempts += 1
        
        if attempts % 100000 == 0:
            print(f"Tentativas: {attempts}")
    
    print(f"Nenhuma pré-imagem encontrada em {attempts} tentativas")
    return False
```

### Vulnerabilidades Conhecidas

#### SHA-1 (DEPRECIADO)
```python
def sha1_vulnerability_demo():
    """Demonstra por que SHA-1 não deve ser usado"""
    # Exemplo de colisão conhecida no SHA-1 (demonstração conceitual)
    
    print("SHA-1 - Vulnerabilidades conhecidas:")
    print("1. Ataques de colisão demonstrados (SHAttered attack, 2017)")
    print("2. Complexidade reduzida para 2^63 operações")
    print("3. Não recomendado para aplicações de segurança")
    
    # Comparar com SHA-256
    test_data = "exemplo de dados"
    
    sha1_hash = hashlib.sha1(test_data.encode()).hexdigest()
    sha256_hash = hashlib.sha256(test_data.encode()).hexdigest()
    
    print(f"\nSHA-1:   {sha1_hash} (160 bits)")
    print(f"SHA-256: {sha256_hash} (256 bits)")
    
    print("\nRecomendação: Use SHA-256 ou superior!")
```

## Performance e Otimizações

### Benchmark de Algoritmos
```python
import time
import psutil
import os

def benchmark_sha_performance():
    """Benchmark completo dos algoritmos SHA"""
    
    # Dados de teste de tamanhos variados
    test_sizes = [1024, 10240, 102400, 1024000, 10240000]  # 1KB a 10MB
    algorithms = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'sha3_256', 'sha3_512']
    
    print("Algoritmo\tTamanho\t\tTempo(ms)\tThroughput(MB/s)\tCPU%\tMemória(MB)")
    print("-" * 85)
    
    for size in test_sizes:
        test_data = os.urandom(size)  # Dados aleatórios
        
        for algo_name in algorithms:
            # Monitorar recursos
            process = psutil.Process()
            cpu_before = process.cpu_percent()
            memory_before = process.memory_info().rss / 1024 / 1024
            
            # Benchmark
            start_time = time.time()
            
            hasher = getattr(hashlib, algo_name)()
            hasher.update(test_data)
            result = hasher.hexdigest()
            
            end_time = time.time()
            
            # Métricas
            duration_ms = (end_time - start_time) * 1000
            throughput = (size / (1024 * 1024)) / (end_time - start_time)
            cpu_after = process.cpu_percent()
            memory_after = process.memory_info().rss / 1024 / 1024
            
            cpu_usage = cpu_after - cpu_before
            memory_usage = memory_after - memory_before
            
            print(f"{algo_name}\t\t{size//1024}KB\t\t{duration_ms:.2f}\t\t{throughput:.2f}\t\t{cpu_usage:.1f}\t{memory_usage:.2f}")

if __name__ == "__main__":
    benchmark_sha_performance()
```

### Implementação Hardware-Acelerada
```python
try:
    import hashlib
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.backends import default_backend
    
    class HardwareAcceleratedSHA:
        """Wrapper para usar aceleração de hardware quando disponível"""
        
        def __init__(self, algorithm='sha256'):
            self.algorithm = algorithm
            self.use_hardware = self._check_hardware_support()
        
        def _check_hardware_support(self):
            """Verifica se há suporte de hardware"""
            # Verificar se CPU suporta instruções SHA
            try:
                import cpuinfo
                cpu_info = cpuinfo.get_cpu_info()
                return 'sha' in cpu_info.get('flags', [])
            except:
                return False
        
        def hash_data(self, data):
            """Hash usando implementação otimizada"""
            if self.use_hardware:
                # Usar implementação otimizada
                digest = hashes.Hash(getattr(hashes, self.algorithm.upper())(), backend=default_backend())
                digest.update(data)
                return digest.finalize().hex()
            else:
                # Fallback para implementação padrão
                hasher = getattr(hashlib, self.algorithm)()
                hasher.update(data)
                return hasher.hexdigest()
        
        def benchmark_comparison(self, data_size=1024*1024):
            """Compara performance hardware vs software"""
            test_data = os.urandom(data_size)
            
            # Teste hardware
            start_time = time.time()
            hw_result = self.hash_data(test_data)
            hw_time = time.time() - start_time
            
            # Teste software
            start_time = time.time()
            hasher = getattr(hashlib, self.algorithm)()
            hasher.update(test_data)
            sw_result = hasher.hexdigest()
            sw_time = time.time() - start_time
            
            return {
                'hardware_time': hw_time,
                'software_time': sw_time,
                'speedup': sw_time / hw_time if hw_time > 0 else 1,
                'results_match': hw_result == sw_result
            }

except ImportError:
    print("Cryptography library não disponível para aceleração hardware")
```

## Casos de Uso Específicos

### **Blockchain e Criptomoedas**
- Proof of Work (Bitcoin usa SHA-256)
- Merkle Trees para verificação de transações
- Address generation

### **Verificação de Integridade**
- Checksums de arquivos
- Verificação de downloads
- Sistemas de backup

### **Autenticação e Senhas**
- Password hashing (com salt)
- Token generation
- Session management

### **Sistemas Distribuídos**
- Content addressing
- Consistent hashing
- Data deduplication

### **Forense Digital**
- Chain of custody
- Evidence integrity
- Timeline verification

## Recomendações de Segurança

### Escolha do Algoritmo
- **Use SHA-256 ou superior** para novas aplicações
- **Evite SHA-1** (depreciado)
- **Considere SHA-3** para máxima segurança
- **Use PBKDF2, bcrypt ou Argon2** para senhas

### Implementação Segura
- **Use bibliotecas testadas** (não implemente do zero)
- **Adicione salt** para password hashing
- **Use iterações adequadas** (PBKDF2)
- **Monitore vulnerabilidades** conhecidas
- **Teste resistência** a ataques conhecidos

### Considerações de Performance
- **Balance segurança vs performance**
- **Use aceleração hardware** quando disponível
- **Considere paralelização** para grandes volumes
- **Monitore uso de recursos**
- **Implemente cache** quando apropriado

Os algoritmos SHA são fundamentais para a segurança moderna, mas devem ser usados corretamente e com conhecimento de suas limitações e vulnerabilidades.
