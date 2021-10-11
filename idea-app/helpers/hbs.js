const { format } = require("date-fns");

//not working

// const compareValues = (value1, value2, value3) => {
//   console.log(value1, value2, value3, "values");
//   switch (value3) {
//     case "select":
//       value1 === value2 && "selected";
//       break;

//     case "path":
//       value1 === value2 && "active";
//       break;

//     case "btn":
//       // rValue && rValue.equals(lValue) ? "block" : "none";
//       break;

//     default:
//       break;
//   }
// };

//for active menu
const comparePath = (lPath, rPath) => {
  console.log(lPath, rPath, "path");
  return lPath === rPath && "active";
};

// selected for new and edit page in dropdown
const compareValues = (value1, value2) => {
  // console.log(value1, value2, "for value check");
  return value1 === value2 && "selected";
};

const trancateContent = (content, num) => {
  // console.log(content.length, num, "for content check");
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

const comparePaginationPageValue = (value1, value2) => {
  return value1 !== value2;
};

module.exports = {
  compareValues,
  trancateContent,
  displayBtn,
  formatDate,
  comparePath,
  compareValues,
  comparePaginationPageValue,
};
