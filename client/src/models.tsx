// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id          String    @id @default(uuid())
  email       String    @unique
  password    String
  name        String
  bio         String?
  avatarUrl   String?
  todos       Todo[]            // ユーザーのToDo
  likes       Like[]            // いいねしたToDo
  comments    Comment[]         // コメント
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Todo {
  id          String    @id @default(uuid())
  title       String
  description String?
  dueDate     DateTime?
  checked     Boolean   @default(false)
  removed     Boolean   @default(false)
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  tags        Tag[]     @relation("TodoTags", references: [id])
  likes       Like[]            // いいね
  comments    Comment[]         // コメント
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
