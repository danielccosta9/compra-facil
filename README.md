# CompraCerta

Aplicativo mobile para **controlar compras de supermercado**, registrar notas fiscais
(NFC-e) e acompanhar a variação de preços — transformando notas em histórico útil para
economizar.

Projeto **didático**, construído passo a passo nas aulas de *Códigos de Alta Performance —
Mobile*. O código é propositalmente simples: componentes pequenos, nomes em português e
nada de arquitetura empresarial.

> **Este é o projeto base dos alunos.** Componentes, banco SQLite, serviços, hooks e testes
> já estão prontos. Em sala, construímos as **telas da pasta `src/app/`**. Por enquanto ela
> tem apenas um `_layout.tsx` e um `index.tsx` simples, que só confirmam que o app abre.

## Objetivo

Ajudar o consumidor a controlar gastos, descobrir onde os produtos costumam sair mais
baratos e criar listas de compras com base no seu próprio histórico — tudo
**offline-first**, com o SQLite do aparelho como fonte principal dos dados.

## Tecnologias

| Uso | Biblioteca |
|---|---|
| Base | React Native 0.88 · Expo SDK 58 · TypeScript |
| Navegação | Expo Router (pilha + abas, rotas protegidas com `Stack.Protected`) |
| Banco | expo-sqlite (`SQLiteProvider` + `useSQLiteContext`) |
| Senhas | expo-crypto (SHA-256 com sal) |
| Datas | date-fns (locale pt-BR) |
| Visual | Poppins (`@expo-google-fonts/poppins`) · lucide-react-native |
| Testes | Jest 30 + jest-expo |

Planejadas para aulas futuras: expo-camera (QR Code), expo-notifications e biblioteca de
gráficos.

**Decisão didática:** a especificação cita React Hook Form e Zod. Nesta fase os formulários
usam `useState` e funções de validação simples ([`src/utils/validacao.ts`](src/utils/validacao.ts)),
porque são mais fáceis de explicar em sala. As bibliotecas podem entrar quando os
formulários crescerem (cadastro de compra/produto).

## Requisitos

- Node.js 20+ (testado com Node 26) e npm
- Celular com **Expo Go** compatível com o SDK 58, ou emulador Android / simulador iOS,
  ou navegador (versão web)
- Python 3 (somente para regenerar as imagens das aulas)

## Instalação e execução

```bash
cd CompraCerta
npm install
npx expo start
```

No terminal do Expo: `a` abre no Android, `i` no iOS, `w` na web. No celular, leia o QR
Code com o Expo Go.

### Primeiro uso (depois da Aula 01)

1. Toque em **Criar conta** e cadastre nome, e-mail e senha (a conta fica só no aparelho).
2. Na aba **Perfil**, toque em **Carregar demonstração** para gerar compras fictícias.
3. Volte ao **Início**: total, quantidade, média, oportunidades e últimas compras vêm do SQLite.

Os dados de demonstração usam lojas com "(demo)" no nome, ficam marcados com
`is_demo = 1` no banco e aparecem com o selo **Demonstração**. O botão **Remover
demonstração** apaga só eles.

## Configuração

Não há variáveis de ambiente nem serviços externos. Arquivos relevantes:

- `app.json` — nome, `scheme`, plugins (`expo-router`, `expo-sqlite`, `expo-font`,
  `expo-splash-screen`) e cabeçalhos COOP/COEP exigidos pelo SQLite na web.
- `metro.config.js` — habilita arquivos `.wasm` (SQLite na web).
- `tsconfig.json` — atalho `@/` → `src/`.

## Estrutura de pastas

```
src/
  app/                     # telas (Expo Router) — CONSTRUÍDAS EM SALA
    _layout.tsx            # hoje: layout simples · Aula 01: fontes, banco e login
    index.tsx              # hoje: tela de boas-vindas · Aula 01: redirecionamento
    (auth)/                # Aula 01: login e cadastro
    (tabs)/                # Aula 01: abas, dashboard, compras, perfil...
  components/              # cada componente tem sua pasta:
    ui/                    #   Botao/index.tsx   → o componente (JSX e lógica)
      Botao/               #   Botao/estilos.ts  → o StyleSheet do componente
      CampoTexto/ ...      # Botao, CampoTexto, Logo, Tela, EstadoVazio, ...
    cards/                 # CartaoResumo, CartaoEconomia, ItemCompra
  database/
    migracoes.ts           # executa as migrações (PRAGMA user_version)
    migrations/            # SQL de cada versão do banco
    repositories/          # todas as consultas SQL ficam aqui
  services/                # regras de negócio (autenticação, economia, dashboard)
  hooks/                   # useAuth (contexto de sessão), useDashboard
  utils/                   # dinheiro, datas, validação, avisos
  theme/tema.ts            # cores, fontes, espaços e raios (design system)
  types/                   # tipos compartilhados
__tests__/                 # testes unitários
docs/                      # esquema do banco e regras do motor de preços
```

