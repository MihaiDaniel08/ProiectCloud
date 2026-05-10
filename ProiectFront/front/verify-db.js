const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

const uri = process.env.NEXT_ATLAS_URI;
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db(process.env.NEXT_ATLAS_DATABASE);

        // Verificăm colecția 'users'
        const users = database.collection('users');
        const usersCount = await users.countDocuments();
        const allUsers = await users.find({}, { projection: { password: 0 } }).toArray();

        console.log(`\n=== RAPORT BAZA DE DATE ===`);
        console.log(`Baza de date conectata cu succes!`);
        console.log(`Numar de utilizatori inregistrati: ${usersCount}`);
        if (usersCount > 0) {
            console.log(`Lista utilizatori (fara parole):`);
            console.table(allUsers);
        } else {
            console.log(`Nu s-a înregistrat încă niciun utilizator. Încearcă să creezi un cont de pe pagina de Register!`);
        }

        // Verificăm colecția 'todos'
        const todos = database.collection('todos');
        const todosCount = await todos.countDocuments();
        console.log(`Numar total de sarcini (todos): ${todosCount}`);

        console.log(`===========================\n`);
    } catch (error) {
        console.error("Eroare la conectarea cu baza de date:", error);
    } finally {
        await client.close();
    }
}

run();
