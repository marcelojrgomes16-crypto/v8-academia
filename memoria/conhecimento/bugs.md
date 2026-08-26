# Bugs

> Problemas que ja resolvi.

## V8 Academia

### GIFs nao aparecem
- Banco resetado
- Solucao: /api/setup?secret=v8academia-setup-2024

### Erros TypeScript admin
- Imports faltando
- Solucao: Adicionar getSession e redirect

## Controle Financeiro

### Auth bypass
- Logica incorreta em users.js
- Solucao: Corrigir verificacao

### Inputs fechando teclado
- Controlled components
- Solucao: defaultValue + onBlur

### Classificacao nao salvava
- Objeto nao passado corretamente
- Solucao: Objeto explicito no handleSave
