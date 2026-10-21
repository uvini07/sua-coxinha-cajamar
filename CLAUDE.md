# Instruções para o Claude

## Branch de trabalho (vale até a próxima subida para a main)

- Todas as atualizações do site e do jogo são feitas no branch
  `claude/site-game-updates-i5t1sm` (o mesmo nome nos repositórios `sua-coxinha-cajamar` e `jogo`).
- **Não mesclar nem abrir PR para a `main`** até o dono do projeto pedir explicitamente.
  Só commit e push neste branch.
- Uma sessão nova continua daqui: `git checkout claude/site-game-updates-i5t1sm`.
- Quando o dono pedir para subir para a `main`, mescle este branch (no site primeiro, porque é ele
  que publica o jogo) e depois remova esta seção.

## Duelo (jogo)

O código do Duelo de Titãs: Eleição fica no repositório `jogo`. Mudou o jogo: faça a alteração lá
(no mesmo branch), rode `npx vite build --base=/duelo/` e copie `dist/` para `public/duelo/` aqui,
mantendo a linha `<base href="/duelo/" />` logo abaixo do `<meta charset>` no `index.html`.
