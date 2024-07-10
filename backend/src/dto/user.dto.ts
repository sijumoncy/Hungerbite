import { IsEmail, IsEmpty, Length } from "class-validator";

export class SignupUserInputs {
  @IsEmail()
  email: string;

  @Length(10)
  phone: string;

  @Length(6, 12)
  password: string;
}

export class LoginUserInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class UpdateUserProfileInputs {
  @Length(2, 20)
  firstName: string;

  @Length(2, 20)
  lastName: string;

  @Length(2, 20)
  address: string;
}

export interface IUserPayload {
  _id: string;
  email: string;
  verified: boolean;
}
