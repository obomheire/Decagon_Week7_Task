import express, {Request, Response, NextFunction} from 'express';
import ejs from 'ejs'
import {Customer, User }from './interface';
import bcrypt from 'bcrypt'
const jwt = require('jsonwebtoken')
import { joiShemaReg, joiShemaLog, authenticateToken, createToken, readDbData, readDbUser, writeData, writeUser} from './modules';

const router = express.Router();

let key: number [] = []

router.get('/', (req: Request, res: Response, next: NextFunction) =>{
  if (key.length === 0) res.render('login')
  else {

    let data = readDbData()
     
    res.render('index_customers', { 
    title: 'CUSTOMER RELASHIONSHIP MANAGEMENT SYSTEM',
    customers: data
})
  }

})

router.get('/login', (req: Request, res: Response, next: NextFunction) =>{
    res.render('login')
    key.pop()
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {

  let userRecord = readDbUser()

  let { username, password } = req.body

  const result = joiShemaLog().validate({username: username, password: password})

  if (result.error){
    res.render('error', {
      error: result.error.details[0].message
    })
    
  }else{ 

  let loginUser = userRecord.find((value: User) => value.username === username)

  if (loginUser){

     const validatePassword = await bcrypt.compare(password, loginUser.password)

     if (!validatePassword) res.render('incorrect_login')
     else {

      createToken(username, res)

      let data = readDbData()

      res.render('index_customers', { 
      title: 'CUSTOMER RELASHIONSHIP MANAGEMENT SYSTEM',
      customers: data
  })
    key.push(1)
     }

}}})

router.post('/register', async(req: Request, res: Response, next: NextFunction) => {

      let userRecord = readDbUser()

      let { username, email, password1, password2 } = req.body
   
      const result = joiShemaReg().validate({username: username, email: email, password: password1, repeat_password: password2})
      
      if (result.error){
        res.render('error', {
          error: result.error.details[0].message
        })
        
      } 
      else{

          const salt = await bcrypt.genSalt(10)
          const hashed = await bcrypt.hash(password1, salt)
  
          let user = {
          id: Date.now().toString(),
          username: username,
          email: email,
          password: hashed
        }
  
        let regData = userRecord.find((value: User) => value.username === username || value.email === email)
  
        if (!regData) {
          userRecord.push(user)

          writeUser(userRecord)
        res.redirect('/login')
        }else res.render('user_exist')
    
      }
      
    })

router.get('/add', authenticateToken, (req: Request, res: Response, next: NextFunction) => {

      res.render('add_customer', {
      title: 'CUSTOMER RELASHIONSHIP MANAGEMENT SYSTEM'
  })
})

router.post('/save', (req: Request, res: Response, next: NextFunction) => {

  let data = readDbData()

    let {fullname, email, gender, phone, address, notes} = req.body

    let customer = {
        customerid: parseInt(Date.now().toString()),
        fullname: fullname,
        email: email,
        gender: gender,
        phone: phone,
        address: address,
        notes: notes
      }

      data.push(customer)

      writeData(data)
      res.status(201)
      res.redirect('/')
      key.push(1)
})

router.get('/edit/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => {

  let data = readDbData()
  let customerData = data.find((value: Customer) => value.customerid === parseInt(req.params.id))

      res.render('update_customer', {
      title: 'CUSTOMER RELASHIONSHIP MANAGEMENT SYSTEM',
      customer: customerData
  })
})

router.post('/update', (req: Request, res: Response, next: NextFunction) => {

  let data = readDbData()

  let customer = data.find((value: Customer) => value.customerid === parseInt(req.body.id))

    if (!customer) return res.status(404).send("Customer not found!")

        let {fullname, email, gender, phone, address, notes} = req.body

        customer.fullname = fullname? fullname: customer.fullname,
        customer.email = email? email: customer.email,
        customer.gender = gender? gender: customer.gender,
        customer.phone = phone? phone: customer.phone,
        customer.address = address? address: customer.addres,
        customer.notes = notes? notes: customer.notes

        writeData(data)
        res.status(202)
        res.redirect('/')
        key.push(1)
    })

router.get('/delete/:id',authenticateToken, (req: Request, res: Response, next: NextFunction) =>{

  let data = readDbData()
  
  let customer = data.find((value: Customer) => value.customerid === parseInt(req.params.id))
  console.log(typeof req.params.id)

    if(!customer) return res.status(404).send('Customer not found!')

    let index = data.indexOf(customer)
    
    data.splice(index, 1)
   
    writeData(data)
    res.status(200)
    res.redirect('/')
    key.push(1)
     
})

 export default router;
