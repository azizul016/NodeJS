const fullName = "Azizul Haque";
const sayHi = (name) => {
  return `Hi ${name}`;
};

// //way one: we can one variabel export in this method, Last exporting variable can be seen after import'. Not Good Way
// module.exports = sayHi;
// module.exports = fullName;

// //way Two: We can get all variable value by this variable exporting method;
// module.exports.sayHi = sayHi;
// module.exports.fullName = fullName;

// way Three: I am using this method for easily handling exporting and importing;
module.exports = {
  sayHi,
  fullName,
};
