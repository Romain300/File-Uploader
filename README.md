# 📁 File Uploader
(demo here: https://file-uploader-production-1999.up.railway.app/)

A full-featured Node.js web application that allows users to upload, organize, and share files via secure, expirable links. Built using Express.js, PostgreSQL (via Prisma), and Cloudinary for file storage.

---

## 🚀 Features

- 🔐 User authentication (Passport.js + bcrypt)
- 📂 Folder creation, renaming, and deletion
- 📄 Upload files to Cloudinary (supports images and raw files)
- 🔗 Generate expirable shareable links for folders
- 🧠 Session persistence with PostgreSQL
- 🌐 Server-rendered pages via EJS

---

## 📦 Project Info

- **Name**: `file-uploader`
- **Version**: 1.0.0
- **Entry Point**: `app.js` *(not `index.js`)*
- **License**: ISC

---

## 🧱 Tech Stack

- **Backend**: Node.js, Express.js
- **Auth**: Passport.js + bcryptjs
- **Database**: PostgreSQL via Prisma
- **Templating**: EJS
- **Sessions**: express-session + connect-pg-simple
- **Cloud Storage**: Cloudinary
- **Unique Token Generator**: NanoID
- **File Upload Handling**: Multer

---

## 📁 Folder Structure

```
File-Uploader/
├── app.js                   # Main server logic
├── db/
│   ├── client.js            # Prisma client setup
│   └── queries.js           # All DB and Cloudinary logic
├── routes/                  # Modular route handlers
├── views/                   # EJS templates
├── public/                  # Static assets
├── prisma/
│   └── schema.prisma        # Database schema
├── package.json
└── .env
```

---

## ⚙️ Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/File-Uploader.git
cd File-Uploader
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create .env File

```env
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### 4. Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
```

(Optional: Open DB in browser)

```bash
npx prisma studio
```

### 5. Run the App

```bash
node app.js
# or for development:
npx nodemon app.js
```

---

## 🗃️ Prisma Database Schema

```prisma
model User {
  id       Int      @id @default(autoincrement())
  name     String 
  email    String   @unique
  password String
  folders  Folder[]
  files    File[]
}

model Folder {
  id          Int     @id @default(autoincrement())
  name        String  
  author      User    @relation(fields: [authorId], references: [id])
  authorId    Int  
  files       File[]
  shareLinks  shareLink[]
}

model File {
  id           Int       @id @default(autoincrement())
  name         String    
  uploadAt     DateTime  @default(now()) 
  author       User      @relation(fields: [authorId], references: [id])
  authorId     Int
  folder       Folder    @relation(fields: [folderId], references: [id])
  folderId     Int
  url          String
  public_id    String
  resourceType String
}

model shareLink {
  id        Int       @id @default(autoincrement())
  token     String    @unique
  folder    Folder    @relation(fields: [folderId], references: [id])
  folderId  Int
  createAt  DateTime  @default(now())
  expiresAt DateTime 
  revoked   Boolean   @default(false)
}
```

---

## 🔌 Key Routes

### Auth

- `GET /signIn` → Sign-up page
- `POST /signIn` → Create user
- `GET /logIn` → Login form
- `POST /logIn` → Log in
- `GET /logOut` → Log out

### File/Folder

- `POST /createFolder` → Create folder
- `POST /uploadFile` → Upload file
- `POST /deleteFile` → Delete file
- `POST /deleteFolder` → Delete folder
- `POST /share/create` → Create shareable link
- `GET /share/:token` → Access shared folder

### General

- `GET /folder/:folderName` → View folder
- `GET /` → Homepage

---

## 📦 Scripts

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

You can add custom scripts like:

```json
"start": "node app.js",
"dev": "nodemon app.js",
"migrate": "npx prisma migrate dev",
"studio": "npx prisma studio"
```

---

## 📤 Deployment Tips

- Add `.env` variables in your host (e.g., Railway, Render)
- Ensure PostgreSQL and Cloudinary are set up
- Consider using HTTPS + CORS policies in production
- Optionally use reverse proxy (e.g., Nginx)

---

## 📝 License

ISC License — you may freely use and adapt this project.

---

## 🙌 Credits

- Prisma
- Cloudinary
- Passport.js
- EJS
- NanoID