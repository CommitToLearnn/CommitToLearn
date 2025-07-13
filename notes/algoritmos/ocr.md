# OCR (Optical Character Recognition)

## O que é OCR?

OCR (Optical Character Recognition - Reconhecimento Óptico de Caracteres) é uma tecnologia que converte diferentes tipos de documentos, como documentos digitalizados, fotos de documentos ou texto em imagens, em dados editáveis e pesquisáveis.

## Como Funciona

### Processo Básico
- **Pré-processamento**: Melhoria da qualidade da imagem (remoção de ruído, ajuste de contraste)
- **Detecção de Layout**: Identificação de regiões de texto, imagens e tabelas
- **Segmentação**: Separação de linhas, palavras e caracteres individuais
- **Reconhecimento**: Identificação de caracteres usando padrões ou redes neurais
- **Pós-processamento**: Correção ortográfica e formatação do texto extraído

### Desafios Técnicos
- **Qualidade da Imagem**: Baixa resolução, ruído, distorções afetam a precisão
- **Variedade de Fontes**: Diferentes tipos de letra, tamanhos e estilos
- **Layout Complexo**: Documentos com múltiplas colunas, tabelas e gráficos
- **Idiomas Diferentes**: Suporte a múltiplos idiomas e caracteres especiais

## Implementações Práticas

### OCR com Tesseract (Python)
```python
import pytesseract
from PIL import Image
import cv2
import numpy as np

class OCRProcessor:
    def __init__(self):
        # Configurar Tesseract (ajustar caminho conforme necessário)
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        pass
    
    def preprocess_image(self, image_path):
        """Pré-processa imagem para melhorar OCR"""
        # Ler imagem
        img = cv2.imread(image_path)
        
        # Converter para escala de cinza
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Aplicar denoising
        denoised = cv2.fastNlMeansDenoising(gray)
        
        # Aplicar threshold para binarização
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Morfologia para limpar ruído
        kernel = np.ones((1, 1), np.uint8)
        processed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        
        return processed
    
    def extract_text(self, image_path, lang='por'):
        """Extrai texto da imagem"""
        # Pré-processar imagem
        processed_img = self.preprocess_image(image_path)
        
        # Configurações do Tesseract
        custom_config = r'--oem 3 --psm 6'
        
        # Extrair texto
        text = pytesseract.image_to_string(
            processed_img, 
            lang=lang, 
            config=custom_config
        )
        
        return text.strip()
    
    def extract_data_with_confidence(self, image_path):
        """Extrai texto com nível de confiança"""
        processed_img = self.preprocess_image(image_path)
        
        # Obter dados detalhados
        data = pytesseract.image_to_data(
            processed_img, 
            output_type=pytesseract.Output.DICT
        )
        
        # Filtrar por confiança
        confidences = []
        texts = []
        
        for i in range(len(data['text'])):
            confidence = int(data['conf'][i])
            text = data['text'][i].strip()
            
            if confidence > 60 and text:  # Filtrar baixa confiança
                confidences.append(confidence)
                texts.append(text)
        
        return texts, confidences

# Exemplo de uso
ocr = OCRProcessor()
texto_extraido = ocr.extract_text('documento.jpg')
print(f"Texto extraído: {texto_extraido}")
```

### OCR com OpenCV e Deep Learning
```python
import cv2
import numpy as np
from tensorflow import keras
import string

class DeepOCR:
    def __init__(self, model_path=None):
        self.characters = string.ascii_letters + string.digits + ' '
        if model_path:
            self.model = keras.models.load_model(model_path)
        else:
            self.model = self.create_model()
    
    def create_model(self):
        """Cria modelo CRNN para OCR"""
        from tensorflow.keras.layers import (
            Input, Conv2D, MaxPooling2D, Reshape, 
            LSTM, Dense, Dropout
        )
        from tensorflow.keras.models import Model
        
        # Input layer
        input_layer = Input(shape=(32, 128, 1))
        
        # CNN layers
        x = Conv2D(32, (3, 3), activation='relu', padding='same')(input_layer)
        x = MaxPooling2D((2, 2))(x)
        
        x = Conv2D(64, (3, 3), activation='relu', padding='same')(x)
        x = MaxPooling2D((2, 2))(x)
        
        x = Conv2D(128, (3, 3), activation='relu', padding='same')(x)
        x = MaxPooling2D((2, 1))(x)
        
        # Reshape para RNN
        new_shape = ((32 // 4), (128 // 4) * 128)
        x = Reshape(target_shape=new_shape)(x)
        
        # RNN layers
        x = LSTM(128, return_sequences=True)(x)
        x = Dropout(0.2)(x)
        x = LSTM(128, return_sequences=True)(x)
        
        # Output layer
        output = Dense(len(self.characters) + 1, activation='softmax')(x)
        
        model = Model(inputs=input_layer, outputs=output)
        return model
    
    def detect_text_regions(self, image):
        """Detecta regiões de texto usando EAST"""
        # Implementação simplificada de detecção de texto
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Usar contornos para encontrar regiões de texto
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        # Encontrar contornos
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        text_regions = []
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            
            # Filtrar por tamanho
            if w > 10 and h > 10:
                text_regions.append((x, y, w, h))
        
        return text_regions
    
    def recognize_text(self, image_region):
        """Reconhece texto em região específica"""
        # Redimensionar para input do modelo
        resized = cv2.resize(image_region, (128, 32))
        normalized = resized.astype(np.float32) / 255.0
        
        if len(normalized.shape) == 2:
            normalized = np.expand_dims(normalized, axis=-1)
        
        # Adicionar batch dimension
        batch_input = np.expand_dims(normalized, axis=0)
        
        # Predição
        prediction = self.model.predict(batch_input)
        
        # Decodificar resultado (CTC decoding simplificado)
        decoded_text = self.decode_prediction(prediction[0])
        
        return decoded_text
    
    def decode_prediction(self, prediction):
        """Decodifica predição do modelo"""
        # Implementação simplificada de CTC decoding
        predicted_chars = []
        prev_char = None
        
        for timestep in prediction:
            char_index = np.argmax(timestep)
            
            if char_index < len(self.characters) and char_index != prev_char:
                predicted_chars.append(self.characters[char_index])
            
            prev_char = char_index
        
        return ''.join(predicted_chars).strip()

# Exemplo de uso
deep_ocr = DeepOCR()
image = cv2.imread('documento.jpg')
regions = deep_ocr.detect_text_regions(image)

for x, y, w, h in regions:
    roi = image[y:y+h, x:x+w]
    text = deep_ocr.recognize_text(roi)
    print(f"Texto reconhecido: {text}")
```

