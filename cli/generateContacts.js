const fs = require('fs');

const PATH_TO_IMAGES = './assets/contacts';
const PATH_TO_ASSET_MAP = './src/data';

let id = 0;

let roles = [
  'Writer',
  'Sales Representative',
  'Nurse',
  'Internet/Social Media Evaluator',
  'Territory Sales Manager',
  'Engineer',
  'Developer',
  'Case Manager',
];

const getRandomRole = () => roles[Math.floor(Math.random() * roles.length)];

const users = fs
  .readdirSync(PATH_TO_IMAGES)
  .filter(file => !file.includes('.json') && !file.includes('@'))
  .map(user => {
    const [head, tail] = user.split('_');
    return {
      id: String(id++),
      firstName: head,
      lastName: tail.split('.')[0],
      avatarFileName: user,
      role: getRandomRole(),
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    };
  });

fs.writeFile(
  `${PATH_TO_IMAGES}/contacts.json`,
  JSON.stringify(users, null, 2),
  () => {},
);

const requireString = [
  'export const assetMap = {',
  ...users.map(
    u => `  '${u.id}': require('@assets/contacts/${u.avatarFileName}'),`,
  ),
  '}',
].join('\n');

fs.writeFile(`${PATH_TO_ASSET_MAP}/assetMap.ts`, requireString, () => {});
