# Controle Financeiro Pessoal

Aplicativo web completo de controle financeiro pessoal em PT-BR, com autenticação local, persistência em `localStorage`, CRUD de gastos/valores extras, dashboard com gráficos e histórico com filtros.

## Stack
- React + Vite + TypeScript + TailwindCSS
- Recharts (gráficos)
- lucide-react (ícones)
- bcryptjs (hash de senha)
- date-fns (datas)

## Como rodar
1. Instale o **Node.js LTS**.
2. No diretório do projeto:

```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` - ambiente de desenvolvimento
- `npm run build` - build de produção
- `npm run preview` - preview do build

## Regras de dados
- Sessão local e usuários em `localStorage`.
- Dados financeiros isolados por `userId`.
- Primeiro cadastro permite carregar dados de exemplo no login/cadastro.
- O app valida automaticamente os totais esperados do seed com `console.assert`:
  - Total gastos: `3984.90`
  - Saldo restante: `1664.28`
  - Saldo final: `2239.28`
