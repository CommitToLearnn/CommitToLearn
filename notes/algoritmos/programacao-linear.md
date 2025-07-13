# Programação Linear

## O que é Programação Linear?

Programação Linear (PL) é uma técnica de otimização matemática para encontrar a melhor solução (máximo ou mínimo) de uma função linear sujeita a restrições lineares. É amplamente utilizada em economia, engenharia, logística e ciência da computação para resolver problemas de alocação de recursos.

## Componentes de um Problema de PL

### Estrutura Geral
```
Maximizar (ou Minimizar): c₁x₁ + c₂x₂ + ... + cₙxₙ    (Função Objetivo)

Sujeito a:
a₁₁x₁ + a₁₂x₂ + ... + a₁ₙxₙ ≤ b₁    (Restrição 1)
a₂₁x₁ + a₂₂x₂ + ... + a₂ₙxₙ ≤ b₂    (Restrição 2)
...
aₘ₁x₁ + aₘ₂x₂ + ... + aₘₙxₙ ≤ bₘ    (Restrição m)

x₁, x₂, ..., xₙ ≥ 0                    (Restrições de Não-negatividade)
```

### Componentes
- **Variáveis de Decisão**: x₁, x₂, ..., xₙ
- **Função Objetivo**: Função a ser otimizada
- **Restrições**: Limitações do problema
- **Coeficientes**: Parâmetros conhecidos do problema

## Exemplo Clássico: Problema da Dieta

