export enum UserRole {
  customer = 'customer',
  driver = 'driver',
  manager = 'manager',
}

export enum ComfortLevel {
  economy = 'economy',
  comfort = 'comfort',
  business = 'business',
}

export enum OrderStatus {
  searchingDriver = 'searchingDriver',
  driverAssigned = 'driverAssigned',
  inProgress = 'inProgress',
  finished = 'finished',
  canceled = 'canceled',
}

export enum ApplicationStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

export const Prisma = {};
