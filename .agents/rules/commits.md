# Diretrizes de Commits

Ao criar mensagens de commit ou sugerir commits para este projeto, utilize a convenção baseada em **[Conventional Commits](https://www.conventionalcommits.org/pt-br)** com a seguinte estrutura e tipos:

## Estrutura
`<tipo>(<escopo opcional>): <descrição>`

## Tipos Permitidos

- `feat`: Adição de um **novo recurso** (MINOR semver).
- `fix`: **Correção de bug** / solução de problema (PATCH semver).
- `docs`: Mudanças na **documentação** (ex: README, comentários de documentação, sem alteração de código).
- `test`: Criação, alteração ou exclusão de **testes** (sem alteração de código de produção).
- `build`: Modificações em **arquivos de build e dependências**.
- `perf`: Mudanças de código voltadas para **performance**.
- `style`: Formatações de código, semicolons, trailing spaces, lint (sem alteração de lógica/código funcional).
- `refactor`: **Refatorações** de código que não alteram a funcionalidade existente.
- `chore`: Atualizações de tarefas de build, configurações de administrador, gitignore, ferramentas (sem alterar código de produção).
- `ci`: Mudanças nos arquivos e fluxos de **integração contínua** (CI/CD).
- `raw`: Mudanças em arquivos de **configurações, dados, features, parâmetros**.
- `cleanup`: Remoção de **código comentado**, trechos desnecessários e limpeza para melhorar manutenibilidade.
- `remove`: **Exclusão de arquivos**, diretórios ou funcionalidades obsoletas/não utilizadas.