```python
import numpy as np
from scipy.optimize import linprog
import matplotlib.pyplot as plt

class LinearProgrammingProblem:
    def __init__(self):
        self.c = None           # Coeficientes da função objetivo
        self.A_ub = None        # Matriz de coeficientes das restrições de desigualdade
        self.b_ub = None        # Lado direito das restrições de desigualdade
        self.A_eq = None        # Matriz de coeficientes das restrições de igualdade
        self.b_eq = None        # Lado direito das restrições de igualdade
        self.bounds = None      # Limites das variáveis
        self.result = None      # Resultado da otimização
    
    def solve_diet_problem(self):
        """
        Problema da Dieta: Encontrar a combinação mais barata de alimentos
        que satisfaça requisitos nutricionais mínimos.
        
        Alimentos disponíveis:
        - Pão: R$ 2/unidade, 4 calorias, 1g proteína, 2mg ferro
        - Leite: R$ 3/unidade, 3 calorias, 2g proteína, 1mg ferro
        - Carne: R$ 8/unidade, 10 calorias, 8g proteína, 2mg ferro
        
        Requisitos mínimos:
        - 10 calorias
        - 5g proteína
        - 4mg ferro
        """
        
        print("PROBLEMA DA DIETA")
        print("=" * 40)
        print("Objetivo: Minimizar custo da dieta")
        print("Variáveis: x1=Pão, x2=Leite, x3=Carne")
        print()
        
        # Função objetivo: minimizar custo (2*x1 + 3*x2 + 8*x3)
        # Note: scipy.linprog minimiza por padrão
        self.c = [2, 3, 8]
        
        # Restrições de desigualdade (formato Ax <= b)
        # Precisamos converter '>=' para '<=' multiplicando por -1
        
        # Restrições nutricionais (mínimos):
        # 4*x1 + 3*x2 + 10*x3 >= 10  (calorias)  → -4*x1 - 3*x2 - 10*x3 <= -10
        # 1*x1 + 2*x2 + 8*x3 >= 5   (proteína)  → -1*x1 - 2*x2 - 8*x3 <= -5
        # 2*x1 + 1*x2 + 2*x3 >= 4   (ferro)     → -2*x1 - 1*x2 - 2*x3 <= -4
        
        self.A_ub = [
            [-4, -3, -10],  # Calorias
            [-1, -2, -8],   # Proteína
            [-2, -1, -2]    # Ferro
        ]
        
        self.b_ub = [-10, -5, -4]
        
        # Limites das variáveis (não-negatividade)
        self.bounds = [(0, None), (0, None), (0, None)]
        
        # Resolver o problema
        self.result = linprog(
            c=self.c,
            A_ub=self.A_ub,
            b_ub=self.b_ub,
            bounds=self.bounds,
            method='highs'
        )
        
        # Mostrar resultados
        self._print_solution("Problema da Dieta")
        
        return self.result
    
    def solve_production_problem(self):
        """
        Problema de Produção: Maximizar lucro na produção de produtos
        
        Produtos:
        - Produto A: lucro R$ 3/unidade, usa 2h máquina, 1h trabalho
        - Produto B: lucro R$ 5/unidade, usa 1h máquina, 3h trabalho
        
        Recursos disponíveis:
        - 40 horas de máquina
        - 30 horas de trabalho
        """
        
        print("\nPROBLEMA DE PRODUÇÃO")
        print("=" * 40)
        print("Objetivo: Maximizar lucro")
        print("Variáveis: x1=Produto A, x2=Produto B")
        print()
        
        # Função objetivo: maximizar 3*x1 + 5*x2
        # Para maximizar, multiplicamos por -1 (scipy minimiza)
        self.c = [-3, -5]
        
        # Restrições de recursos (<=):
        # 2*x1 + 1*x2 <= 40  (horas de máquina)
        # 1*x1 + 3*x2 <= 30  (horas de trabalho)
        
        self.A_ub = [
            [2, 1],   # Máquina
            [1, 3]    # Trabalho
        ]
        
        self.b_ub = [40, 30]
        
        # Limites das variáveis
        self.bounds = [(0, None), (0, None)]
        
        # Resolver
        self.result = linprog(
            c=self.c,
            A_ub=self.A_ub,
            b_ub=self.b_ub,
            bounds=self.bounds,
            method='highs'
        )
        
        # Mostrar resultados (ajustar sinal do objetivo)
        if self.result.success:
            print(f"Status: Solução ótima encontrada")
            print(f"Produto A: {self.result.x[0]:.2f} unidades")
            print(f"Produto B: {self.result.x[1]:.2f} unidades")
            print(f"Lucro máximo: R$ {-self.result.fun:.2f}")
            
            # Verificar folgas (slack)
            slack_machine = 40 - (2*self.result.x[0] + 1*self.result.x[1])
            slack_labor = 30 - (1*self.result.x[0] + 3*self.result.x[1])
            print(f"Folga máquina: {slack_machine:.2f} horas")
            print(f"Folga trabalho: {slack_labor:.2f} horas")
        
        return self.result
    
    def solve_transportation_problem(self):
        """
        Problema de Transporte: Minimizar custo de transporte
        
        Origens (fábricas) com capacidades:
        - Fábrica 1: 20 unidades
        - Fábrica 2: 30 unidades
        
        Destinos (depósitos) com demandas:
        - Depósito A: 15 unidades
        - Depósito B: 25 unidades
        - Depósito C: 10 unidades
        
        Custos de transporte por unidade:
        - F1→A: R$ 4, F1→B: R$ 2, F1→C: R$ 3
        - F2→A: R$ 1, F2→B: R$ 5, F2→C: R$ 4
        """
        
        print("\nPROBLEMA DE TRANSPORTE")
        print("=" * 40)
        print("Objetivo: Minimizar custo de transporte")
        print("Variáveis: x_ij = quantidade de i para j")
        print()
        
        # Variáveis: x11, x12, x13, x21, x22, x23
        # (de fábrica i para depósito j)
        
        # Função objetivo: minimizar custo total
        self.c = [4, 2, 3, 1, 5, 4]
        
        # Restrições de capacidade das fábricas:
        # x11 + x12 + x13 <= 20  (Fábrica 1)
        # x21 + x22 + x23 <= 30  (Fábrica 2)
        
        # Restrições de demanda dos depósitos (igualdade):
        # x11 + x21 = 15  (Depósito A)
        # x12 + x22 = 25  (Depósito B)
        # x13 + x23 = 10  (Depósito C)
        
        self.A_ub = [
            [1, 1, 1, 0, 0, 0],  # Capacidade Fábrica 1
            [0, 0, 0, 1, 1, 1]   # Capacidade Fábrica 2
        ]
        
        self.b_ub = [20, 30]
        
        self.A_eq = [
            [1, 0, 0, 1, 0, 0],  # Demanda Depósito A
            [0, 1, 0, 0, 1, 0],  # Demanda Depósito B
            [0, 0, 1, 0, 0, 1]   # Demanda Depósito C
        ]
        
        self.b_eq = [15, 25, 10]
        
        # Limites das variáveis
        self.bounds = [(0, None)] * 6
        
        # Resolver
        self.result = linprog(
            c=self.c,
            A_ub=self.A_ub,
            b_ub=self.b_ub,
            A_eq=self.A_eq,
            b_eq=self.b_eq,
            bounds=self.bounds,
            method='highs'
        )
        
        # Mostrar resultados
        if self.result.success:
            print(f"Status: Solução ótima encontrada")
            print(f"Custo mínimo: R$ {self.result.fun:.2f}")
            print()
            print("Plano de transporte:")
            routes = [
                ("F1→A", 0), ("F1→B", 1), ("F1→C", 2),
                ("F2→A", 3), ("F2→B", 4), ("F2→C", 5)
            ]
            
            for route_name, idx in routes:
                if self.result.x[idx] > 0.01:  # Apenas rotas usadas
                    print(f"{route_name}: {self.result.x[idx]:.2f} unidades")
        
        return self.result
    
    def _print_solution(self, problem_name):
        """Imprime solução de forma formatada"""
        print(f"\nSOLUÇÃO - {problem_name}")
        print("-" * 30)
        
        if self.result.success:
            print(f"Status: {self.result.message}")
            print(f"Valor ótimo: {self.result.fun:.2f}")
            print("Variáveis:")
            for i, value in enumerate(self.result.x):
                print(f"  x{i+1} = {value:.4f}")
        else:
            print(f"Status: {self.result.message}")
            print("Problema não possui solução viável")

# Exemplo de uso dos problemas clássicos
def demo_linear_programming():
    """Demonstração dos problemas clássicos de PL"""
    
    lp = LinearProgrammingProblem()
    
    # Resolver problemas
    lp.solve_diet_problem()
    lp.solve_production_problem()
    lp.solve_transportation_problem()

if __name__ == "__main__":
    demo_linear_programming()
```

## Algoritmo Simplex

### Implementação Básica do Simplex

