# Controle Financeiro Pessoal

Aplicativo web completo de controle financeiro pessoal em PT-BR, com autenticação e sincronização via Supabase, CRUD de gastos/valores extras, dashboard com gráficos e histórico com filtros.

## Stack
- React + Vite + TypeScript + TailwindCSS
- Recharts (gráficos)
- lucide-react (ícones)
- Supabase (Auth + Banco + RLS)
- date-fns (datas)

## Como rodar
1. Instale o **Node.js LTS**.
2. No diretório do projeto:

```bash
npm install
npm run dev
```

## Configurar Supabase
1. Crie um projeto em `https://supabase.com`.
2. Em **Project Settings > API**, copie:
   - `Project URL`
   - `anon public key`
3. Crie arquivo `.env` na raiz (baseado em `.env.example`):

```bash
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

4. Execute o SQL de `src/data/supabase.sql` no **SQL Editor** do Supabase.
5. Em **Authentication > Providers > Email**, habilite Email/Password.
6. Em produção (Vercel), adicione as mesmas variáveis em **Project > Settings > Environment Variables**.
7. Em **Authentication > URL Configuration**, adicione:
   - Site URL: seu domínio Vercel (ex.: `https://seu-app.vercel.app`)
   - Redirect URLs: inclua também o mesmo domínio

## Scripts
- `npm run dev` - ambiente de desenvolvimento
- `npm run build` - build de produção
- `npm run preview` - preview do build

## Regras de dados
- Login/cadastro reais via Supabase Auth (funciona em qualquer dispositivo).
- Dados financeiros sincronizados por usuário com RLS.
- Primeiro cadastro permite carregar dados de exemplo.
- O app valida automaticamente os totais esperados do seed com `console.assert`:
  - Total gastos: `3984.90`
  - Saldo restante: `1664.28`
  - Saldo final: `2239.28`
