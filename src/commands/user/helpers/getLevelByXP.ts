// * Helpers
import getXPLimitByLevel from "./getXPLimitByLevel";

const getLevelByXP = (_xp: number) => {
  let xp = _xp;
  let level = 0;

  while (xp >= getXPLimitByLevel(level + 1)) level += 1;
  xp -= getXPLimitByLevel(level);

  return { xp, level, nextXP: getXPLimitByLevel(level + 1) };
};

export default getLevelByXP;
