const getXPLimitByLevel = (level: number): number => {
  return Math.round(150 * level ** 1.1);
};

export default getXPLimitByLevel;
