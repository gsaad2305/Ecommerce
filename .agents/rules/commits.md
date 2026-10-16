# Diretrizes de Commits

## Gatilho de Commit
- **Quando commitar**: Sempre ao **finalizar uma tarefa/etapa de desenvolvimento**, se houver arquivos alterados.
- **Branch alvo**: `macos`.
- **Ações**:
  1. `git add .` (adicionar todos os arquivos alterados da tarefa).
  2. `git commit` seguindo rigorosamente a estrutura e convenção abaixo, baseada nas alterações realizadas.

---

## Estrutura do Commit
```
<tipo>(<escopo opcional>): <descrição sucinta em português>

- <detalhe da alteração 1>
- <detalhe da alteração 2>
```

---

## Tipos Permitidos

- `feat`: Adição de um **novo recurso** (se relaciona com MINOR do semver).
- `fix`: **Correção de bug** / solução de problema (se relaciona com PATCH do semver).
- `docs`: Mudanças na **documentação** (README, jsdoc, sem alteração de código).
- `test`: Criação, alteração ou exclusão de **testes** unitários/e2e (sem alterar código de produção).
- `build`: Modificações em **arquivos de build e dependências** (package.json, pnpm-lock, etc.).
- `perf`: Mudanças voltadas especificamente para melhoria de **performance**.
- `style`: Formatação de código, lint, semicolons, trailing spaces (sem alteração de lógica).
- `refactor`: **Refatoração** que não altera o comportamento funcional.
- `chore`: Atualizações de tarefas de build, configurações de administrador, gitignore, ferramentas.
- `ci`: Alterações nos fluxos de **integração contínua** (CI/CD, workflows).
- `raw`: Mudanças em arquivos de **configurações, dados, features, parâmetros**.
- `cleanup`: Remoção de **código comentado**, trechos mortos ou limpeza para legibilidade.
- `remove`: **Exclusão de arquivos**, diretórios ou funcionalidades obsoletas/não utilizadas.
