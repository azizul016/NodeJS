const { format } = require("date-fns");

const compareValues = (value1, value2) => {
  return value1 === value2 && "selected";
};

const trancateContent = (content, num) => {
  if (content.length < num) return content;
  return content.slice(0, num) + "...";
};

const displayBtn = (lValue, rValue) => {
  // console.log(rValue, "rValue");
  // console.log(lValue, "lValue,");
  // const value = rValue?._id.equals(lValue?.user?.id);
  // console.log(value, "treu");
  // return lValue.toString() === rValue.toString() ? "block" : "none";
  return rValue && rValue.equals(lValue) ? "block" : "none";
  // return rValue?._id.equals(lValue?.user?.id) ? "block" : "none";
};

const formatDate = (date, toFormat) => {
  // 'dd--MM-yyyy'
  return format(date && date, toFormat);
};

module.exports = {
  compareValues,
  trancateContent,
  displayBtn,
  formatDate,
};
