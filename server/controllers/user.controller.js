import bcrypt from 'bcrypt';
import {validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import 'dotenv/config'


import User from '../models/appModels/User.js'

class UserController { 
  async authUser(req, res){
    console.log('authUser:', req.body);
    const { email, password } = req.body;
    try{
      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ message: 'User does not exist' })
      
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(400).json({ message: 'Wrong password' })

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' })
      return res.json({ message: 'Welcome', user: user, userId: user._id, token })
    } catch(error){
      console.error('Error:', error)
      res.status(500).json({ message:'Something wrong...' })
    }    
  }

  async createUser(req, res){
    console.log('createUser:', req.body);
    if(!req.body) return;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log('ERROR:', errors.array());
		  return res.status(400).json({
			errors: errors.array(),
			message: 'Invalid data in registration fields'
		  })
		}
    const { email, password } = req.body;
    try{
      const isExist = await User.findOne({ email });
      if (isExist) return res.status(400).json({ message:'User already exists' })

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })
      await user.save()

      console.log('New user:', user)
      // res.status(201).json({ message: 'User created' })
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' })
      user.password = 'areyousmart'
      return res.json({ message: 'User created', user: user, token })
    } catch(error){
      console.error('Error:', error)
      res.status(500).json({ message:'Something wrong...' })
    }
  }

  async getUsers(req, res){
    console.log('getUsers');
  }

  async getUser(req, res){
    console.log('getUser');
  }

  async updateUser(req, res){
    console.log('updateUser');
  }

  async deleteUser(req, res){
    console.log('deleteUser');
  }

  
}

export default new UserController()