import { RegisterDTO } from "@/lib/validations/auth/register-schema";
import { CategoryDTO } from "./category";
import { menuItemDomainData } from "@/lib/validations/menu/menu-item-domain";
import { ReservationFormData } from "@/lib/validations/reservation/reservation-schema";

export type ResponseAction = 
  | {
    success: true;
    message: string;
  } | {
    success: false;
    error?: string;
    fieldError?: Partial<Record<keyof RegisterDTO, string[]>>
  }

export type CategoryResponseAction = 
  | {
    success: true;
    message: string;
  } | {
    success: false;
    error?: string;
    fieldError?: Partial<Record<keyof CategoryDTO, string[]>>
  }

  export type MenuItemResponseAction = 
  | {
    success: true;
    message: string;
  } | {
    success: false;
    error?: string;
    fieldError?: Partial<Record<keyof menuItemDomainData, string[]>>
  }

export type DeleteResponseAction = 
  | {
    success: true;
    message: string;
  } | {
    success: false;
    error: string;
  }

export type EditResponseAction = 
  | {
    success: true;
    message: string;
  } | {
    success: false;
    error: string;
  }

export type ReservationResponseAction = 
| {
    success: true;
    message: string;
  } | {
    success: false;
    error?: string;
    fieldError?: Partial<Record<keyof ReservationFormData, string[]>>
  }