```python
import numpy as np
from fractions import Fraction

class SimplexSolver:
    def __init__(self):
        self.tableau = None
        self.basic_vars = []
        self.num_vars = 0
        self.num_constraints = 0
        self.iterations = 0
        self.history = []
    
    def solve(self, c, A, b, maximize=True):
        """
        Resolve problema de PL usando método Simplex
        
        Args:
            c: coeficientes da função objetivo
            A: matriz de coeficientes das restrições
            b: lado direito das restrições
            maximize: True para maximizar, False para minimizar
        """
        
        if not maximize:
            c = [-x for x in c]
        
        self.num_vars = len(c)
        self.num_constraints = len(b)
        
        # Verificar se todas as restrições são <=
        if any(bi < 0 for bi in b):
            raise ValueError("Todas as restrições devem ter lado direito não-negativo")
        
        # Construir tableau inicial
        self._build_initial_tableau(c, A, b)
        
        print("MÉTODO SIMPLEX")
        print("=" * 50)
        self._print_tableau("Tableau Inicial")
        
        # Iterações do Simplex
        while not self._is_optimal():
            self.iterations += 1
            
            # Escolher variável que entra
            entering_var = self._choose_entering_variable()
            print(f"\nIteração {self.iterations}")
            print(f"Variável que entra: x{entering_var + 1}")
            
            # Escolher variável que sai
            leaving_var = self._choose_leaving_variable(entering_var)
            if leaving_var == -1:
                print("Problema ilimitado!")
                return None
            
            print(f"Variável que sai: {self._get_var_name(leaving_var)}")
            
            # Pivotamento
            self._pivot(leaving_var, entering_var)
            self.basic_vars[leaving_var] = entering_var
            
            self._print_tableau(f"Após Iteração {self.iterations}")
            
            # Salvar histórico
            self.history.append({
                'iteration': self.iterations,
                'tableau': self.tableau.copy(),
                'basic_vars': self.basic_vars.copy(),
                'objective_value': self._get_objective_value()
            })
        
        # Solução ótima encontrada
        solution = self._extract_solution()
        objective_value = self._get_objective_value()
        
        if not maximize:
            objective_value = -objective_value
        
        print(f"\nSOLUÇÃO ÓTIMA ENCONTRADA!")
        print(f"Valor ótimo: {objective_value}")
        print("Variáveis:")
        for i, val in enumerate(solution):
            print(f"  x{i+1} = {val}")
        
        return {
            'success': True,
            'x': solution,
            'fun': objective_value,
            'iterations': self.iterations,
            'tableau_history': self.history
        }
    
    def _build_initial_tableau(self, c, A, b):
        """Constrói tableau inicial do Simplex"""
        # Adicionar variáveis de folga
        rows = len(A)
        cols = len(c) + rows + 1  # vars originais + folgas + RHS
        
        self.tableau = np.zeros((rows + 1, cols))
        
        # Linha da função objetivo
        for i, coef in enumerate(c):
            self.tableau[0, i] = -coef  # Negativos para maximização
        
        # Linhas das restrições
        for i in range(rows):
            # Coeficientes das variáveis originais
            for j in range(len(c)):
                self.tableau[i + 1, j] = A[i][j]
            
            # Variável de folga
            self.tableau[i + 1, len(c) + i] = 1
            
            # Lado direito
            self.tableau[i + 1, -1] = b[i]
        
        # Variáveis básicas iniciais (folgas)
        self.basic_vars = list(range(len(c), len(c) + rows))
    
    def _is_optimal(self):
        """Verifica se solução atual é ótima"""
        # Ótimo se todos os coeficientes da função objetivo são >= 0
        return all(self.tableau[0, j] >= 0 for j in range(self.tableau.shape[1] - 1))
    
    def _choose_entering_variable(self):
        """Escolhe variável que entra na base (regra do maior coeficiente negativo)"""
        min_val = 0
        entering_var = -1
        
        for j in range(self.tableau.shape[1] - 1):
            if self.tableau[0, j] < min_val:
                min_val = self.tableau[0, j]
                entering_var = j
        
        return entering_var
    
    def _choose_leaving_variable(self, entering_var):
        """Escolhe variável que sai da base (teste da razão mínima)"""
        min_ratio = float('inf')
        leaving_var = -1
        
        for i in range(1, self.tableau.shape[0]):
            if self.tableau[i, entering_var] > 0:  # Denominador positivo
                ratio = self.tableau[i, -1] / self.tableau[i, entering_var]
                if ratio < min_ratio:
                    min_ratio = ratio
                    leaving_var = i - 1  # Ajustar índice para basic_vars
        
        return leaving_var
    
    def _pivot(self, leaving_row, entering_col):
        """Realiza operação de pivotamento"""
        pivot_row = leaving_row + 1  # Ajustar para índice do tableau
        pivot_element = self.tableau[pivot_row, entering_col]
        
        # Normalizar linha do pivô
        self.tableau[pivot_row] /= pivot_element
        
        # Eliminar coluna do pivô nas outras linhas
        for i in range(self.tableau.shape[0]):
            if i != pivot_row and self.tableau[i, entering_col] != 0:
                factor = self.tableau[i, entering_col]
                self.tableau[i] -= factor * self.tableau[pivot_row]
    
    def _extract_solution(self):
        """Extrai solução das variáveis básicas"""
        solution = [0] * self.num_vars
        
        for i, var_idx in enumerate(self.basic_vars):
            if var_idx < self.num_vars:  # Apenas variáveis originais
                solution[var_idx] = self.tableau[i + 1, -1]
        
        return solution
    
    def _get_objective_value(self):
        """Obtém valor atual da função objetivo"""
        return self.tableau[0, -1]
    
    def _get_var_name(self, basic_var_idx):
        """Obtém nome da variável básica"""
        var_idx = self.basic_vars[basic_var_idx]
        if var_idx < self.num_vars:
            return f"x{var_idx + 1}"
        else:
            return f"s{var_idx - self.num_vars + 1}"
    
    def _print_tableau(self, title="Tableau"):
        """Imprime tableau formatado"""
        print(f"\n{title}:")
        print("-" * 40)
        
        # Cabeçalho
        header = "Base\t"
        for i in range(self.num_vars):
            header += f"x{i+1}\t"
        for i in range(self.num_constraints):
            header += f"s{i+1}\t"
        header += "RHS"
        print(header)
        
        # Linha da função objetivo
        obj_line = "z\t"
        for j in range(self.tableau.shape[1]):
            obj_line += f"{self.tableau[0, j]:.2f}\t"
        print(obj_line)
        
        # Linhas das restrições
        for i in range(1, self.tableau.shape[0]):
            var_name = self._get_var_name(i - 1)
            line = f"{var_name}\t"
            for j in range(self.tableau.shape[1]):
                line += f"{self.tableau[i, j]:.2f}\t"
            print(line)

# Exemplo de uso do Simplex
def demo_simplex():
    """Demonstração do algoritmo Simplex"""
    
    simplex = SimplexSolver()
    
    print("EXEMPLO: Problema de Produção")
    print("Maximizar: 3x1 + 5x2")
    print("Sujeito a:")
    print("  2x1 + x2 <= 40")
    print("  x1 + 3x2 <= 30")
    print("  x1, x2 >= 0")
    
    # Coeficientes da função objetivo
    c = [3, 5]
    
    # Matriz de coeficientes das restrições
    A = [
        [2, 1],
        [1, 3]
    ]
    
    # Lado direito das restrições
    b = [40, 30]
    
    # Resolver
    result = simplex.solve(c, A, b, maximize=True)
    
    return result

if __name__ == "__main__":
    demo_simplex()
```

