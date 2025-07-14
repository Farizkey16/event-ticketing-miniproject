export interface $DbEnums {}


export namespace $DbEnums {
  type account_role = "user" | "organizer" | "admin"
  type coupon_status = "active" | "used" | "expired"
  type issuer = "system" | "organizer" | "admin"
  type EventType = "CONFERENCE" | "SEMINAR" | "WORKSHOP" | "WEBINAR" | "MEETUP" | "PANEL" | "TALK" | "TRAINING" | "COMPETITION" | "FESTIVAL" | "CONCERT" | "PERFORMANCE" | "EXHIBITION" | "SPORTS" | "FUNDRAISER" | "NETWORKING" | "CEREMONY" | "PARTY"
  type event_status = "attending" | "attended" | "expired" | "cancelled"
  type transactions_status = "waiting_for_payment" | "waiting_for_admin_confirmation" | "rejected" | "accepted" | "expired" | "canceled"
  type discount_type = "fixed" | "percentage"
}
