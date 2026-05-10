# StudyTracker - Proiect Cloud Computing

StudyTracker este o aplicație web dezvoltata pentru studenti, ce faciliteaza invatarea prin metode precum crearea de sarcini de studiu ("To-Dos"), sesiuni de studiu Pomodoro si asistenta pentru rezolvarea de probleme, oferita de un agent AI. 

Proiectul foloseste 2 servicii distincte in Cloud, care alimenteaza fluxul general de procesare si ajuta la procesarea datelor.

---

## Tehnologii Folosite
- **Front-End**: `JavaScript`, `React`, `Next.js` si `Taiwind CSS`.
- **Database-as-a-Service**: Baza de date NoSQL `MongoDB`, care stochează profilurile utilizatorilor criptate si sarcinile asociate.
- **AI-as-a-Service**: Apeluri care se fac către modelul open-source Qwen 2.5 7B Turbo, pentru a asista studentul in sesiunile de studiu.

---

## Securitate si Persistenta
Aplicația utilizeaza sistemul JWT (**JSON Web Tokens**). 
Indiferent de câte ori utilizatorul apasă butonul Refresh, acesta ramane conectat. Acest lucru a fost garantat prin folosirea `HTTP-only Cookies`, care refuză modificari din Front-End (JavaScript injection), actionând in browser doar cu aprobarea Serverului. De asemenea, parolele trimise bazei de date sunt criptate - ele sunt convertite total in hash-uri ireversibile, utilizând `bcryptjs`.

---

## Endpoint-uri Rute Interne
Fiind realizata complet in sistemul Next.js cu Backend propriu integrat sub directorul de **App Router API**, aplicația apeleaza singura functii catre Back-End, iar Front-End-ul doar le vede rezultatul:

### 1. Autentificare (`/app/api/auth`)
- **`POST /api/auth/register`**: Primește datele de autentificare. Criptează instant parola și creează o înregistrare în collection Cloud "users" de pe Mongo DB.
- **`POST /api/auth/login`**: Preia datele de autentificare. Daca datele corespund valid cu hash-ul extras din Cloud (MongoDB), sistemul generează un JWT secret si il introduce in request ca si Cookie persistent.
- **`GET /api/auth/me`**: Verifica cererile care vin cu format Cookie pentru a vedea dacă au un token valid. Returneaza datele despre utilizator. *(`POST /api/auth/me` golește si distruge token-ul cookie la Delogare).*

### 2. Gestionare Sarcini (`/app/api/todos`)
- **`GET /api/todos`**: Citește Cookie-ul clientului actual, extrage direct ID-ul, iar pe urmă accesează collection-ul MongoDb "todos", preluând doar array-urile asociate contului.
- **`POST /api/todos`**: Creează o sarcină nouă (ToDo) cu un string text valid și un boolean `completed: false` în collection-ul MongoDb.
- **`PUT /api/todos`**: Primeste ID-ul direct al task-ului ce se doreste actualizat, schimbandu-i starea boolean.
- **`DELETE /api/todos`**: Elimina definitiv entitatea din collection-ul MongoDb, folosind identificatorul de pe URL param.

### 3. Consilier Inteligent AI (`/app/api/chat`)
- **`POST /api/chat`**: Primeste mesajele de la utilizator si le trimite mai departe agentului AI extern prin apeluri HTTPS. Functia preia raspunsul si il expediaza catre Front-End, totul intr-un mod securizat.
