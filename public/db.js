let db;
// db for a "budget" database.error
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    // create object store called pending and set autoIncrement to true
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
    store.clear();
    
};

request.onsuccess = function(event) {
    db = event.target.result;
// ensure app is online
if (navigator.online) {
    checkDatabase();

}
};

request.onerror = function(event) {
    console.log("hey!!! ${event.target.errorCode}");
};

function saveRecord(record) {
    //initiate transaction on pending db with readwrite access
    const transaction = db.transaction(['pending'], 'readwrite');

    // access your pending object store
    const store = transaction.objectStore('pending');

    // add record to your store with add method
    store.add(record);
}

function checkDatabase() {
    // open transaction on your pending database
    const transaction = db.transaction(['pending'], 'readwrite');
    
}