const compareValues = (value1, value2) => {
  return value1 === value2 && "selected";
};

const trancateContent = (content, num) => {
  if (content.length < num) return content;
  return content.slice(0, num) + "...";
};

const displayBtn = (lValue, rValue) => {
  console.log(lValue, rValue, "afa");
  return lValue.equals(rValue) ? "block" : "none";
};

module.exports = {
  compareValues,
  trancateContent,
  displayBtn,
};
