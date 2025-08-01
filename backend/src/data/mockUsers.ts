import { User } from '../types';

export const users: User[] = [
  {
    id: 1,
    name: 'John Super',
    email: 'superjohn@example.com',
    referralCode: 'A4C1T3',
    points: 0
  },
  {
    id: 2,
    name: 'Mark Smith',
    email: 'mark@example.com',
    referralCode: 'DVF4T6',
    points: 0
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    referralCode: '1HI7F9',
    points: 0
  }
];


export function getUsers(): User[] {
  return JSON.parse(JSON.stringify(users));
}