import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { User, RegisterRequest, UsersResponse, UserResponse, RegisterResponse, AppError } from './types';
import { generateReferralCode } from './utils/referralCodeGenerator';
import { getUsers } from './data/mockUsers';

const app: Application = express();

// Initialize users with mock data
let users: User[] = getUsers();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  try {
    const message = "Welcome to Zynta Referral Code API"
    res.status(200).json({ message });
  } catch (error) {
    const err = error as AppError;
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Internal server error' 
    });
  }
});

// GET all users
app.get('/api/users', (req: Request, res: Response<UsersResponse>) => {
  try {
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    const err = error as AppError;
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Internal server error' 
    });
  }
});

// GET user by referral code
app.get('/api/users/:referralCode', (req: Request<{ referralCode: string }>, res: Response<UserResponse>) => {
  try {
    const referralCode = req.params.referralCode.toUpperCase();
    const user = users.find(u => u.referralCode === referralCode);
    
    if (!user) {
      const error: AppError = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    const err = error as AppError;
    res.status(err.status || 500).json({ 
      success: false, 
      error: err.message || 'Internal server error' 
    });
  }
});

// POST register new user
app.post('/api/register', (req: Request<{}, {}, RegisterRequest>, res: Response<RegisterResponse>) => {
  try {
    const { name, email, referralCode } = req.body;
    
    // Validation
    if (!name || !email) {
      const error: AppError = new Error('Name and email are required');
      error.status = 400;
      throw error;
    }
    
    if (typeof name !== 'string' || typeof email !== 'string') {
      const error: AppError = new Error('Name and email must be strings');
      error.status = 400;
      throw error;
    }
    
    // Check if email already exists
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      const error: AppError = new Error('Email already registered');
      error.status = 400;
      throw error;
    }
    
    // Generate new user data
    const newUser: User = {
      id: users.length + 1,
      name,
      email,
      referralCode: generateReferralCode(users),
      points: 0
    };
    
    // Check referral code and award points if valid
    if (referralCode) {
      const referrer = users.find(user => user.referralCode === referralCode.toUpperCase());
      if (referrer) {
        referrer.points += 10;
      } else {
        const error: AppError = new Error('Invalid referral code');
        error.status = 400;
        throw error;
      }
    }
    
    // Add new user
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        users: users
      }
    });
  } catch (error) {
    const err = error as AppError;
    res.status(err.status || 500).json({ 
      success: false, 
      error: err.message || 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

export default app;