## Método das Duas Fases

### Implementação do Método das Duas Fases

```python
class TwoPhaseSimplex:
    def __init__(self):
        self.simplex = SimplexSolver()
    
    def solve(self, c, A, b, equality_constraints=None, maximize=True):
        """
        Resolve PL usando método das duas fases
        Útil quando problema não tem solução básica viável óbvia
        
        Args:
            equality_constraints: lista de índices das restrições de igualdade
        """
        
        print("MÉTODO DAS DUAS FASES")
        print("=" * 50)
        
        # FASE 1: Encontrar solução básica viável
        print("\nFASE 1: Encontrando solução básica viável")
        print("-" * 40)
        
        phase1_result = self._phase1(A, b, equality_constraints)
        
        if not phase1_result['feasible']:
            print("Problema inviável!")
            return {'success': False, 'message': 'Inviável'}
        
        print("Solução básica viável encontrada!")
        
        # FASE 2: Otimizar função objetivo original
        print("\nFASE 2: Otimizando função objetivo original")
        print("-" * 40)
        
        phase2_result = self._phase2(c, phase1_result, maximize)
        
        return phase2_result
    
    def _phase1(self, A, b, equality_constraints=None):
        """
        Fase 1: Minimizar soma das variáveis artificiais
        """
        if equality_constraints is None:
            equality_constraints = []
        
        rows = len(A)
        cols = len(A[0])
        
        # Criar problema auxiliar
        # Adicionar variáveis artificiais para restrições de igualdade
        # e restrições com b < 0
        
        artificial_vars = []
        modified_A = []
        modified_b = []
        
        for i in range(rows):
            row = list(A[i])
            
            if i in equality_constraints or b[i] < 0:
                # Adicionar variável artificial
                artificial_col = [0] * rows
                artificial_col[i] = 1
                artificial_vars.append(cols + len(artificial_vars))
                
                # Adicionar coluna da variável artificial
                row.extend([0] * len(artificial_vars))
                row[-1] = 1
            
            modified_A.append(row)
            modified_b.append(abs(b[i]))
        
        # Função objetivo da Fase 1: minimizar soma das artificiais
        phase1_c = [0] * cols + [1] * len(artificial_vars)
        
        # Resolver problema da Fase 1
        result = self.simplex.solve(phase1_c, modified_A, modified_b, maximize=False)
        
        # Verificar se solução é viável
        if result and result['fun'] < 1e-10:  # Aproximadamente zero
            return {
                'feasible': True,
                'basic_vars': result.get('basic_vars', []),
                'tableau': result.get('tableau_history', [])[-1]['tableau'] if result.get('tableau_history') else None
            }
        else:
            return {'feasible': False}
    
    def _phase2(self, c, phase1_result, maximize):
        """
        Fase 2: Otimizar função objetivo original
        """
        # Implementação simplificada
        # Na prática, seria necessário remover variáveis artificiais
        # e continuar com o tableau da Fase 1
        
        print("Continuando otimização com função objetivo original...")
        
        # Por simplicidade, resolver novamente com simplex normal
        # (assumindo problema já é viável)
        
        return {'success': True, 'message': 'Fase 2 não implementada completamente'}

# Exemplo com restrições de igualdade
def demo_two_phase():
    """Demonstração do método das duas fases"""
    
    two_phase = TwoPhaseSimplex()
    
    print("EXEMPLO: Problema com restrições de igualdade")
    print("Maximizar: x1 + 2x2")
    print("Sujeito a:")
    print("  x1 + x2 = 3")
    print("  2x1 + x2 <= 4")
    print("  x1, x2 >= 0")
    
    c = [1, 2]
    A = [
        [1, 1],
        [2, 1]
    ]
    b = [3, 4]
    equality_constraints = [0]  # Primeira restrição é igualdade
    
    result = two_phase.solve(c, A, b, equality_constraints, maximize=True)
    
    return result

if __name__ == "__main__":
    demo_two_phase()
```

## Dualidade

### Teoria da Dualidade

