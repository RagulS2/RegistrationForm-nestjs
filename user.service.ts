import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository:Repository<User>

  ){}

  async findOneByEmail(email:string){
    return await this.userRepository.findOne({where : {email:email},select:['email','userName','password','id','isVerified','otp','isBlocked','BlockTime','loginAttempt','otpCreatedAt']});
  }


  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto)
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, user: any) {
    return await this.userRepository.update(id,user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
