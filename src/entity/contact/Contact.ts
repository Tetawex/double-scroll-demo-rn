export type ContactId = string;

export type Contact = {
  id: ContactId;
  firstName: string;
  lastName: string;
  avatarUri: string;
  role: string;
  description: string;
};
