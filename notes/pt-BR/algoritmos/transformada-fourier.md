# Transformada de Fourier

## O que é a Transformada de Fourier?

A Transformada de Fourier é uma ferramenta matemática fundamental que decompõe um sinal complexo em suas componentes de frequência. Ela permite analisar sinais no domínio da frequência em vez do domínio do tempo.

## Conceitos Fundamentais

### Definição Matemática
A Transformada de Fourier de uma função f(t) é definida como:

```
F(ω) = ∫[-∞ to ∞] f(t) * e^(-iωt) dt
```

Onde:
- F(ω) é a transformada no domínio da frequência
- f(t) é a função original no domínio do tempo
- ω é a frequência angular
- i é a unidade imaginária

### Transformada Inversa
```
f(t) = (1/2π) ∫[-∞ to ∞] F(ω) * e^(iωt) dω
```

## Tipos de Transformada de Fourier

### Transformada de Fourier Contínua (CFT)
- Para sinais contínuos e não-periódicos
- Usado em análise teórica
- Produz espectro contínuo

### Série de Fourier (FS)
- Para sinais periódicos contínuos
- Decompõe em série de senos e cossenos
- Espectro discreto

### Transformada de Fourier de Tempo Discreto (DTFT)
- Para sinais discretos não-periódicos
- Espectro contínuo e periódico

### Transformada de Fourier Discreta (DFT)
- Para sinais discretos e periódicos
- Implementação prática em computadores
- Base para FFT (Fast Fourier Transform)

## FFT - Fast Fourier Transform

### Algoritmo Cooley-Tukey
```python
import numpy as np

def fft(x):
    """Implementação simples da FFT usando algoritmo Cooley-Tukey"""
    N = len(x)
    
    if N <= 1:
        return x
    
    # Divide
    even = fft(x[0::2])
    odd = fft(x[1::2])
    
    # Conquista
    T = [np.exp(-2j * np.pi * k / N) * odd[k] for k in range(N // 2)]
    
    return [even[k] + T[k] for k in range(N // 2)] + \
           [even[k] - T[k] for k in range(N // 2)]

# Exemplo de uso
signal = [1, 2, 3, 4]
transformed = fft(signal)
print(f"Sinal original: {signal}")
print(f"FFT: {transformed}")
```

### Complexidade
- **DFT Naive**: O(N²)
- **FFT**: O(N log N)

## Propriedades Importantes

### Linearidade
```
F[a*f(t) + b*g(t)] = a*F[f(t)] + b*F[g(t)]
```

### Deslocamento no Tempo
```
F[f(t - t₀)] = F[f(t)] * e^(-iωt₀)
```

### Deslocamento na Frequência
```
F[f(t) * e^(iω₀t)] = F[f(t - ω₀)]
```

### Convolução
```
F[f(t) * g(t)] = F[f(t)] * F[g(t)]
```

## Aplicações Práticas

### Processamento de Áudio
```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.fft import fft, fftfreq

# Gerar sinal de áudio com múltiplas frequências
sample_rate = 1000  # Hz
duration = 1.0      # segundos
t = np.linspace(0, duration, int(sample_rate * duration))

# Sinal composto por 50Hz e 120Hz
signal = np.sin(2 * np.pi * 50 * t) + 0.5 * np.sin(2 * np.pi * 120 * t)

# Aplicar FFT
fft_signal = fft(signal)
frequencies = fftfreq(len(t), 1/sample_rate)

# Análise espectral
magnitude = np.abs(fft_signal)
```

### Processamento de Imagens
```python
import cv2
import numpy as np

def apply_fft_filter(image, filter_type='low_pass'):
    """Aplica filtro usando FFT em imagem"""
    
    # Converter para frequência
    f_transform = np.fft.fft2(image)
    f_shift = np.fft.fftshift(f_transform)
    
    rows, cols = image.shape
    crow, ccol = rows // 2, cols // 2
    
    # Criar máscara
    mask = np.zeros((rows, cols), np.uint8)
    
    if filter_type == 'low_pass':
        # Filtro passa-baixa (suavização)
        r = 30
        center = [crow, ccol]
        x, y = np.ogrid[:rows, :cols]
        mask_area = (x - center[0]) ** 2 + (y - center[1]) ** 2 <= r*r
        mask[mask_area] = 1
    
    # Aplicar máscara
    f_shift_filtered = f_shift * mask
    
    # Transformada inversa
    f_ishift = np.fft.ifftshift(f_shift_filtered)
    img_filtered = np.fft.ifft2(f_ishift)
    img_filtered = np.real(img_filtered)
    
    return img_filtered
```