## Vantagens

- **Automatização**: Converte grandes volumes de documentos automaticamente
- **Pesquisa**: Torna documentos pesquisáveis e indexáveis
- **Edição**: Permite editar texto extraído de imagens
- **Acessibilidade**: Facilita acesso a conteúdo para pessoas com deficiência visual
- **Integração**: Pode ser integrado em workflows digitais

## Desvantagens

- **Precisão**: Pode ter erros dependendo da qualidade da imagem
- **Formatação**: Pode perder formatação original do documento
- **Complexidade**: Documentos complexos são difíceis de processar
- **Custo Computacional**: Processamento intensivo para documentos grandes
- **Idiomas**: Menor precisão para idiomas com caracteres especiais

## Casos de Uso

### Ideal Para:
- Digitalização de documentos históricos
- Processamento de formulários e pesquisas
- Extração de dados de faturas e recibos
- Conversão de livros para formato digital
- Sistemas de automação documental

### Não Recomendado Para:
- Imagens com texto muito pequeno ou borrado
- Documentos com layout muito complexo
- Texto manuscrito de baixa qualidade
- Imagens com baixo contraste

## Comparação entre Tecnologias OCR

| Tecnologia | Precisão | Velocidade | Custo | Facilidade |
|------------|----------|------------|-------|------------|
| Tesseract | 85-95% | Média | Gratuito | Fácil |
| Google Vision API | 95-99% | Alta | Pago | Muito Fácil |
| Amazon Textract | 95-98% | Alta | Pago | Fácil |
| Azure Computer Vision | 94-97% | Alta | Pago | Fácil |
| PaddleOCR | 90-96% | Alta | Gratuito | Média |

## Principais Ferramentas e Bibliotecas OCR

### Open Source
- **Tesseract**: Motor OCR mais popular, mantido pelo Google
- **PaddleOCR**: Framework da Baidu com suporte multilíngue
- **EasyOCR**: Biblioteca Python fácil de usar
- **TrOCR**: Transformer-based OCR da Microsoft
- **MMOCR**: Framework modular para OCR

### APIs Comerciais
- **Google Cloud Vision API**: Precisão alta, boa para documentos
- **Amazon Textract**: Especializado em formulários e tabelas
- **Azure Computer Vision**: Integração com ecosystem Microsoft
- **ABBYY FineReader**: Solução enterprise
- **IBM Watson Visual Recognition**: Focado em enterprise

## Métricas de Performance

### Indicadores de Qualidade
- Precisão de caracteres (Character Accuracy)
- Precisão de palavras (Word Accuracy) 
- Taxa de erro de caracteres (CER)
- Taxa de erro de palavras (WER)
- Tempo de processamento por página

### Ferramentas de Avaliação
```python
def calculate_accuracy(ground_truth, predicted):
    """Calcula precisão do OCR"""
    correct_chars = 0
    total_chars = len(ground_truth)
    
    for i, char in enumerate(ground_truth):
        if i < len(predicted) and char == predicted[i]:
            correct_chars += 1
    
    accuracy = (correct_chars / total_chars) * 100
    return accuracy

def calculate_word_accuracy(ground_truth, predicted):
    """Calcula precisão por palavra"""
    gt_words = ground_truth.split()
    pred_words = predicted.split()
    
    correct_words = sum(1 for gt, pred in zip(gt_words, pred_words) if gt == pred)
    total_words = len(gt_words)
    
    return (correct_words / total_words) * 100 if total_words > 0 else 0
```

## Aplicações Práticas Avançadas

