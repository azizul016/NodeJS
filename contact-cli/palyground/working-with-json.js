// JSON: Javascript Object Notation
//use to exchange or transfer data;

const info = {
    firstName: 'John',
    secondName: 'Smith',
    age: 34
}

const newInfo = JSON.stringify(info)
console.log(JSON.parse(newInfo))
console.log(typeof JSON.parse(newInfo))

// console.log(JSON.stringify(info))
// console.log(typeof JSON.stringify(info))