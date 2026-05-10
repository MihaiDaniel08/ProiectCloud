# StudyTracker - Proiect Cloud Computing

StudyTracker este o aplicație web utilitară dezvoltată special pentru studenți, ce facilitează învățarea prin unelte simple precum listarea sarcinilor de studiu ("To-Dos"), sesiuni controlate de timp (Pomodoro Timer) și asistență avansată pentru rezolvarea de probleme tehnice, oferită de un consilier AI. 

Proiectul folosește nativ **minim 2 servicii distincte în Cloud**, care alimentează fluxul general de procesare și stocare pentru toți utilizatorii în mod descentralizat.

---

## 🛠 Tehnologii Folosite
- **Front-End**: `JavaScript`, `React`, `Next.js 14+ (App Router)` și `Taiwind CSS`.
- **Serviciul Cloud 1 (Database-as-a-Service)**: Baza de date NoSQL `MongoDB` (găzduită global prin platforma MongoDB Atlas), care stochează cu o viteză extraordinară profilurile utilizatorilor criptate și sarcinile asociate.
- **Serviciul Cloud 2 (AI-as-a-Service)**: Rețeaua Serverless din platforma `Together AI`, care folosește interfața HTTP pentru a da viață consilierului nostru intelectual. Intervențiile tehnice rapide sunt livrate prin rețea de micro-containere pe baza modelului open-source ultra-performant *Qwen 2.5 7B Turbo*.

---

## 🔐 Securitate și Persistență
Aplicația abordează cele mai noi tehnici de retenție. La baza sa logică folosește sistemul de jetoane de acces (**JSON Web Tokens - JWT**). 
Indiferent de câte ori utilizatorul apasă butonul Refresh, starea sa "conectată" nu se pierde. Acest lucru a fost garantat injectând jetonul într-un format protejat denumit `HTTP-only Cookies` care refuză intervenția din Front-End (JavaScript inject), acționând natural în browser doar cu aprobarea Serverului. De asemenea, conform normelor moderne, parolele trimise bazei de date nu suportă citire clară - ele sunt convertite total în hash-uri ireversibile via `bcryptjs`.

---

## 🔌 Endpoint-uri Rute Interne
Fiind realizată complet în sistemul Next.js cu backend propriu integrat sub directorul de **App Router API**, aplicația apelează singură funcții de siguranță sub deviza Back-End, pe care clientul doar le vede rezultatul:

### 1. Autentificare (`/app/api/auth`)
- **`POST /api/auth/register`**: Primește structura `{ nume, email, parola }`. Criptează instant parola și creează o înregistrare în colecția Cloud "users" de pe Mongo DB.
- **`POST /api/auth/login`**: Preia un cont și o parolă clară. Dacă parola corespunde valid cu hash-ul extras din Cloud (MongoDB), generează jetonul JWT secret și îl lipește de răspuns ca și Cookie persistent.
- **`GET /api/auth/me`**: Endpoint vital pe post de verificare tăcută; va scana cererile care vin cu format Cookie ca să vadă dacă au o cheltuială valabilă de timp (vezi 7 zile). Întoarce numele, mail-ul și starea tokenului pentru a rula aplicația interioară. *(`POST /api/auth/me` golește și distruge token-ul cookie la Delogare).*

### 2. Gestionare Sarcini (`/app/api/todos`)
- **`GET /api/todos`**: Citește jetonul Cookie al clientului actual, extrage direct ID-ul, iar pe urmă contactează colecția MongoDb "todos", cerând doar array-urile asociate contului.
- **`POST /api/todos`**: Creează un pachet nou ToDo cu un string text valid și un boolean `completed: false` în baza de date. 
- **`PUT /api/todos`**: Primește un ID direct al task-ului ce se dorește actualizat, schimbându-i starea boolean (fie a fost completat, fie s-a renunțat).
- **`DELETE /api/todos`**: Elimină iremediabil entitatea din baza de date folosind identificatorul de pe URL param.

### 3. Consilier Inteligent AI (`/app/api/chat`)
- **`POST /api/chat`**: Extrem de esențial întrucât funcționează ca un proxy bridge, pentru a evita să facem expunerea credențialelor sau cheilor "Together API Key" în browser (un lucru extrem de nerecomandat în cloud development). Primește un array cu roluri de la browser (`user`) și le asamblează împreună cu rolul de context sistem (`system`); apoi expediază payload-ul sigur direct către API-urile externe pe HTTPS ca să răspundă la mesajele studentului.
