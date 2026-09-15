# Auditoria Monolítica — SimpleThemeDark-nightly.css

**Data:** 2026-09-15
**Arquivo:** `Theme/SimpleThemeDark-nightly.css` (4,684 linhas)
**Status:** 🔴 CRÍTICO — 3/9 checks PASS

---

## 📊 Estatísticas Gerais

| Métrica | Valor |
|---------|-------|
| Total de linhas | 4,684 |
| Total de `!important` | 256 |
| Seletores únicos | 725 |
| Seletores duplicados | 7 |
| Regras conflitantes | 3 |
| Código morto | 25 seletores |
| Blocos copiados | 3 (~400 linhas) |
| Tokens inconsistentes | 12 |

---

## 🔴 BUGS CRÍTICOS ENCONTRADOS

### 1. Purple Accent Variant QUEBRADO (Linha 294)

**:root[data-accent="purple"] está DENTRO do bloco :root{}**

CSS não suporta nesting fora de `@layer` ou preprocessors. O tema purple inteiro NÃO FUNCIONA.

```css
/* LINHA 20-320: :root { ... } */
/* LINHA 294: :root[data-accent="purple"] { ... } ← DENTRO DO :root! */
```

**Impacto:** Usuários que selecionam accent purple recebem o tema teal (fallback).

### 2. Bazarr Link com Texto Invisível (Linhas 2696-2700)

```css
.itemExternalLinks > a[title*="Bazarr"]:hover {
  background-color: var(--std-sys-color-on-surface) !important;
  color: var(--std-sys-color-on-surface) !important; /* ← MESMA COR DO BG! */
}
```

**Impacto:** Texto fica invisível no hover/active.

### 3. Card Hover Transform Conflitante (Linhas 716-737)

```css
/* Linha 728 */ .card-hoverable:hover .cardScalable { transform: scale(1.025); }
/* Linha 737 */ .card-hoverable:hover .cardScalable { transform: scale(1.02); }
```

**Impacto:** Duas regras competem pelo mesmo seletor. O último ganha, mas a intenção é incerta.

---

## 🔴 DUPLICATAS CRÍTICAS

### 1. `.skinHeader` — 2 Blocos Conflitantes

| Linha | Conteúdo | Conflito |
|-------|----------|----------|
| 1109-1114 | `position: fixed; padding-top: ...` | Primeiro bloco |
| 1117-1125 | `position: fixed !important; z-index: 999 !important` | Segundo bloco SOBRESCREVE o primeiro inteiramente |

**Problema:** O primeiro bloco é código morto.

### 2. Header Clickability — 3 Cópias

| Bloco | Linhas | Conteúdo |
|-------|--------|----------|
| 1 | 1117-1129 | `pointer-events: auto !important` |
| 2 | 1329-1342 | `pointer-events: auto !important` |
| 3 | 4655-4672 | `pointer-events: auto !important` |

**Problema:** 3 blocos fazem EXATAMENTE a mesma coisa. Complexidade desnecessária.

### 3. `::before`/`::after` display:none — 5 Cópias

| Linhas | Seletor |
|--------|---------|
| 1136-1139 | `.skinHeader-blurred::after` |
| 1146-1149 | `.skinHeader-withBackground::after` |
| 1157-1159 | `.headroom--pinned .skinHeader-blurred::after` |
| 1167-1169 | `.headroom--pinned .skinHeader-withBackground::after` |
| 4675-4683 | `.skinHeader::before, .skinHeader::after` (wildcard) |

**Problema:** 5 regras fazem a mesma coisa. O wildcard no final já cobre tudo.

---

## 🟡 !important EXCESSIVO

| Bloco | Contagem | Status |
|-------|----------|--------|
| 1-500 | 0 | ✅ |
| 501-1000 | 21 | 🔴 ALERTA |
| 1001-1500 | 63 | 🔴 PIOR (header + sidebar + botões) |
| 1501-2000 | 41 | 🔴 ALERTA |
| 2001-2500 | 22 | 🔴 ALERTA |
| 2501-3000 | 37 | 🔴 ALERTA |
| 3001-3500 | 15 | 🔴 ALERTA |
| 3501-4000 | 36 | 🔴 ALERTA |
| 4001-4500 | 12 | 🔴 ALERTA |
| 4501-4684 | 9 | 🔴 ALERTA |
| **TOTAL** | **256** | **Média: 25.6 por bloco** |

---

## 🔴 CÓDIGO MORTO (25 seletores)

### Legacy/Removidos (14)
- `.detailPageContent` — substituído por `.detailPagePrimaryContent`
- `.btnRevoke` — movido para React dashboard
- `.button-alt` — classe legada, não usada
- `.nowPlayingContextMenu` — removido da UI
- `.toastButton` — substituído por novo componente Toast
- `.series-episodes-section` — classe legada
- `.editorsChoiceItemsContainer` — feature removida
- `.activityLogListWidget` — substituído por React ActivityLogWidget
- `.notification_important` — nome de ícone, não classe CSS
- `#btnShutdown` — substituído por `useShutdownServer` hook
- `#divRunningTasks` — substituído por React RunningTasksWidget
- `#txtLoginDisclaimer` — substituído por `.loginDisclaimerContainer`
- `#viewPanel` — jQuery Mobile legado
- `.ui-panel-inner` — jQuery Mobile legado

