/**
 * Script para padronizar notas existentes com o template padrão
 * 
 * Este script analisa notas existentes e sugere estruturação baseada no template:
 * 1. O Conceito em Detalhes
 * 2. Por Que Isso Importa?
 * 3. Exemplos Práticos
 * 4. Armadilhas Comuns
 * 5. Boas Práticas
 * 6. Resumo Rápido
 * 
 * Uso: node scripts/standardize-notes.js [caminho-da-nota]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECTIONS = {
  concept: '## O Conceito em Detalhes',
  importance: '## Por Que Isso Importa?',
  examples: '## Exemplos Práticos',
  pitfalls: '## Armadilhas Comuns',
  practices: '## Boas Práticas',
  summary: '## Resumo Rápido'
};

function analyzeNote(content) {
  const hasSections = {};
  
  for (const [key, sectionTitle] of Object.entries(SECTIONS)) {
    hasSections[key] = content.includes(sectionTitle);
  }
  
  return hasSections;
}

function suggestStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const analysis = analyzeNote(content);
  
  console.log(`\n📝 Analisando: ${path.basename(filePath)}`);
  console.log('─'.repeat(50));
  
  const missing = [];
  for (const [key, sectionTitle] of Object.entries(SECTIONS)) {
    const status = analysis[key] ? '✅' : '❌';
    console.log(`${status} ${sectionTitle}`);
    if (!analysis[key]) {
      missing.push(sectionTitle);
    }
  }
  
  if (missing.length === 0) {
    console.log('\n🎉 Esta nota já está padronizada!');
  } else {
    console.log(`\n⚠️  Seções faltando: ${missing.length}`);
    console.log('Adicione as seguintes seções para completar o padrão:\n');
    missing.forEach(section => console.log(`  - ${section}`));
  }
  
  return analysis;
}

function scanNotesDirectory(dirPath) {
  const results = {
    total: 0,
    standardized: 0,
    needsWork: []
  };
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.md')) {
        results.total++;
        const content = fs.readFileSync(filePath, 'utf-8');
        const analysis = analyzeNote(content);
        
        const allPresent = Object.values(analysis).every(v => v);
        if (allPresent) {
          results.standardized++;
        } else {
          results.needsWork.push({
            path: filePath,
            missing: Object.entries(SECTIONS)
              .filter(([key]) => !analysis[key])
              .map(([_, title]) => title)
          });
        }
      }
    }
  }
  
  walkDir(dirPath);
  return results;
}

// Modo de uso
const args = process.argv.slice(2);

if (args.length === 0) {
  // Escanear todas as notas
  console.log('🔍 Escaneando todas as notas...\n');
  
  const notesPath = path.join(__dirname, '../../notes/pt-BR');
  const results = scanNotesDirectory(notesPath);
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO GERAL');
  console.log('='.repeat(50));
  console.log(`Total de notas: ${results.total}`);
  console.log(`✅ Padronizadas: ${results.standardized} (${Math.round(results.standardized/results.total*100)}%)`);
  console.log(`⚠️  Precisam de trabalho: ${results.needsWork.length}`);
  
  if (results.needsWork.length > 0) {
    console.log('\n📋 Notas que precisam de atenção:\n');
    results.needsWork.slice(0, 10).forEach(note => {
      console.log(`  ${path.relative(notesPath, note.path)}`);
      console.log(`    Faltam: ${note.missing.length} seções`);
    });
    
    if (results.needsWork.length > 10) {
      console.log(`\n  ... e mais ${results.needsWork.length - 10} notas`);
    }
  }
  
} else {
  // Analisar nota específica
  const notePath = args[0];
  if (!fs.existsSync(notePath)) {
    console.error(`❌ Arquivo não encontrado: ${notePath}`);
    process.exit(1);
  }
  
  suggestStructure(notePath);
}

console.log('\n💡 Dica: Use o template NOTE_TEMPLATE.md como referência\n');
