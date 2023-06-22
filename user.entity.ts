import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    otp:number;

    @Column({default: true})
    isActive: boolean;

    @Column({default: false})
    isVerified: boolean;

    @Column({default: 0})
    loginAttempt: number;

    @Column({default: false})
    isBlocked: boolean;

    @Column({nullable: true})
    BlockTime: Date;

    @Column({nullable: true})
    otpCreatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable: true})
    createdBy: number;

    @UpdateDateColumn({nullable: true})
    updateAt: Date;

    @Column({nullable: true})
    updatedBy: number;

    @DeleteDateColumn({nullable: true})
    deletedAt: Date;

    @Column({nullable: true})
    deletedBy: number;
  blockedDate: any;

}
