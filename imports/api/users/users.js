const Users = {};

Users.adminFields = {
  _id: 1,
  username: 1,
  emails: 1,
  'services.facebook.email': 1,
  'services.facebook.name': 1,
  roles: 1,
  shiftsCounter: 1,
  delivsCounter: 1,
  kmsCounter: 1,
  gainsCounter: 1,
  createdAt: 1,
  updatedAt: 1,
};

export default Users;
