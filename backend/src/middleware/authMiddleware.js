const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = decoded;

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
};

module.exports = authMiddleware;