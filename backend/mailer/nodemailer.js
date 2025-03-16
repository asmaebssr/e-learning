import dotenv from 'dotenv';
import nodemailer from 'nodemailer' ;

dotenv.config();

export const sender = {
  email: process.env.EMAIL_USER,
  name: process.env.EMAIL_NAME,
};

export const nodemailerClient = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})