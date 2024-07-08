// Data Transfet Object for vendor inputs

export interface ICreateVendor {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  phone: string;
  email: string;
  address: string;
  password: string;
}

export interface IVendorLoginInputs {
  email: string;
  pasword: string;
}
