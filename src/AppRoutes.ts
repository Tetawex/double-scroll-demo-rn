export enum AppRouteNames {
  CONTACT_LIST = 'CONTACT_LIST',
  CONTACT_DETAILS = 'CONTACT_DETAILS',
}

export type AppRouteParams = {
  [AppRouteNames.CONTACT_LIST]: {};
  [AppRouteNames.CONTACT_DETAILS]: {contactId: string};
};

export const APP_INITIAL_STATE = [
  {name: AppRouteNames.CONTACT_LIST, params: {}},
];
