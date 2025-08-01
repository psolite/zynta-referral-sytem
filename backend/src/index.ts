import app from './app';
import { AppError } from './types';

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: AppError) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});