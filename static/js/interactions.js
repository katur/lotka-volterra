var constants = require("./constants.js");


module.exports = {
  /**
   * Have seat x and seat y interact.
   *
   * For each colony engaged in an interaction (x, y, or both),
   * the colony is temporarily changed to a herd or pack,
   * based on the outcome of a fair coin flip.
   *
   * From there, the type of interaction depends on the types of x and y
   * (the cases include two herds, two packs, one of each).
   */
  interact: function(x, y) {
    // If x or y is a colony, set temporarily to a pack or herd
    xWasColony = x.changeGroupIfColony();
    yWasColony = y.changeGroupIfColony();

    // Now the interaction falls into 4 cases
    if (x.isHerd() && y.isHerd()) {
      x.increasePopulation(constants.GROWTH_RATE);
      y.increasePopulation(constants.GROWTH_RATE);
    } else if (x.isPack() && y.isPack()) {
      x.decreasePopulation(constants.GROWTH_RATE);
      y.decreasePopulation(constants.GROWTH_RATE);
    } else if (x.isPack()) {
      compete(pack=x, herd=y);
    } else {
      compete(pack=y, herd=x);
    }

    // Restore colonies
    if (xWasColony) {
      x.setToColony();
    }

    if (yWasColony) {
      y.setToColony();
    }
  }
};


/***********
 * Helpers *
 ***********/

/**
 * Have a pack and a herd compete.
 *
 * A competition involves a coin flip weighted in favor of the predator,
 * followed by population increase for the winner and population decline
 * for the loser.
 */
function compete(pack, herd) {
  f = constants.Coin.flip(constants.COMPETITIVE_COIN_WEIGHT);

  if (f === constants.Coin.HEADS) {
    pack.increasePopulation(constants.GROWTH_RATE * 2);
    herd.decreasePopulation(constants.GROWTH_RATE * 2);
  } else {
    pack.decreasePopulation(constants.GROWTH_RATE);
    herd.increasePopulation(constants.GROWTH_RATE);
  }
}
