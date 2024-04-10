import { Router } from "express";
import UserController from "../controllers/user.controller.js";
const router = Router();
import {check} from 'express-validator';

const validateFields = [
  check('email', 'Check the Email').isEmail(),
  check('password', 'Minimal length of password 8 symbols').isLength({ min: 8 })
]

router.post('/auth', UserController.authUser);

router.post('/user', validateFields, UserController.createUser);
router.get('/user', UserController.getUsers);
router.get('/user/:id', UserController.getUser);
router.patch('/user/:id', UserController.updateUser);
router.delete('/user', UserController.deleteUser);

export default router