```python
class DualityAnalysis:
    def __init__(self):
        pass
    
    def create_dual_problem(self, c, A, b, maximize=True):
        """
        Cria problema dual
        
        Primal (Max):           Dual (Min):
        Max c^T x               Min b^T y
        s.t. Ax <= b           s.t. A^T y >= c
             x >= 0                 y >= 0
        """
        
        print("ANÁLISE DE DUALIDADE")
        print("=" * 40)
        
        if maximize:
            print("Problema Primal (Maximização):")
            print(f"Maximizar: {' + '.join(f'{c[i]}x{i+1}' for i in range(len(c)))}")
            print("Sujeito a:")
            for i in range(len(A)):
                constraint = ' + '.join(f'{A[i][j]}x{j+1}' for j in range(len(A[i])))
                print(f"  {constraint} <= {b[i]}")
            print("  x_i >= 0")
            
            print("\nProblema Dual (Minimização):")
            dual_c = b
            dual_A = [[A[j][i] for j in range(len(A))] for i in range(len(A[0]))]
            dual_b = c
            
            print(f"Minimizar: {' + '.join(f'{dual_c[i]}y{i+1}' for i in range(len(dual_c)))}")
            print("Sujeito a:")
            for i in range(len(dual_A)):
                constraint = ' + '.join(f'{dual_A[i][j]}y{j+1}' for j in range(len(dual_A[i])))
                print(f"  {constraint} >= {dual_b[i]}")
            print("  y_i >= 0")
            
            return {
                'dual_c': dual_c,
                'dual_A': dual_A,
                'dual_b': dual_b
            }
    
    def verify_strong_duality(self, primal_solution, dual_solution, 
                            primal_objective, dual_objective, tolerance=1e-6):
        """
        Verifica teorema da dualidade forte
        """
        print(f"\nVERIFICAÇÃO DA DUALIDADE FORTE")
        print("-" * 30)
        print(f"Valor ótimo primal: {primal_objective:.6f}")
        print(f"Valor ótimo dual: {dual_objective:.6f}")
        print(f"Diferença: {abs(primal_objective - dual_objective):.6f}")
        
        if abs(primal_objective - dual_objective) < tolerance:
            print("✓ Dualidade forte verificada!")
            return True
        else:
            print("✗ Dualidade forte não verificada")
            return False
    
    def complementary_slackness_analysis(self, primal_x, dual_y, A, b, c):
        """
        Análise de folgas complementares
        
        Condições:
        - Se x_j > 0, então restrição dual j deve ser ativa
        - Se y_i > 0, então restrição primal i deve ser ativa
        """
        print(f"\nANÁLISE DE FOLGAS COMPLEMENTARES")
        print("-" * 35)
        
        tolerance = 1e-6
        
        # Verificar condição 1
        print("Condição 1 (x_j > 0 → restrição dual ativa):")
        for j in range(len(primal_x)):
            if primal_x[j] > tolerance:
                # Calcular valor da restrição dual
                dual_constraint_value = sum(A[i][j] * dual_y[i] for i in range(len(dual_y)))
                slack = dual_constraint_value - c[j]
                print(f"  x{j+1} = {primal_x[j]:.4f}, folga dual = {slack:.6f}")
        
        # Verificar condição 2
        print("\nCondição 2 (y_i > 0 → restrição primal ativa):")
        for i in range(len(dual_y)):
            if dual_y[i] > tolerance:
                # Calcular valor da restrição primal
                primal_constraint_value = sum(A[i][j] * primal_x[j] for j in range(len(primal_x)))
                slack = b[i] - primal_constraint_value
                print(f"  y{i+1} = {dual_y[i]:.4f}, folga primal = {slack:.6f}")
```

## Análise de Sensibilidade

### Análise de Sensibilidade Completa

```python
class SensitivityAnalysis:
    def __init__(self, c, A, b, solution):
        """
        Análise de sensibilidade para problemas de PL
        
        Args:
            c: coeficientes da função objetivo
            A: matriz de coeficientes das restrições
            b: lado direito das restrições
            solution: solução ótima do problema
        """
        self.c = np.array(c)
        self.A = np.array(A)
        self.b = np.array(b)
        self.solution = solution
        self.basic_vars = self._identify_basic_vars()
    
    def _identify_basic_vars(self):
        """Identifica variáveis básicas na solução ótima"""
        basic_vars = []
        tolerance = 1e-6
        
        for i, val in enumerate(self.solution['x']):
            if val > tolerance:
                basic_vars.append(i)
        
        return basic_vars
    
    def analyze_objective_coefficients(self):
        """
        Análise de sensibilidade dos coeficientes da função objetivo
        """
        print("ANÁLISE DE SENSIBILIDADE - COEFICIENTES OBJETIVO")
        print("=" * 55)
        
        # Para cada coeficiente, calcular range de validade
        for j in range(len(self.c)):
            print(f"\nCoeficiente c{j+1} (atual: {self.c[j]}):")
            
            if j in self.basic_vars:
                # Variável básica - análise mais complexa
                print("  Variável básica - requer análise da base")
            else:
                # Variável não-básica - análise do custo reduzido
                print("  Variável não-básica")
                
                # Calcular custo reduzido atual
                # (simplificado - seria necessário tableau ótimo)
                print("  Range: requer tableau ótimo para cálculo preciso")
    
    def analyze_rhs_changes(self):
        """
        Análise de sensibilidade do lado direito (RHS)
        """
        print("\nANÁLISE DE SENSIBILIDADE - LADO DIREITO")
        print("=" * 45)
        
        for i in range(len(self.b)):
            print(f"\nRestrição {i+1} (RHS atual: {self.b[i]}):")
            
            # Calcular folga da restrição
            constraint_value = sum(self.A[i][j] * self.solution['x'][j] 
                                 for j in range(len(self.solution['x'])))
            slack = self.b[i] - constraint_value
            
            if abs(slack) < 1e-6:
                print(f"  Restrição ATIVA (folga ≈ 0)")
                print(f"  Mudanças no RHS afetam diretamente a solução")
            else:
                print(f"  Restrição INATIVA (folga = {slack:.4f})")
                print(f"  RHS pode diminuir até {slack:.4f} sem afetar solução")
    
    def what_if_analysis(self, parameter_changes):
        """
        Análise "what-if" para mudanças nos parâmetros
        
        Args:
            parameter_changes: dict com mudanças propostas
                              {'c': [mudanças nos c_i], 'b': [mudanças nos b_i]}
        """
        print(f"\nANÁLISE 'WHAT-IF'")
        print("-" * 20)
        
        if 'c' in parameter_changes:
            new_c = self.c + np.array(parameter_changes['c'])
            print(f"Novos coeficientes objetivo: {new_c}")
            
            # Estimar novo valor objetivo (aproximação)
            new_objective = sum(new_c[i] * self.solution['x'][i] 
                              for i in range(len(new_c)))
            change = new_objective - self.solution['fun']
            
            print(f"Mudança estimada no objetivo: {change:.4f}")
            print(f"Novo valor objetivo estimado: {new_objective:.4f}")
        
        if 'b' in parameter_changes:
            new_b = self.b + np.array(parameter_changes['b'])
            print(f"Novos RHS: {new_b}")
            
            # Verificar se mudanças violam restrições
            print("Verificação de viabilidade:")
            for i in range(len(new_b)):
                constraint_value = sum(self.A[i][j] * self.solution['x'][j] 
                                     for j in range(len(self.solution['x'])))
                if constraint_value > new_b[i] + 1e-6:
                    print(f"  ⚠ Restrição {i+1} violada!")
                else:
                    print(f"  ✓ Restrição {i+1} satisfeita")
    
    def resource_shadow_prices(self):
        """
        Calcula preços sombra dos recursos (valores duais)
        """
        print(f"\nPREÇOS SOMBRA DOS RECURSOS")
        print("-" * 30)
        
        # Para cada restrição, estimar preço sombra
        for i in range(len(self.b)):
            constraint_value = sum(self.A[i][j] * self.solution['x'][j] 
                                 for j in range(len(self.solution['x'])))
            slack = self.b[i] - constraint_value
            
            if abs(slack) < 1e-6:  # Restrição ativa
                print(f"Recurso {i+1}: ESCASSO (preço sombra > 0)")
                print(f"  Aumento de 1 unidade pode melhorar objetivo")
            else:
                print(f"Recurso {i+1}: ABUNDANTE (preço sombra = 0)")
                print(f"  Aumento não melhora objetivo (folga = {slack:.4f})")

# Exemplo de análise de sensibilidade
def demo_sensitivity_analysis():
    """Demonstração de análise de sensibilidade"""
    
    # Resolver problema primeiro
    from scipy.optimize import linprog
    
    c = [-3, -5]  # Maximizar 3x1 + 5x2
    A = [[2, 1], [1, 3]]
    b = [40, 30]
    bounds = [(0, None), (0, None)]
    
    result = linprog(c, A_ub=A, b_ub=b, bounds=bounds, method='highs')
    result.fun = -result.fun  # Converter back to maximization
    
    # Análise de sensibilidade
    sensitivity = SensitivityAnalysis([-c[0], -c[1]], A, b, result)
    
    sensitivity.analyze_objective_coefficients()
    sensitivity.analyze_rhs_changes()
    
    # Análise what-if
    changes = {
        'c': [1, -1],  # Aumentar c1 em 1, diminuir c2 em 1
        'b': [5, -5]   # Aumentar b1 em 5, diminuir b2 em 5
    }
    
    sensitivity.what_if_analysis(changes)
    sensitivity.resource_shadow_prices()

if __name__ == "__main__":
    demo_sensitivity_analysis()
```

