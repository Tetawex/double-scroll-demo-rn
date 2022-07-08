import contactsData from '@assets/contacts/contacts.json';
import {Image} from 'react-native';
import {assetMap} from './assetMap';
import {Contact, ContactId} from '@entity/contact';

export class ContactRepository {
  private contacts: Record<ContactId, Contact> = {};

  constructor() {
    let newContacts: Record<ContactId, Contact> = {};
    contactsData.forEach(contact => {
      newContacts[contact.id] = {
        ...contact,
        avatarUri: Image.resolveAssetSource(assetMap[contact.id]).uri,
      };
    });

    this.contacts = newContacts;
  }
  getContacts(): Array<Contact> {
    return Object.values(this.contacts);
  }
  getContact(contactId: ContactId): Contact {
    return this.contacts[contactId];
  }
}