### Sistema de Processamento de Faturas
```python
class InvoiceOCR:
    def __init__(self):
        self.ocr = OCRProcessor()
        self.patterns = {
            'total': r'total[:\s]*[R$]*\s*(\d+[,.]?\d*)',
            'date': r'(\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4})',
            'cnpj': r'(\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2})'
        }
    
    def extract_invoice_data(self, image_path):
        """Extrai dados estruturados de fatura"""
        text = self.ocr.extract_text(image_path)
        
        extracted_data = {}
        for field, pattern in self.patterns.items():
            import re
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                extracted_data[field] = match.group(1)
        
        return extracted_data
    
    def validate_extracted_data(self, data):
        """Valida dados extraídos"""
        validations = {
            'total': lambda x: float(x.replace(',', '.')) > 0,
            'cnpj': lambda x: len(x.replace('.', '').replace('/', '').replace('-', '')) == 14
        }
        
        for field, validator in validations.items():
            if field in data:
                try:
                    if not validator(data[field]):
                        data[f'{field}_valid'] = False
                    else:
                        data[f'{field}_valid'] = True
                except:
                    data[f'{field}_valid'] = False
        
        return data

# Uso
invoice_ocr = InvoiceOCR()
data = invoice_ocr.extract_invoice_data('fatura.pdf')
validated_data = invoice_ocr.validate_extracted_data(data)
print(validated_data)
```

### Leitor de Placas Veiculares
```python
class LicensePlateOCR:
    def __init__(self):
        self.ocr = OCRProcessor()
    
    def detect_license_plate(self, image):
        """Detecta região da placa usando OpenCV"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Filtro bilateral para reduzir ruído
        filtered = cv2.bilateralFilter(gray, 11, 17, 17)
        
        # Detectar bordas
        edges = cv2.Canny(filtered, 30, 200)
        
        # Encontrar contornos
        contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        # Filtrar contornos que podem ser placas
        for contour in contours:
            approx = cv2.approxPolyDP(contour, 0.018 * cv2.arcLength(contour, True), True)
            
            if len(approx) == 4:  # Formato retangular
                x, y, w, h = cv2.boundingRect(contour)
                aspect_ratio = w / h
                
                # Proporção típica de placa brasileira
                if 2.0 < aspect_ratio < 4.5 and w > 100 and h > 30:
                    return image[y:y+h, x:x+w]
        
        return None
    
    def read_plate(self, image_path):
        """Lê texto da placa"""
        image = cv2.imread(image_path)
        plate_region = self.detect_license_plate(image)
        
        if plate_region is not None:
            # Configuração específica para placas
            custom_config = r'--oem 3 --psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            
            text = pytesseract.image_to_string(
                plate_region, 
                config=custom_config
            ).strip()
            
            # Validar formato brasileiro (AAA9999 ou AAA9A99)
            import re
            if re.match(r'^[A-Z]{3}\d{4}$', text) or re.match(r'^[A-Z]{3}\d[A-Z]\d{2}$', text):
                return text
        
        return None

# Uso
plate_reader = LicensePlateOCR()
plate_text = plate_reader.read_plate('veiculo.jpg')
print(f"Placa detectada: {plate_text}")
```

## Tendências e Futuro do OCR

### Tecnologias Emergentes
- **Transformers**: Modelos baseados em atenção para melhor precisão
- **OCR Multimodal**: Combinação de texto, layout e imagens
- **Edge OCR**: Processamento local em dispositivos móveis
- **OCR em Tempo Real**: Processamento de vídeo em streaming
- **OCR Multilíngue**: Suporte simultâneo a múltiplos idiomas

### Aplicações Futuras
```python
class NextGenOCR:
    def __init__(self):
        self.layout_analyzer = LayoutAnalyzer()
        self.context_understander = ContextUnderstanding()
        self.real_time_processor = RealTimeProcessor()
    
    def intelligent_extraction(self, document):
        """OCR inteligente com entendimento de contexto"""
        # Análise de layout
        layout = self.layout_analyzer.analyze(document)
        
        # Extração baseada em contexto
        extracted_data = {}
        for region in layout.text_regions:
            text = self.extract_text(region)
            context = self.context_understander.classify(text, region.type)
            extracted_data[context.field_name] = {
                'text': text,
                'confidence': context.confidence,
                'type': context.data_type
            }
        
        return extracted_data
    
    def continuous_learning(self, feedback):
        """Aprendizado contínuo baseado em feedback"""
        # Atualizar modelos baseado em correções do usuário
        self.model.fine_tune(feedback.corrections)
        
    def multi_language_auto_detect(self, image):
        """Detecção automática de idioma e OCR adaptativo"""
        detected_languages = self.detect_languages(image)
        
        results = {}
        for lang in detected_languages:
            lang_specific_text = self.extract_text(image, language=lang)
            results[lang] = lang_specific_text
        
        return results
```

### Integração com IA
- **GPT para Pós-processamento**: Correção inteligente de erros
- **Computer Vision**: Melhor detecção de regiões de texto
- **NLP**: Entendimento semântico do texto extraído
- **Automated Workflows**: Integração com RPA (Robotic Process Automation)
