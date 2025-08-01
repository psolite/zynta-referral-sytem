import { User } from '../types';

// Generates a unique 6-digit alphanumeric referral code
 
export function generateReferralCode(existingUsers: User[]): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  const generateCode = (): string => {
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  let code: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = generateCode();
    attempts++;
    
    if (attempts >= maxAttempts) {
      throw new Error('Failed to generate unique referral code after multiple attempts');
    }
  } while (existingUsers.some(user => user.referralCode === code));

  return code;
}