## Aplicações Avançadas

### 1. Problema de Alocação de Portfolio

```python
class PortfolioOptimization:
    def __init__(self):
        pass
    
    def optimize_portfolio(self, expected_returns, budget=1.0, 
                          min_allocation=0.0, max_allocation=1.0,
                          risk_constraints=None):
        """
        Otimização de portfolio usando PL
        
        Args:
            expected_returns: retornos esperados dos ativos
            budget: orçamento total (default 1.0 = 100%)
            min_allocation: alocação mínima por ativo
            max_allocation: alocação máxima por ativo
            risk_constraints: restrições de risco (opcional)
        """
        
        n_assets = len(expected_returns)
        
        print("OTIMIZAÇÃO DE PORTFOLIO")
        print("=" * 30)
        print(f"Ativos: {n_assets}")
        print(f"Retornos esperados: {expected_returns}")
        print(f"Orçamento: {budget}")
        
        # Função objetivo: maximizar retorno esperado
        c = [-r for r in expected_returns]  # Negativos para maximização
        
        # Restrições
        A_ub = []
        b_ub = []
        
        # Restrição de orçamento (igualdade): sum(xi) = budget
        A_eq = [[1] * n_assets]
        b_eq = [budget]
        
        # Restrições de alocação máxima: xi <= max_allocation
        for i in range(n_assets):
            constraint = [0] * n_assets
            constraint[i] = 1
            A_ub.append(constraint)
            b_ub.append(max_allocation)
        
        # Limites (alocação mínima)
        bounds = [(min_allocation, max_allocation) for _ in range(n_assets)]
        
        # Resolver
        result = linprog(
            c=c,
            A_ub=A_ub,
            b_ub=b_ub,
            A_eq=A_eq,
            b_eq=b_eq,
            bounds=bounds,
            method='highs'
        )
        
        if result.success:
            portfolio = result.x
            expected_return = -result.fun
            
            print(f"\nSOLUÇÃO ÓTIMA:")
            print(f"Retorno esperado: {expected_return:.4f}")
            print("Alocações:")
            for i, allocation in enumerate(portfolio):
                print(f"  Ativo {i+1}: {allocation:.4f} ({allocation*100:.2f}%)")
            
            return {
                'success': True,
                'portfolio': portfolio,
                'expected_return': expected_return,
                'diversification': self._calculate_diversification(portfolio)
            }
        else:
            print("Erro na otimização!")
            return {'success': False}
    
    def _calculate_diversification(self, portfolio):
        """Calcula índice de diversificação"""
        # Índice Herfindahl-Hirschman (HHI)
        hhi = sum(w**2 for w in portfolio)
        diversification_index = 1 / hhi if hhi > 0 else 1
        
        return {
            'hhi': hhi,
            'effective_assets': diversification_index,
            'concentration': max(portfolio) if portfolio else 0
        }

# Exemplo de otimização de portfolio
def demo_portfolio_optimization():
    """Demonstração de otimização de portfolio"""
    
    optimizer = PortfolioOptimization()
    
    # Retornos esperados de 5 ativos
    expected_returns = [0.08, 0.12, 0.15, 0.10, 0.06]
    
    # Otimizar portfolio
    result = optimizer.optimize_portfolio(
        expected_returns=expected_returns,
        budget=1.0,
        min_allocation=0.05,  # Mínimo 5% por ativo
        max_allocation=0.4    # Máximo 40% por ativo
    )
    
    if result['success']:
        div_stats = result['diversification']
        print(f"\nESTATÍSTICAS DE DIVERSIFICAÇÃO:")
        print(f"HHI: {div_stats['hhi']:.4f}")
        print(f"Ativos efetivos: {div_stats['effective_assets']:.2f}")
        print(f"Concentração máxima: {div_stats['concentration']:.4f}")

if __name__ == "__main__":
    demo_portfolio_optimization()
```