Pastas previstas na especificação que ainda não têm arquivos (`components/charts`,
`components/forms`, `services/fiscal`, `services/notifications`, `constants`) serão criadas
nas aulas em que forem usadas.

## Arquitetura

```
Tela (src/app)  →  hook (src/hooks)  →  serviço (src/services)  →  repositório (src/database/repositories)  →  SQLite
```

- **Telas** só cuidam de estado visual e chamam hooks/serviços. Nenhuma tela tem SQL.
- **Componentes** ficam em uma pasta própria: `index.tsx` com o componente e `estilos.ts`
  com o `StyleSheet`. O import continua curto: `import { Botao } from '@/components/ui/Botao'`.
- **Repositórios** concentram o SQL e convertem colunas (`total_cents`) em objetos em
  português (`totalCentavos`).
- **Serviços** guardam regras de negócio. `economia.ts` é uma função pura e testável.
- **Sessão**: `useAuth` guarda o usuário no contexto e o id dele em `app_settings`, para
  continuar logado ao reabrir o app.
- **Rotas protegidas**: `Stack.Protected` mostra `(auth)` só sem usuário e `(tabs)` só com
  usuário; ao entrar ou sair, a navegação muda sozinha.

## Banco de dados

Esquema completo em [`docs/schema.sql`](docs/schema.sql).

| Tabela | Conteúdo |
|---|---|
| `users` | nome, e-mail único, `password_hash` (`sal:hash`) |
| `app_settings` | chave/valor (ex.: usuário logado) |
| `stores` | estabelecimentos; `cnpj` único; `is_demo` |
| `purchases` | compra do usuário: loja, data, `total_cents`, `access_key` única (anti-duplicidade da NFC-e), `is_demo` |
| `purchase_items` | itens: descrição, quantidade, unidade, `unit_price_cents`, `total_cents` |

Regras:

- `PRAGMA foreign_keys = ON` a cada abertura.
- Dinheiro sempre em **centavos (INTEGER)**.
- `purchase_items` é apagado junto com a compra (`ON DELETE CASCADE`); uma loja com compras
  não pode ser apagada (`ON DELETE RESTRICT`).
- Migrações versionadas por `PRAGMA user_version`, cada uma dentro de uma transação. Para
  evoluir o banco, crie `migrations/002-....ts` e adicione na lista de `migracoes.ts`.

Tabelas da especificação planejadas para as próximas migrações: `products`,
`product_categories`, `product_aliases` (Aula 02), `fiscal_documents`, `taxes` (Aula 04),
`shopping_lists`, `shopping_list_items` (Aula 06), `price_history`, `price_insights`
(Aula 07), `notifications` (Aula 08). O `price_history` guardará cópias dos preços para que
excluir uma compra não apague o histórico de preços.

## Funcionalidades ao final da Aula 01

- **Login** com validação, mostrar/ocultar senha, erro de credenciais e "Esqueceu a
  senha?" (aviso explicando que a recuperação depende de servidor).
- **Cadastro** com nome, e-mail, senha e confirmação; impede e-mail repetido.
- **Dashboard**: saudação por horário, filtro Mês/Trimestre/Ano, total gasto, quantidade de
  compras, média por compra, botão para escanear nota, atalhos, oportunidades de economia
  e últimas compras — tudo calculado a partir do SQLite.
- **Compras**: lista das compras salvas.
- **Perfil**: dados do usuário, carregar/remover demonstração (com confirmação) e sair.
- Estados de carregamento, estados vazios e mensagens de erro.

## Autenticação (importante)

A autenticação é **local e demonstrativa**. As senhas não ficam em texto puro: são salvas
como `sal + SHA-256`. Isso **não substitui** uma autenticação de produção (que exigiria
servidor e um algoritmo próprio para senhas, como bcrypt ou argon2). Não há recuperação de
senha nesta versão.

## Testes

```bash
npm test             # roda todos os testes uma vez
npm run test:watch   # modo observação
npm run typecheck    # verificação de tipos
```

Cobertos hoje: motor de economia (faixas de confiança, agrupamento, mínimo de lojas,
ordenação), dinheiro em centavos, intervalos de período e validação dos formulários.

## Limitações conhecidas da integração NFC-e (Aula 04)

- O QR Code da NFC-e normalmente contém **só a URL de consulta** da SEFAZ (com chave de
  acesso e parâmetros), e não todos os dados fiscais.
- Cada UF tem portal e formato de consulta próprios. A leitura será feita por **adaptadores
  por UF**, identificando a UF pelos dígitos da chave de acesso.
- O app **não contorna** CAPTCHA, autenticação ou bloqueios dos portais. Quando a consulta
  automática falhar, o app guardará o que foi identificado (chave, UF, URL), avisará o
  usuário e permitirá cadastrar e corrigir os itens manualmente.
- A página HTML de consulta **não equivale** ao XML fiscal completo; tributos podem vir
  incompletos.
- Notas duplicadas serão bloqueadas pela coluna única `purchases.access_key`.

Nada disso está implementado ainda: a aba **Escanear** informa que a função chega na Aula 04.
