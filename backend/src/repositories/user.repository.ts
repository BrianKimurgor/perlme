// src/repositories/user.repository.ts
import { User, CreateUserData } from "../types/user.types";

export class UserRepository {
  private users: User[] = [];
  private idCounter = 1;

  async create(data: CreateUserData): Promise<User> {
    const newUser: User = { 
      id: (this.idCounter++).toString(),
      ...data 
    };
    this.users.push(newUser);
    return newUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async update(id: string, data: Partial<User>): Promise<User | undefined> { 
    const user = await this.findById(id);
    if (!user) return undefined;

    Object.assign(user, data);
    return user;
  }
}