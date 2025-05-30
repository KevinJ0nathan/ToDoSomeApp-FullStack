export const isAdmin = (req, res, next) => {
    const user = req.user; 

    if (user.role === 'admin') {
        return next(); 
    }

    return res.status(403).json({ message: 'Access denied: Admins only' });
};