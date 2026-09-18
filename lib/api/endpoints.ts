// Single source of truth for every API path the frontend calls. No
// component or service should ever inline a "/api/..." string - if a route
// path changes, this is the only file that needs to know.
export const endpoints = {
  loans: {
    list: "/api/loans",
    create: "/api/loans",
    detail: (loanId: string) => `/api/loans/${loanId}`,
    payments: (loanId: string) => `/api/loans/${loanId}/payments`,
  },
} as const;
