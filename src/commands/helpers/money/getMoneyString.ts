const getMoneyString = (money: number): string => {
  let text = "";

  const pp = Math.floor(money / 1000000);
  const po = Math.floor((money - pp * 1000000) / 10000);
  const pa = Math.floor((money - pp * 1000000 - po * 10000) / 100);
  const pc = Math.floor(money - pp * 1000000 - po * 10000 - pa * 100);

  if (pp > 0)
    text =
      pp > 1
        ? text.concat(`**${pp}** pièces de Platine`)
        : text.concat(`**${pp}** pièce de Platine`);

  if (pp > 0 && (po > 0 || pa > 0 || pc > 0)) text = text.concat(` & `);

  if (po > 0)
    text =
      po > 1
        ? text.concat(`**${po}** pièces d'Or`)
        : text.concat(`**${po}** pièce d'Or`);

  if (po > 0 && (pa > 0 || pc > 0)) text = text.concat(` & `);

  if (pa > 0)
    text =
      pa > 1
        ? text.concat(`**${pa}** pièces d'Argent`)
        : text.concat(`**${pa}** pièce d'Argent`);

  if (pa > 0 && pc > 0) text = text.concat(` & `);

  if (pc > 0)
    text =
      pc > 1
        ? text.concat(`**${pc}** pièces de Cuivre`)
        : text.concat(`**${pc}** pièce de Cuivre`);

  if (!pp && !po && !pa && !pc) text = "aucune pièce";

  return text;
};

export default getMoneyString;
