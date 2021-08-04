const fs = require("fs");
const util = require("util");
const path = require("path");

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

//json file path
const jsonFIlePath = path.join(__dirname, "contacts.json");

//adding contact in json file
const addContact = async (contact, email) => {
  const contacts = await loadContacts();
  const existingContact = await isExistingContact(email);
  if (existingContact) {
    console.log("Contact already exists".inverse.red);
  } else {
    contacts.push(contact);
    await saveContact(contacts);
    console.log("Contact Successfully Added".inverse.green);
  }
};

//show all contacts;
const listContacts = async () => {
  const contacts = await loadContacts();
  if (contacts.length > 0) {
    console.log("All Contact".inverse.green);
    console.log(contacts);
  } else {
    console.log("No Contact Found, Please Create One".inverse.green);
    console.log(contacts);
  }
};

//show single contact;
const readContact = async (email) => {
  const contact = await isExistingContact(email);
  if (!contact) {
    console.log("Contact Not Found".inverse.red);
  } else {
    console.log("Contact Found".inverse.green);
    console.log(contact);
  }
};

//removing a contact;
const deleteContact = async (email) => {
  const contacts = await loadContacts();
  const contact = await isExistingContact(email);
  if (!contact) {
    console.log("Contact Not Found".inverse.red);
  } else {
    const updatedContact = contacts.filter(
      (contact) => contact.email !== email
    );
    await saveContact(updatedContact);
    console.log("Contact Successfully Removed".inverse.green);
  }
};

//update contact;
const updateContact = async (updatedData, email) => {
  const contacts = await loadContacts();
  const { firstName, lastName, email: inputEmail, type } = updatedData;

  //made updated payload
  const updatedContactValue = {
    firstName: firstName ? firstName : contact.firstName,
    lastName: lastName ? lastName : contact.lastName,
    email: inputEmail ? inputEmail : contact.email,
    type,
  };

  //update contact;
  const contactWithUpdate = contacts.map((contact) =>
    contact.email.trim().toLowerCase() === email.trim().toLowerCase()
      ? (contact = updatedContactValue)
      : contact
  );

  //saving updated contact
  await saveContact(contactWithUpdate);
  console.log("Updated Successfully".inverse.green);

  console.log(updatedData, email);
};

//load all contacts
const loadContacts = async () => {
  try {
    //check if the contact exist
    const dataBuffer = await readFilePromise(jsonFIlePath);
    const dataJson = dataBuffer.toString();
    return JSON.parse(dataJson);
  } catch (error) {
    //no contact exist
    return [];
  }
};

//save contact
const saveContact = async (contacts) => {
  const contactJson = JSON.stringify(contacts);
  return await writeFilePromise(jsonFIlePath, contactJson);
};

//check existing contact
const isExistingContact = async (email) => {
  const contacts = await loadContacts();
  return await contacts.find(
    (eachContact) =>
      eachContact.email.trim().toLowerCase() === email.trim().toLowerCase()
  );
};

module.exports = {
  addContact,
  isExistingContact,
  listContacts,
  deleteContact,
  readContact,
  updateContact,
};
