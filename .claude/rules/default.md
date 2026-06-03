# Regras de Desenvolvimento

## Convenções de Código

### Comentários (PROIBIDO)

- **NÃO UTILIZE COMENTÁRIOS:** É expressamente proibido gerar, inserir ou manter comentários no código-fonte (seja inline `//`, em bloco `/* */` ou JSX `{/* */}`). O código deve ser limpo e autoexplicativo através da nomenclatura semântica de variáveis, componentes e funções.

### Geral

- Use TypeScript estrito. Nunca use `any` sem justificativa explícita em comentário.
- Prefira funções nomeadas a arrow functions em módulos de nível superior.
- Nomes de arquivos: `kebab-case.tsx` para componentes, `camelCase.ts` para utilitários.
- Nomes de componentes: PascalCase.

### Imports

- Use o alias `@/` para imports internos (nunca caminhos relativos como `../../`).
- Agrupe imports na ordem: React → Next.js → bibliotecas externas → `@/components` → `@/lib` → `@/types`.

### Componentes

- Cada componente em seu próprio arquivo dentro de `src/components/`.
- Componentes de UI reutilizáveis ficam em `src/components/ui/` (gerados pelo shadcn).
- Componentes de domínio ficam em `src/components/<domínio>/`.
- Props obrigatórias explícitas com tipos; evite `React.FC` — declare as props separadamente.

---

## Regras de UI e Design

### Transparência (CRÍTICO — não remover)

Todas as superfícies flutuantes da interface (modais, dialogs, drawers, sheets, popovers, menus) **devem manter 90% de opacidade** combinada com `backdrop-blur-sm`. Nunca use `opacity-100` ou fundo sólido nesses elementos.

Classes canônicas disponíveis em `globals.css`:

```css
.ui-surface-dark  /* bg-zinc-950/90 backdrop-blur-sm — modo escuro  */
.ui-surface-light /* bg-white/90   backdrop-blur-sm — modo claro   */
```

Ao criar ou customizar componentes do shadcn que envolvem `DialogContent`, `SheetContent`, `PopoverContent`, etc., aplique a classe correspondente.

### Tema

- Cor base: **zinc**
- Suporte obrigatório a modo claro e escuro via `next-themes`.
- Nunca fixe cores com valores hexadecimais ou RGB diretamente no JSX — use variáveis CSS do tema (`--background`, `--foreground`, etc.) ou classes Tailwind semânticas.

### Animações

- Use `motion` (Framer Motion) para animações de entrada e saída de elementos.
- Use `tw-animate-css` para utilitários de animação no Tailwind.
- Animações devem respeitar `prefers-reduced-motion`.

---

## Estrutura de Diretórios

```
src/
├── app/               # Rotas do App Router (layouts, pages, loading, error)
├── components/
│   ├── ui/            # Componentes shadcn/ui (não edite diretamente)
│   └── <domínio>/     # Componentes de feature/domínio
├── lib/               # Utilitários, configuração de auth, helpers
├── hooks/             # Custom hooks React
└── types/             # Tipos e interfaces TypeScript globais
```

---

## Dependências

- **Gerenciador de pacotes:** npm (obrigatório — não use pnpm ou yarn).
- Sempre instale com `npm install <pacote>` ou `npm install -D <pacote>` para devDependencies.
- Não instale pacotes duplicados que já existam via shadcn ou Radix UI.
- Verifique compatibilidade com React 19 antes de adicionar uma dependência nova.

---

## Commits (para desenvolvedores humanos)

- Mensagens de commit devem seguir o padrão **Conventional Commits** em **inglês**:
  - `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`
- Commits realizados pela IA (Claude) também serão em inglês.
- Escreva o corpo do commit quando a mudança não for óbvia pelo título.

---


