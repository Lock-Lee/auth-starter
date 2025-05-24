# 🧩 Monorepo Project

โครงสร้างโปรเจกต์แบบ **Monorepo** ที่ประกอบด้วย:

- **Frontend**: [Next.js](https://nextjs.org/) + [Tailwind CSS](https://tailwindcss.com/) + [React Hook Form](https://react-hook-form.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: [Elysia](https://elysiajs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (ผ่าน Docker)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Runtime**: [Bun](https://bun.sh/)

--

```bash
git clone <repo-url>

cd <project-folder>

bun install

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

```bash
#for prodution
docker compose -f 'docker-compose.yml' up -d --build
```

```bash
#Frontend
http://localhost:3000
```

```bash
#Backend
http://localhost:3001/
```

```bash
#API Document
http://localhost:3001/docs
```

## 📁 โครงสร้างโปรเจกต์