### 2. Problema de Planejamento de Produção Multi-Período

```python
class ProductionPlanning:
    def __init__(self):
        pass
    
    def multi_period_planning(self, demands, production_costs, 
                            inventory_costs, capacities, 
                            initial_inventory=0, final_inventory=0):
        """
        Planejamento de produção multi-período
        
        Args:
            demands: demanda por período
            production_costs: custo de produção por período
            inventory_costs: custo de estoque por período
            capacities: capacidade de produção por período
            initial_inventory: estoque inicial
            final_inventory: estoque final desejado
        """
        
        T = len(demands)  # Número de períodos
        
        print("PLANEJAMENTO DE PRODUÇÃO MULTI-PERÍODO")
        print("=" * 45)
        print(f"Períodos: {T}")
        print(f"Demandas: {demands}")
        print(f"Capacidades: {capacities}")
        print(f"Custos produção: {production_costs}")
        print(f"Custos estoque: {inventory_costs}")
        
        # Variáveis:
        # x_t: produção no período t
        # s_t: estoque no final do período t
        
        # Função objetivo: minimizar custo total
        c = production_costs + inventory_costs
        
        # Restrições
        A_eq = []
        b_eq = []
        A_ub = []
        b_ub = []
        
        # Restrições de balanço de estoque
        for t in range(T):
            # s_{t-1} + x_t - s_t = d_t
            constraint = [0] * (2 * T)
            
            # Coeficiente de x_t
            constraint[t] = 1
            
            # Coeficiente de s_{t-1}
            if t > 0:
                constraint[T + t - 1] = 1
            
            # Coeficiente de s_t
            constraint[T + t] = -1
            
            A_eq.append(constraint)
            
            # RHS
            if t == 0:
                b_eq.append(demands[t] - initial_inventory)
            else:
                b_eq.append(demands[t])
        
        # Restrições de capacidade: x_t <= capacity_t
        for t in range(T):
            constraint = [0] * (2 * T)
            constraint[t] = 1
            A_ub.append(constraint)
            b_ub.append(capacities[t])
        
        # Restrição de estoque final
        if final_inventory > 0:
            constraint = [0] * (2 * T)
            constraint[T + T - 1] = 1  # s_T
            A_eq.append(constraint)
            b_eq.append(final_inventory)
        
        # Limites das variáveis (não-negatividade)
        bounds = [(0, None)] * (2 * T)
        
        # Resolver
        result = linprog(
            c=c,
            A_eq=A_eq,
            b_eq=b_eq,
            A_ub=A_ub,
            b_ub=b_ub,
            bounds=bounds,
            method='highs'
        )
        
        if result.success:
            production = result.x[:T]
            inventory = result.x[T:]
            total_cost = result.fun
            
            print(f"\nSOLUÇÃO ÓTIMA:")
            print(f"Custo total: {total_cost:.2f}")
            print("\nPlano de produção:")
            for t in range(T):
                print(f"  Período {t+1}: Produzir {production[t]:.2f}, Estoque {inventory[t]:.2f}")
            
            # Análise do plano
            self._analyze_production_plan(production, inventory, demands, capacities)
            
            return {
                'success': True,
                'production': production,
                'inventory': inventory,
                'total_cost': total_cost
            }
        else:
            print("Problema inviável ou ilimitado!")
            return {'success': False}
    
    def _analyze_production_plan(self, production, inventory, demands, capacities):
        """Analisa plano de produção"""
        print(f"\nANÁLISE DO PLANO:")
        
        # Utilização da capacidade
        print("Utilização da capacidade:")
        for t in range(len(production)):
            utilization = (production[t] / capacities[t]) * 100 if capacities[t] > 0 else 0
            print(f"  Período {t+1}: {utilization:.1f}%")
        
        # Níveis de estoque
        max_inventory = max(inventory) if inventory else 0
        avg_inventory = sum(inventory) / len(inventory) if inventory else 0
        print(f"\nEstatísticas de estoque:")
        print(f"  Máximo: {max_inventory:.2f}")
        print(f"  Média: {avg_inventory:.2f}")
        
        # Atendimento da demanda
        total_production = sum(production)
        total_demand = sum(demands)
        print(f"\nProdução vs Demanda:")
        print(f"  Produção total: {total_production:.2f}")
        print(f"  Demanda total: {total_demand:.2f}")

# Exemplo de planejamento multi-período
def demo_production_planning():
    """Demonstração de planejamento de produção"""
    
    planner = ProductionPlanning()
    
    # Dados do problema
    demands = [100, 150, 200, 120, 80]  # Demanda por período
    production_costs = [10, 12, 11, 13, 10]  # Custo de produção
    inventory_costs = [2, 2, 2, 2, 2]  # Custo de estoque
    capacities = [180, 180, 180, 180, 180]  # Capacidade de produção
    
    result = planner.multi_period_planning(
        demands=demands,
        production_costs=production_costs,
        inventory_costs=inventory_costs,
        capacities=capacities,
        initial_inventory=50,
        final_inventory=30
    )

if __name__ == "__main__":
    demo_production_planning()
```

## Limitações e Extensões

### Limitações da Programação Linear

- **Linearidade**: Função objetivo e restrições devem ser lineares
- **Divisibilidade**: Variáveis podem assumir valores fracionários
- **Certeza**: Parâmetros são determinísticos
- **Proporcionalidade**: Contribuição proporcional das variáveis

### Extensões da PL

