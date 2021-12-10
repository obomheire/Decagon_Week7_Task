import Joi from 'joi'
import express, {Request, Response, NextFunction} from 'express';
import fs, {writeFileSync, readFileSync, access} from 'fs';
const jwt = require('jsonwebtoken')
import path from 'path';
import {Customer, User }from './interface';

let dbpath = path.resolve('src/database.json')
let dbpath2 = path.resolve('src/user.json')

export let joiShemaReg = () =>{
    const schema = Joi.object({
        username: Joi.string().min(3).max(45).required(),
        email: Joi.string().min(5).max(45).email().required(),
        password: Joi.string().min(5).max(45).required(),
        repeat_password: Joi.ref('password')
      })
      return schema

}

export let joiShemaLog = () =>{
    const schema = Joi.object({
        username: Joi.string().min(3).max(45).required(),
        password: Joi.string().min(5).max(45).required(),
      })
      return schema
}

export let authenticateToken = (req:Request, res:Response, next:NextFunction) => {

const token = req.cookies.jwtToken;

if (!token) return res.sendStatus(401)

jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error:Error, user:any) => {

  if (error) return res.sendStatus(403)

  req.user = user

  next()
})

}

export let createToken = (username: string, res: Response) => {

  const user = {user_name: username}
      
  //require('crypto').randomBytes(64).toString('hex')

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: '1800s'})
  
    res.cookie('jwtToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 1000 // 1 day
    })

}

export let readDbData = () =>{
  const data = JSON.parse(readFileSync(dbpath, {encoding: 'utf-8'}))
  return data
  }
  
export let readDbUser = () =>{
    const userRecord = JSON.parse(readFileSync(dbpath2, {encoding:'utf8'}));
    return userRecord
}

export let writeData = (file: Customer) =>{
  return fs.writeFileSync(dbpath, JSON.stringify(file, null, 4));
}

export let writeUser = (record: User) => {
  return fs.writeFileSync(dbpath2, JSON.stringify(record, null, 4));
}
