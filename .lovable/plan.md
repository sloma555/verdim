

# Fontes de Renda - Sistema de Gestao de Receitas

## Resumo
Criar um sistema de "Fontes de Renda" onde o usuario pode cadastrar suas fontes (ex: Motoboy, Freelance, Salario) e associar cada entrada a uma fonte, permitindo visualizar o lucro separado por fonte.

## Arquivos a criar

### 1. Nova pagina: `src/pages/IncomePage.tsx`
- Secao superior: lista de fontes de renda cadastradas com nome, icone, cor e total do mes
- Botao para adicionar nova fonte
- Abaixo: lista de entradas do mes agrupadas por fonte, mostrando data, descricao e valor
- Card resumo com total de entradas por fonte (mini "termometro" de ganhos)
- Modal para criar/editar fonte de renda (nome, icone emoji, cor)

### 2. Novo componente: `src/components/IncomeSourceModal.tsx`
- Modal para criar/editar uma fonte de renda
- Campos: nome, icone (emoji picker simples com opcoes pre-definidas), cor
- Usa Dialog do Shadcn

## Arquivos a modificar

### 3. `src/types/finance.ts`
- Adicionar interface `IncomeSource`: id, name, icon, color
- Adicionar campo `incomeSourceId: string | null` na interface `Transaction`

### 4. `src/contexts/FinanceContext.tsx`
- Adicionar state e listener para colecao `incomeSources`
- CRUD: `addIncomeSource`, `updateIncomeSource`, `deleteIncomeSource`
- Adicionar funcao `getIncomeBySource(sourceId)` para calcular total por fonte no mes
- Expor `incomeSources` e funcoes no contexto
- Incrementar `checkLoaded` para 6 (novo listener)

### 5. `src/components/TransactionModal.tsx`
- Quando `type === 'income'`, mostrar Select de "Fonte de Renda" com as fontes cadastradas
- Salvar `incomeSourceId` na transacao
- Ao editar, preencher o campo corretamente

### 6. `src/pages/Overview.tsx`
- Na lista de transacoes, mostrar o nome da fonte de renda para entradas (em vez de apenas "Receita")

### 7. `src/components/BottomNav.tsx`
- Adicionar tab "Rendas" (icone Wallet) entre "Visao Geral" e "Categorias"
- Novo TabId: `'income'`

### 8. `src/pages/Index.tsx`
- Adicionar case `'income'` no switch importando `IncomePage`

## Detalhes tecnicos

- Colecao Firestore: `users/{uid}/incomeSources`
- Cada documento: `{ id, name, icon, color }`
- O campo `incomeSourceId` em Transaction e opcional (null) para manter compatibilidade com transacoes existentes
- Icones pre-definidos para fontes: motorcycle (🏍), laptop (💻), briefcase (💼), store (🏪), car (🚗), wrench (🔧), etc.
- A pagina de Rendas mostra cards por fonte com o total ganho no mes selecionado

## Fluxo do usuario
1. Vai na aba "Rendas" e cria a fonte "Motoboy" com icone 🏍
2. No dia a dia, clica no "+" e seleciona "Entrada"
3. Preenche valor, descricao, e seleciona "Motoboy" como fonte
4. Na aba "Rendas", ve o total ganho como Motoboy no mes, separado de outras fontes

