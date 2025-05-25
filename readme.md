# 🧩 Monorepo Project

โครงสร้างโปรเจกต์แบบ **Monorepo** ที่ประกอบด้วย:

- **Frontend**: [Next.js](https://nextjs.org/) + [Tailwind CSS](https://tailwindcss.com/) + [React Hook Form](https://react-hook-form.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: [Elysia](https://elysiajs.com/) + [better-auth](https://github.com/SaltyAom/better-auth)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (ผ่าน Docker)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Runtime**: [Bun](https://bun.sh/)

---

## 🚀 เริ่มต้นใช้งาน

### 1. Clone Repo

```bash
git clone <repo-url>

cd <project-folder>

bun install
```

#### 2. Seed Database

```bash
cd apps/api/ && bun run db:reset && cd ../..
```

##### for prodution

```bash
docker compose -f 'docker-compose.yml' up -d --build
```

##### Frontend

```bash
http://localhost:3000
```

##### Backend

```bash
http://localhost:3001/
```

##### Data For login

```
 {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'password123',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    password: 'password123',
  },
```

```bash
#Scripts
"postinstall": "prisma generate",
"dev": "bun run --watch src/index.ts",
"build": "bun run ./build.ts",
"lint": "eslint . --ext .ts --max-warnings=0",
"clean": "rm -rf dist",
"db:validate": "prisma validate",
"db:generate": "prisma generate",
"db:migrate": "prisma migrate dev --skip-seed",
"db:deploy": "prisma migrate deploy",
"db:reset": "prisma migrate reset --force",
"db:rollback": "prisma migrate resolve --rolled-back \"$(read -p 'Enter migration name: ' name && echo $name)\"",
"db:seed": "prisma db seed",
"db:studio": "prisma studio"
```

````

##### API Document

```bash
http://localhost:3001/docs
````

<img width="1437" alt="Screenshot 2568-05-25 at 03 24 33" src="https://github.com/user-attachments/assets/912f0636-88cd-46dc-956d-30d8193eeb73" />
