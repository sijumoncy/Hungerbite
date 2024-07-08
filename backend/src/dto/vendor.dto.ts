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

export interface IUpdateVendorProfileInputs {
  name: string;
  address: string;
  phone: string;
  foodTypes: [string];
}

export interface IVendorLoginInputs {
  email: string;
  pasword: string;
}

export interface IVendorPayload {
  _id: string;
  email: string;
  name: string;
  foodTypes: string[];
}
