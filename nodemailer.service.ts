import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';


@Injectable()

export class nodemailerService {

  private transporter: nodemailer.Transporter;
  constructor() {

    this.transporter = nodemailer.createTransport({

      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      secure: false,
      auth: {
        user: 'f6c2f8b7870639',
        pass: 'd072ba29244243',

      },

    });

  }

  async sendMail(email,verifyOTP) {

    await this.transporter.sendMail({

      from: 'sragul@gmail.com',

      to:`${email}`,

      subject: 'Verify your email address',

      html:`<p>Click here to verify ${verifyOTP} </p>`

    });

  }

   generateVerificationCode() {

    const code = Math.floor(100000 + Math.random() * 900000);

    return code.toString();

  }

}