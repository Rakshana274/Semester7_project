import jwt from 'jsonwebtoken';

const getSecret = () => process.env.JWT_SECRET || 'opd-super-secret-key-2026-secure';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: String(user._id || user.id),
      email: user.email,
      role: user.role,
      name: user.name,
      username: user.username
    },
    getSecret(),
    { expiresIn: '24h' }
  );
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  // Handle mock tokens passed by frontend during transition
  if (token.startsWith('mock-jwt-token-')) {
    const rolePart = token.replace('mock-jwt-token-', '').split('-')[0];
    req.user = {
      id: 'mock-user-id',
      name: `${rolePart.toUpperCase()} User`,
      email: `${rolePart}@hospital.org`,
      role: rolePart
    };
    return next();
  }

  jwt.verify(token, getSecret(), (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Unauthorized role' });
    }
    next();
  };
};
