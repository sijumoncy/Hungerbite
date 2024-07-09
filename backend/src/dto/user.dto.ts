import { IsEmail, IsEmpty, Length } from "class-validator";

export class SignupUserInputs {
  @IsEmail()
  email: string;

  @Length(10)
  phone: string;

  @Length(6, 12)
  password: string;
}

export interface IUserPayload {
  _id: string;
  email: string;
  verified: boolean;
}
