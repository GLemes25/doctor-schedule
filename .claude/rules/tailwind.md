# Regras de Tailwind CSS

## Valores Arbitrários (Arbitrary Values)

### Espaçamento e Tamanho

- **NUNCA** use valores arbitrários em pixels para utilitários de espaçamento e tamanho (`w-`, `h-`, `min-h-`, `max-h-`, `min-w-`, `max-w-`, `p-`, `m-`, `gap-`, `top-`, `left-`, etc.) quando o valor for um múltiplo de 4px.
- **SEMPRE** converta para o token equivalente da escala do Tailwind (`1 unidade = 0.25rem = 4px`).

Tabela de conversão:

| Valor arbitrário | Token Tailwind |
|-----------------|----------------|
| `[16px]` | `4` |
| `[24px]` | `6` |
| `[32px]` | `8` |
| `[40px]` | `10` |
| `[48px]` | `12` |
| `[52px]` | `13` |
| `[56px]` | `14` |
| `[64px]` | `16` |
| `[72px]` | `18` |
| `[80px]` | `20` |
| `[96px]` | `24` |
| `[100px]` | `25` |
| `[120px]` | `30` |
| `[140px]` | `35` |
| `[160px]` | `40` |
| `[180px]` | `45` |
| `[200px]` | `50` |
| `[220px]` | `55` |
| `[240px]` | `60` |
| `[400px]` | `100` |
| `[480px]` | `120` |
| `[720px]` | `180` |
| `[800px]` | `200` |
| `[900px]` | `225` |
| `[960px]` | `240` |
| `[1100px]` | `275` |

Valores fracionários também são válidos em Tailwind v4 (ex: `[14px]` → `3.5`, `[10px]` → `2.5`).

### Opacidade Modificadora

- **NUNCA** use opacidade arbitrária decimal na sintaxe `/[0.X]`.
- **SEMPRE** use a sintaxe de porcentagem inteira: `/[0.08]` → `/8`, `/[0.02]` → `/2`, `/[0.04]` → `/4`.

### O Que NÃO Alterar

- `rounded-[...]` — border-radius usa escala semântica (`rounded-sm`, `rounded-lg`, `rounded-xl`, etc.).
- `z-[...]` — z-index não segue a escala de espaçamento.
- `tracking-[...]` — letter-spacing usa valores de design específicos.
- `text-[Npx]` — tamanhos de fonte usam escala semântica (`text-sm`, `text-base`, `text-xl`, etc.).
- `backdrop-blur-[...]` — blur não segue a escala de espaçamento.
- `bg-[radial-gradient(...)]` — valores de CSS complexos, não são medidas.
- `grid-cols-[...]` — templates de grid usam valores CSS livres.
- `h-[calc(...)]` — expressões calc devem ser mantidas como estão.
- `max-h-[NNvh]` — unidades viewport (`vh`, `vw`, `%`) devem permanecer arbitrárias.
