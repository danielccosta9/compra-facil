// Versão 3: itens da lista de compras passam a ter unidade (UN ou KG), igual aos itens da compra.
// Itens que já existiam ficam como UN, exceto os produtos que o usuário costuma comprar por KG.
export const migracao003 = `
ALTER TABLE shopping_list_items
  ADD COLUMN unit TEXT NOT NULL DEFAULT 'UN' CHECK (unit IN ('UN', 'KG'));

UPDATE shopping_list_items
   SET unit = 'KG'
 WHERE product_id IN (SELECT product_id FROM price_history WHERE unit = 'KG');
`;
