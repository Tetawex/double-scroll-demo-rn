import {ContactRepository} from '../ContactRepository';

describe('ContactRepository.getContact', () => {
  test('Retrieves the contact by id', () => {
    const repository = new ContactRepository();
    expect(repository.getContact('1')).toEqual({
      avatarFileName: 'Amanda_Brady.png',
      avatarUri: undefined, // Image.resolveAssetSource is mocked to return undefined
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      firstName: 'Amanda',
      id: '1',
      lastName: 'Brady',
      role: 'Case Manager',
    });
  });
  test('Returns undefined for a non-existing id', () => {
    const repository = new ContactRepository();
    expect(repository.getContact('-1')).toEqual(undefined);
  });
});

describe('ContactRepository.getContacts', () => {
  test('Returns all contacts', () => {
    const repository = new ContactRepository();
    expect(repository.getContacts().length).toBe(28);
  });
});
