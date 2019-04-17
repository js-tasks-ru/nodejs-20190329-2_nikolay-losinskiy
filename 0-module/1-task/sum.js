function sum(a, b) {
  if (!isNumeric(a) || !isNumeric(b)) {
    throw new TypeError('TypeError');
  }

  return a + b;
}

function isNumeric(num) {
  return isFinite(num) && !isNaN(parseFloat(num));
}

module.exports = sum;
