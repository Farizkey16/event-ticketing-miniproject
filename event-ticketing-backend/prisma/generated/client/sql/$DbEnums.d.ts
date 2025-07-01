export interface $DbEnums {}


export namespace $DbEnums {
  type ACCOUNT_ROLE = "user" | "organizer" | "admin"
  type STATUS = "active" | "used" | "expired"
  type EVENT_STATUS = "attended" | "expired" | "cancelled"
  type transactions_STATUS = "waiting_for_payment" | "waiting_for_admin_confirmation" | "rejected" | "done" | "expired" | "canceled"
}
