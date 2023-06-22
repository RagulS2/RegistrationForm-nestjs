import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { nodemailerService } from 'src/nodemailer.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@UseGuards(ThrottlerGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private sendMail: nodemailerService) { }

  // create User -------------------------------------------
  @Post('signup')
  async create(@Req() req: Request, @Res() res: Response, @Body() createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      const isRegisterdEmail = await this.userService.findOneByEmail(email);
      if (isRegisterdEmail) {
        if (isRegisterdEmail.isVerified) {
          return res.status(HttpStatus.CONFLICT).json({ message: 'Email already registered' });
        } else {
          const verifyOTP = this.sendMail.generateVerificationCode();
          await this.sendMail.sendMail(email, verifyOTP);
          await this.userService.update(isRegisterdEmail.id, { otp: verifyOTP });
          return res.status(HttpStatus.OK).json({ message: 'OTP sent to your email' });
        }
      }
      const hashpassword = await bcrypt.hash(password, 10);
      createUserDto.password = hashpassword;

      const verifyOTP = this.sendMail.generateVerificationCode();
      await this.sendMail.sendMail(email, verifyOTP);
      createUserDto['otp'] = verifyOTP;

      createUserDto['otpCreatedAt'] = new Date();
      const user = await this.userService.create(createUserDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully'
        , data: user
      });
    } catch (error) {
      console.log('Error', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
      });
    }
  }

  // createduser is verified or not -------------------------------------------
  @Post('verifyotp')
  async verify(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      const email = body.email;
      console.log("payload email is ", email);

      const otp = parseInt(body.otp);
      console.log(otp);

      // Check if the email exists in the database
      const user = await this.userService.findOneByEmail(email);
      console.log(user.email);

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
      }

      // Compare the received OTP with the stored OTP
      if (otp !== user.otp) {
        console.log("user.otp is ", user.otp);
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid OTP' });
      } else {

        if (!(user.isVerified)) {
          // Save the updated user in the database  
          const currentTime = new Date();
          const otpCreatedAt = user.otpCreatedAt;
          console.log("otpCreatedAt is ", otpCreatedAt)
          const otpExpiresAt = new Date(otpCreatedAt.getTime() + 300000); // Adding 5 minutes (300,000 milliseconds) to the OTP creation time

          if (currentTime <= otpExpiresAt) {

            await this.userService.update(user.id, { isVerified: true, otpCreatedAt: null });

            return res.status(HttpStatus.OK).json({ message: 'User verified successfully' });

          } else {
            return res
              .status(HttpStatus.UNAUTHORIZED)
              .json({ message: 'OTP expired' });
          }
        }
        else {
          return res.status(HttpStatus.OK).json({ message: 'User already verified' });
        }
      }
    } catch (error) {
      console.log('Error', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
  }

  //login user -------------------------------------------
  @Post('login')
  async verifyotp(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      const email = body.email;
      const password = body.password;
      const user = await this.userService.findOneByEmail(email);

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
      }
      if (user.isVerified) {
        if (user.isBlocked) {
          const blockedTimeStr = user.BlockTime;
          const blockedTime = new Date(blockedTimeStr);
          const currentTime = new Date();
          const elapsedTime = currentTime.getTime() - blockedTime.getTime();
          const elapsedHours = elapsedTime / (1000 * 60 * 60); // Convert elapsed time to hours

          if (elapsedHours >= 2) {
            await this.userService.update(user.id, { isBlocked: false, BlockTime: null })  //unblock user after block time
          } else {
            return res.status(HttpStatus.BAD_REQUEST).json({
              message: 'User is still blocked',
              status: 500,
            });
          }
        }
        else {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            await this.userService.update(user.id, { loginAttempt: 0 })  //reset login attempt to 0 after successful login
            res.status(HttpStatus.OK).json({
              message: 'login successful',
              status: 200,
            })

          } else {
            await this.userService.update(user.id, { loginAttempt: user.loginAttempt + 1 })  //update attempts count

            const userCheck = await this.userService.findOneByEmail(email);
            if (userCheck.loginAttempt >= 3) {
              const currentDate = new Date();
              console.log(currentDate, 'date');
              await this.userService.update(user.id, { isBlocked: true, BlockTime: currentDate })  //block user after 3 attempts
              res.status(HttpStatus.BAD_REQUEST).json({ message: 'blocked', status: 500 })
            } else {

              res.status(HttpStatus.BAD_REQUEST).json({

                message: 'wrong password',

                status: 500

              })
            }
          }
        }

      }
    } catch (error) {
      console.log('Error', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
  }


  //forgot password -------------------------------------------
  @Post('forgotPassword')
  async forgotpassword(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      const email = body.email;
      const password = body.password;
      const otp = parseInt(body.otp);
      console.log("email", email);
      console.log("password", password);
      console.log("otp", otp);

      const user = await this.userService.findOneByEmail(email);
      console.log(user.otp);
      console.log(user.password);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
      }

      if (user.isVerified) {
        if (otp !== user.otp) {
          res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid OTP' });
        } else {
          const hashpassword = await bcrypt.hash(password, 10);
          user.password = hashpassword;
          console.log(user.password, 'user.password')

          await this.userService.update(user.id, { password: hashpassword })
          return res.status(HttpStatus.OK).json({ message: 'Password changed successfully' });

        }
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not-verified' });
      }
    } catch (error) {
      console.log('Error', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
  }



  //resend otp -------------------------------------------
  @Throttle(5, 60)
  @Post('resendotp')
  async resendotp(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      const email = body.email;
      let user = await this.userService.findOneByEmail(email);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
      }
      if (user.isVerified) {
        const verifyOTP = this.sendMail.generateVerificationCode();
        await this.sendMail.sendMail(email, verifyOTP);
        await this.userService.update(user.id, { otp: verifyOTP, otpCreatedAt: new Date() });
        return res.status(HttpStatus.OK).json({ message: 'OTP sent to your email' });
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not-verified' });
      }
    } catch (error) {
      console.log('Error', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
  }



  //verify otp via mail -------------------------------------------

  @Post('verifyotpviamail')
  async verifyotpviamail(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      const email = body.email;
      const otp = parseInt(body.otp);

      const user = await this.userService.findOneByEmail(email);
      if (user) {
        if (user.isVerified) {
          if (otp !== user.otp) {
            return res
              .status(HttpStatus.UNAUTHORIZED)
              .json({ message: 'Invalid OTP' });
          } else {
            const currentTime = new Date();
            const otpCreatedAt = user.otpCreatedAt;
            console.log('otpCreatedAt', otpCreatedAt);
            const otpExpiresAt = new Date(otpCreatedAt.getTime() + 300000); // Adding 5 minutes (300,000 milliseconds) to the OTP creation time

            if (currentTime <= otpExpiresAt) {
              return res
                .status(HttpStatus.OK)
                .json({ message: 'User verified successfully', data: true });
            } else {
              return res
                .status(HttpStatus.UNAUTHORIZED)
                .json({ message: 'OTP expired' });
            }
          }
        } else {
          return res.status(HttpStatus.OK).json({ message: 'User not verified' });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
      }
    } catch (error) {
      console.log('Error:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Something went wrong' });
    }
  }








  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}


