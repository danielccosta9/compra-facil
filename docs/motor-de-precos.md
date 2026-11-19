# Motor de preços — regras

Código: [`src/services/economia.ts`](../src/services/economia.ts) · Testes: [`__tests__/economia-test.ts`](../__tests__/economia-test.ts)

O serviço é uma **função pura** (não acessa banco nem tela). O repositório
`listarPrecosObservados` busca os preços no SQLite e o serviço apenas calcula.

## Versão atual (Aula 01) — oportunidades de economia

1. **Buscar** todos os preços unitários (`purchase_items.unit_price_cents`) do usuário,
   com o nome do estabelecimento.
2. **Agrupar por produto**, usando a descrição em maiúsculas e sem espaços nas pontas
   (`"arroz 5kg "` e `"ARROZ 5KG"` são o mesmo produto).
3. **Classificar a quantidade de observações**:

   | Registros | Nível                  | Mostra recomendação? |
   |-----------|------------------------|----------------------|
   | 1 a 2     | Dados insuficientes    | Não                  |
   | 3 a 4     | Tendência inicial      | Sim, com o rótulo    |
   | 5 a 9     | Evidência moderada     | Sim, com o rótulo    |
   | 10 ou mais| Histórico consistente  | Sim, com o rótulo    |

4. **Separar por estabelecimento** e calcular a média de cada um. São necessárias
   pelo menos **2 lojas** para comparar.
5. **Comparar** a loja de menor média com a média geral do produto:
   `economia % = (média geral − média da loja mais barata) / média geral × 100`.
6. **Descartar** diferenças menores que 2%.
7. **Ordenar** pela maior economia e devolver as 3 primeiras.

### Como o resultado é apresentado

- Sempre como **tendência do histórico pessoal**: "No seu histórico, saiu em média
  R$ X em Loja Y". Nunca como promessa de preço atual ou futuro.
- O nível de confiança e o número de registros aparecem junto da recomendação.
- Média histórica **não** é preço atual.

### Limitações conhecidas desta versão

- Compara apenas itens com a **mesma descrição** (mesma embalagem). Ainda não converte
  unidades (ex.: 5 kg × 1 kg) — isso entra na Aula 07 com `products`, `product_aliases`
  e normalização por unidade (R$/kg, R$/L).
- Ainda não calcula mediana, tendência temporal nem preço por dia da semana (Aula 07).

## Próximas regras (planejadas para a Aula 07)

- Preço normalizado: `preço ÷ (quantidade da embalagem convertida para kg, L ou unidade)`.
  Ex.: Arroz 5 kg por R$ 25,00 = R$ 5,00/kg; Arroz 1 kg por R$ 6,00 = R$ 6,00/kg.
- Indicadores: menor, maior, média, mediana, último preço pago, variação percentual,
  preço por estabelecimento e por dia da semana.
- Mesmas faixas de confiança da tabela acima para qualquer recomendação.