### Análise de Sinais Biomédicos
```python
def analyze_ecg_signal(ecg_data, sample_rate):
    """Análise espectral de sinal de ECG"""
    
    # FFT do sinal
    fft_ecg = np.fft.fft(ecg_data)
    frequencies = np.fft.fftfreq(len(ecg_data), 1/sample_rate)
    
    # Magnitude
    magnitude = np.abs(fft_ecg)
    
    # Encontrar frequência dominante
    dominant_freq_idx = np.argmax(magnitude[1:len(magnitude)//2]) + 1
    heart_rate = frequencies[dominant_freq_idx] * 60  # BPM
    
    return heart_rate, frequencies, magnitude
```

## Implementações Otimizadas

### NumPy/SciPy
```python
import numpy as np
from scipy.fft import fft, ifft

# FFT otimizada
signal = np.random.random(1024)
spectrum = fft(signal)
reconstructed = ifft(spectrum)
```

### FFTW (C/C++)
```c
#include <fftw3.h>

void compute_fft(double* input, double* output, int n) {
    fftw_complex *in, *out;
    fftw_plan p;
    
    in = (fftw_complex*) fftw_malloc(sizeof(fftw_complex) * n);
    out = (fftw_complex*) fftw_malloc(sizeof(fftw_complex) * n);
    
    p = fftw_plan_dft_1d(n, in, out, FFTW_FORWARD, FFTW_ESTIMATE);
    
    // Copiar dados de entrada
    for(int i = 0; i < n; i++) {
        in[i][0] = input[i];
        in[i][1] = 0.0;
    }
    
    fftw_execute(p);
    
    // Copiar resultado
    for(int i = 0; i < n; i++) {
        output[i] = sqrt(out[i][0]*out[i][0] + out[i][1]*out[i][1]);
    }
    
    fftw_destroy_plan(p);
    fftw_free(in);
    fftw_free(out);
}
```

## Análise de Performance

### Benchmarks Típicos
| Tamanho (N) | DFT O(N²) | FFT O(N log N) | Speedup |
|-------------|-----------|----------------|---------|
| 64 | 4,096 | 384 | 10.7x |
| 256 | 65,536 | 2,048 | 32x |
| 1024 | 1,048,576 | 10,240 | 102x |
| 4096 | 16,777,216 | 49,152 | 341x |

### Otimizações
- **Padding**: Completar com zeros para tamanhos de potência de 2
- **Bit-reversal**: Pré-processamento para melhor cache locality
- **Paralelização**: Usar múltiplos cores para FFTs grandes
- **SIMD**: Usar instruções vetorizadas (SSE, AVX)

## Limitações e Considerações

### Vazamento Espectral (Spectral Leakage)
- Causado por janelamento finito
- Solucionado com funções de janela (Hamming, Hanning, etc.)

### Efeito de Aliasing
- Frequências altas aparecem como baixas
- Prevenido com filtros anti-aliasing

### Resolução Frequencial
- Limitada pelo tamanho da janela
- Trade-off entre resolução temporal e frequencial

## Transformadas Relacionadas

### Transformada Wavelet
- Análise tempo-frequência
- Melhor para sinais não-estacionários

### Transformada Cosseno Discreta (DCT)
- Usada em compressão (JPEG, MP3)
- Apenas componentes reais

### Transformada Z
- Extensão da Fourier para sistemas discretos
- Análise de estabilidade de sistemas

## Ferramentas e Bibliotecas

### Python
- **NumPy**: `np.fft`
- **SciPy**: `scipy.fft`
- **PyFFTW**: Interface para FFTW

### MATLAB
- **fft()**: FFT básica
- **Signal Processing Toolbox**: Funções avançadas

### C/C++
- **FFTW**: Biblioteca otimizada
- **Intel MKL**: Implementação Intel
- **cuFFT**: Para GPU (CUDA)

## Exercícios Práticos

### Análise de Frequência de Áudio
Implementar um analisador de espectro em tempo real

### Filtro Digital
Criar filtros passa-baixa, passa-alta e passa-banda usando FFT

### Compressão de Imagem
Implementar compressão básica usando FFT 2D

### Detecção de Padrões
Usar correlação cruzada via FFT para detectar padrões em sinais
