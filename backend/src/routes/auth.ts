import { Router } from 'express';
import { register, login, logout, authConnectionTest } from '../controllers/auth.controller';


const router = Router();

router.get('/connection-test', authConnectionTest);

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

export default router;
