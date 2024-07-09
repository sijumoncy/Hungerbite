import { IUserPayload } from "./user.dto";
import { IVendorPayload } from "./vendor.dto";

export type AuthPayloadType = IVendorPayload | IUserPayload;