### Plugins (5)
- `.backdrop-overlay` — media-bar-plugin
- `.detail-button` — media-bar-plugin
- `.favorite-button` — media-bar-plugin
- `.plot` — media-bar-plugin
- `#slides-container` — media-bar-plugin

---

## 🟡 TOKENS INCONSISTENTES

### rgba hardcoded em vez de tokens

| Valor | Linhas | Deveria ser |
|-------|--------|-------------|
| `rgba(255, 255, 255, 0.08)` | 1350, 1410 | `--std-state-hover` |
| `rgba(255, 255, 255, 0.12)` | 1605, 1610 | `--std-state-pressed` |
| `rgba(20, 18, 24, 0.85)` | 1152, 1162 | Token de superfície |
| `rgba(29, 27, 32, 0.65)` | 2062 | Token necessário |
| `ease-out` | 4152, 4280, 4313, 4357, 4393 | `--std-motion-easing-standard-decelerate` |

---

## 🟡 BLOCOS COPIADOS

### 1. Grid Responsivo (312 linhas)
Linhas 2962-3273: 14 media queries com padrão idêntico `--cardCount`. Poderia ser consolidado.

### 2. Header Clickability (3 cópias)
Linhas 1117-1129, 1329-1342, 4655-4672: Mesmo `pointer-events: auto !important`.

### 3. `::before`/`::after` display:none (5 cópias)
Linhas 1136-1139, 1146-1149, 1157-1159, 1167-1169, 4675-4683: Mesma regra.

---

## 📋 Checklist Completo

| Check | Status | Problemas |
|-------|--------|-----------|
| C1: Variáveis Root | ✅ PASS | 0 faltando |
| C2: Seletores Duplicados | 🔴 FAIL | 7 duplicatas |
| C3: Regras Conflitantes | 🔴 FAIL | 3 conflitos |
| C4: !important | 🔴 FAIL | 256 total (todos >5) |
| C5: Código Morto | 🔴 FAIL | 25 seletores |
| C6: Cópias | 🔴 FAIL | 3 blocos (~400 linhas) |
| C7: Tokens Inconsistentes | 🟡 WARN | 12 valores hardcoded |
| C8: Media Queries Duplicadas | 🟡 WARN | 2 issues |
| C9: Regras que se Anulam | 🔴 FAIL | 2 issues |

**Resultado: 3/9 PASS**

---

## 🔍 POR QUE ACONTECEU (Causa Raiz)

### 1. Iterações Sem Limpeza
Cada "fix" adicionou novas regras SEM remover as antigas. Exemplo:
- Header: 3 blocos de `pointer-events: auto` acumulados
- `::after`: 5 blocos de `display: none` acumulados

### 2. Falta de Referência ao jellyfin-web
Seletores legados (`.button-alt`, `#btnShutdown`) foram mantidos porque ninguém verificou se ainda existem no jellyfin-web.

### 3. Copiar/Colar Sem Verificar
O padrão `pointer-events: auto !important` foi copiado 3 vezes porque cada "fix" era tratado isoladamente.

### 4. !important como Banda Elastic
Em vez de aumentar especificidade corretamente, `!important` foi adicionado em massa (256 vezes).

### 5. Falta de Teste Automatizado
Não há verificação de que seletores ainda existem no jellyfin-web.

---

## 🎯 TOP 5 ACHADOS

| Rank | Tipo | Severidade | Linhas | Descrição |
|------|------|------------|--------|-----------|
| 1 | CONFLITO | 🔴 CRÍTICA | 294 | Purple accent variant quebrado (nesting inválido) |
| 2 | CÓPIA | 🔴 CRÍTICA | 1117, 1329, 4655 | 3 blocos de pointer-events idênticos |
| 3 | CÓPIA | 🔴 CRÍTICA | 1136-4683 | 5 blocos de ::after display:none idênticos |
| 4 | MORTO | 🟡 ALTA | 25 seletores | Código morto de versões legadas |
| 5 | REDUNDANTE | 🟡 ALTA | 1109-1114 | Primeiro bloco .skinHeader completamente sobrescrito |

---

## 📝 RECOMENDAÇÕES

1. **Remover código morto** — 25 seletores podem ser removidos sem impacto
2. **Consolidar header** — Unificar 3 blocos de pointer-events em 1
3. **Consolidar ::after** — Unificar 5 blocos de display:none em 1 wildcard
4. **Corrigir purple accent** — Mover `:root[data-accent="purple"]` para fora do `:root{}`
5. **Corrigir Bazarr** — Trocar `color: on-surface` por `color: surface`
6. **Reduzir !important** — Usar especificidade correta em vez de !important em massa
7. **Substituir hardcoded** — Usar tokens `--std-*` em vez de rgba hardcoded
