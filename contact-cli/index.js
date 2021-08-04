const program = require("commander");
const validator = require("validator");
const colors = require("colors");
const { prompt } = require("inquirer");

const {
  addContact,
  isExistingContact,
  listContacts,
  deleteContact,
  readContact,
  updateContact,
} = require("./contact");

//add contact questions;
const addQuestions = [
  {
    type: "input",
    name: "firstName",
    message: "Type  Your First Name",
    validate(input) {
      if (!input) {
        console.log("Enter Your First Name".inverse.red);
      } else {
        return true;
      }
    },
  },
  {
    type: "input",
    name: "lastName",
    message: "Type  Your Last Name",
    validate(input) {
      if (!input) {
        console.log("Enter Your Last Name".inverse.red);
      } else {
        return true;
      }
    },
  },
  {
    type: "input",
    name: "email",
    message: "Type  Your email",
    async validate(input) {
      if (!input || !validator.isEmail(input)) {
        console.log("Enter Your Valid email".inverse.red);
      } else if (await isExistingContact(input)) {
        console.log("Contact already exists with this email".inverse.red);
      } else {
        return true;
      }
    },
  },
  {
    type: "list",
    name: "type",
    message: "Please Provide Type of Contact",
    choices: ["Personal", "Professional"],
  },
];

//update contact question
const updateQuestions = [
  {
    type: "input",
    name: "firstName",
    message: "Type  Your First Name",
  },
  {
    type: "input",
    name: "lastName",
    message: "Type  Your Last Name",
  },
  {
    type: "input",
    name: "email",
    message: "Type  Your email",
    async validate(input) {
      if (input && !validator.isEmail(input)) {
        console.log("Enter Your Valid email".inverse.red);
      } else {
        return true;
      }
    },
  },
  {
    type: "list",
    name: "type",
    message: "Please Provide Type of Contact",
    choices: ["Personal", "Professional"],
  },
];

//check by email or remove by email;
const checkEmailForQuestioning = [
  {
    type: "input",
    name: "email",
    message: "Type  Your email",
    async validate(input) {
      if (!input || !validator.isEmail(input)) {
        console.log("Enter Your Valid email".inverse.red);
      } else {
        return true;
      }
    },
  },
];

program.version("0.0.1");
program.description("A Contact Application Manage By Command Line");

//with out using question;
//add contacts
// program
//   .command("add")
//   .alias("a")
//   .description("Please Add a Contact")
//   .requiredOption("-f --firstName <fName>", "Type Your First Name")
//   .requiredOption("-l --lastName <lName>", "Type Your Last Name")
//   .requiredOption("-e --email <email>", "Type Your Email")
//   .option("-t --type <type>", "Type Your First Name", "Personal")
//   .action(({ firstName, lastName, email, type }) => {
//     const result = { firstName, lastName, email, type };
//     if (!validator.isEmail(email)) {
//       console.log("Please Privide Valid Email".inverse.red);
//     } else {
//       addContact(result, email);
//     }
//   });

//add contacts
program
  .command("add")
  .alias("a")
  .description("Please Add a Contact")
  .action(async () => {
    const contact = await prompt(addQuestions);
    await addContact(contact, contact?.email);
  });

//read all contacts
program
  .command("list")
  .alias("l")
  .description("See All Contacts")
  .action(async () => {
    await listContacts();
  });

//delete a contact
// program
//   .command("delete")
//   .alias("d")
//   .description("Remove a Contact")
//   .requiredOption("-e --email <email>", "Type Your Email")
//   .action(async (email) => {
//     await deleteContact(email.email);
//   });

program
  .command("delete")
  .alias("d")
  .description("Remove a Contact")
  .action(async () => {
    const removingQuestion = await prompt(checkEmailForQuestioning);
    await deleteContact(removingQuestion.email);
  });

//read single constact
program
  .command("read")
  .alias("r")
  .description("Read a Contact")
  .action(async () => {
    const checkingByEmail = await prompt(checkEmailForQuestioning);
    await readContact(checkingByEmail.email);
  });

//update constact
program
  .command("update")
  .alias("u")
  .description("Update a Contact")
  .action(async () => {
    const checkingByEmail = await prompt(checkEmailForQuestioning);
    const contact = await isExistingContact(checkingByEmail.email);
    if (contact) {
      const updatingContactData = await prompt(updateQuestions);
      await updateContact(updatingContactData, checkingByEmail.email);
    } else {
      console.log("Contact Not Found".inverse.red);
    }
  });

if (!process.argv[2]) {
  program.help();
}

program.parse(process.argv);
