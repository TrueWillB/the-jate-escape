import { openDB } from "idb";

const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      //I think I need to just only have it save in one database entry, and then just have it update that entry
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: false });
      console.log("jate database created");
    },
  });

// DONE: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  //open the connection to the database
  const db = await openDB("jate", 1);
  //open a transaction to the database, give it read and write access since this is a put operation
  const tx = db.transaction("jate", "readwrite");
  //open up the object store, in this case it is also named "jate" (which is very confusing for people like me who are trying to learn how this works)
  const store = tx.objectStore("jate");

  //This line checks if there is already an entry in the database, and if there is, it updates it. If there isn't, it creates a new entry
  //Doing this prevents the memory leak of eternally adding new entries to the database, rather than reusing the old one
  const request =
    (await store.count()) > 0
      ? await store.put({ text: content, id: 1 })
      : await store.add({ text: content, id: 1 });
  //we defined that request variable earlier so that we can use it to check if the operation was successful
  const result = request;
  //now I'm going to log it and see what comes out. Hopefully this works
  // console.log(`Here is the result of post:${result}`);
};

// DONE: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log("entering the get method");
  const db = await openDB("jate", 1);
  const tx = db.transaction("jate", "readonly");
  const store = tx.objectStore("jate");
  //store.get is very finicky so I am not touching it unless there is actually something in the database
  //I couldn't even get it to work with essentially this same statement in a ternary operator
  if ((await store.count()) > 0) {
    const request = await store.get(1);
    // console.log(request.text);
    const result = request.text;
    return result;
  } else {
    return null;
  }
};

initdb();
