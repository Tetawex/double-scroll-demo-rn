import {ContactRepository} from './ContactRepository';

describe('Contact repository test', () => {
  test('adding 1 + 2 should return 3', () => {
    const repository = new ContactRepository();
    expect(repository.getContact('1').firstName).toBe('Amanda');
  });
});