#### 1. Programação Linear Inteira (PLI)
```python
from scipy.optimize import milp, LinearConstraint, Bounds

def solve_integer_programming():
    """Exemplo de Programação Linear Inteira"""
    
    print("PROGRAMAÇÃO LINEAR INTEIRA")
    print("=" * 35)
    print("Problema: Seleção de projetos")
    print("x_i = 1 se projeto i é selecionado, 0 caso contrário")
    
    # Função objetivo: maximizar valor dos projetos
    c = [-100, -150, -200, -75]  # Valores dos projetos (negativo para maximizar)
    
    # Restrições: orçamento limitado
    A = [[50, 80, 120, 30]]  # Custos dos projetos
    b_l = [-float('inf')]    # Sem limite inferior
    b_u = [200]              # Orçamento máximo
    
    constraints = LinearConstraint(A, b_l, b_u)
    
    # Limites: variáveis binárias
    bounds = Bounds(lb=[0, 0, 0, 0], ub=[1, 1, 1, 1])
    
    # Especificar variáveis inteiras
    integrality = [1, 1, 1, 1]  # 1 = inteira, 0 = contínua
    
    result = milp(
        c=c,
        constraints=constraints,
        bounds=bounds,
        integrality=integrality
    )
    
    if result.success:
        print("Projetos selecionados:")
        for i, selected in enumerate(result.x):
            if selected > 0.5:  # Arredondamento para binário
                print(f"  Projeto {i+1}: SELECIONADO")
        
        total_value = -result.fun
        total_cost = sum(A[0][i] * result.x[i] for i in range(len(result.x)))
        
        print(f"Valor total: {total_value}")
        print(f"Custo total: {total_cost}")
```

#### 2. Programação Estocástica
```python
def stochastic_programming_example():
    """Exemplo conceitual de Programação Estocástica"""
    
    print("\nPROGRAMAÇÃO ESTOCÁSTICA")
    print("=" * 30)
    print("Problema: Planejamento sob incerteza")
    print("Primeiro estágio: decisões antes da incerteza")
    print("Segundo estágio: decisões após observar cenários")
    
    # Cenários de demanda
    scenarios = [
        {'demand': 100, 'probability': 0.3},
        {'demand': 150, 'probability': 0.5},
        {'demand': 200, 'probability': 0.2}
    ]
    
    print("\nCenários de demanda:")
    for i, scenario in enumerate(scenarios):
        print(f"  Cenário {i+1}: Demanda={scenario['demand']}, Prob={scenario['probability']}")
    
    # Em uma implementação real, seria necessário modelar:
    # - Variáveis de primeiro estágio (decisões antecipadas)
    # - Variáveis de segundo estágio (decisões por cenário)
    # - Função objetivo esperada
    print("\nNote: Implementação completa requer modelagem específica")
```

## Ferramentas e Bibliotecas

### Comparação de Ferramentas

```python
def compare_lp_solvers():
    """Compara diferentes solvers de PL"""
    
    print("COMPARAÇÃO DE SOLVERS DE PL")
    print("=" * 35)
    
    solvers_info = {
        'SciPy linprog': {
            'language': 'Python',
            'methods': ['highs', 'interior-point', 'revised simplex'],
            'pros': ['Integrado ao SciPy', 'Fácil de usar', 'Gratuito'],
            'cons': ['Limitado para problemas grandes']
        },
        'PuLP': {
            'language': 'Python',
            'methods': ['Interface para múltiplos solvers'],
            'pros': ['Modelagem intuitiva', 'Múltiplos backends'],
            'cons': ['Requer solvers externos para performance']
        },
        'CPLEX': {
            'language': 'Múltiplas',
            'methods': ['Simplex', 'Barrier', 'Network'],
            'pros': ['Muito rápido', 'Robusto', 'Suporte comercial'],
            'cons': ['Licença comercial cara']
        },
        'Gurobi': {
            'language': 'Múltiplas', 
            'methods': ['Simplex', 'Barrier', 'Concurrent'],
            'pros': ['Excelente performance', 'Boa documentação'],
            'cons': ['Licença comercial']
        },
        'GLPK': {
            'language': 'C',
            'methods': ['Simplex', 'Interior-point'],
            'pros': ['Gratuito', 'Open source', 'Maduro'],
            'cons': ['Performance menor que comerciais']
        }
    }
    
    for solver, info in solvers_info.items():
        print(f"\n{solver}:")
        print(f"  Linguagem: {info['language']}")
        print(f"  Métodos: {', '.join(info['methods'])}")
        print(f"  Prós: {', '.join(info['pros'])}")
        print(f"  Contras: {', '.join(info['cons'])}")

if __name__ == "__main__":
    compare_lp_solvers()
```

## Casos de Uso Reais

### 1. **Logística e Transporte**
- Otimização de rotas de entrega
- Planejamento de frota
- Localização de centros de distribuição

### 2. **Manufatura**
- Planejamento de produção
- Programação de máquinas
- Gestão de estoque

### 3. **Finanças**
- Otimização de portfolio
- Gestão de risco
- Planejamento de capital

### 4. **Energia**
- Despacho de usinas
- Planejamento da expansão
- Comercialização de energia

### 5. **Agricultura**
- Planejamento de cultivos
- Alocação de recursos hídricos
- Otimização de rações

## Considerações Práticas

### Modelagem Eficaz
- **Identificar claramente** objetivo e restrições
- **Verificar linearidade** de todas as relações
- **Definir escala apropriada** das variáveis
- **Considerar unidades** consistentes
- **Validar modelo** com dados reais

### Resolução Numérica
- **Escolher solver apropriado** para o tamanho do problema
- **Configurar tolerâncias** adequadas
- **Monitorar convergência** e estabilidade
- **Interpretar resultados** no contexto do problema
- **Realizar análise de sensibilidade**

A Programação Linear é uma ferramenta fundamental de otimização que, apesar de suas limitações, oferece uma base sólida para resolver uma ampla gama de problemas práticos de alocação e planejamento.
