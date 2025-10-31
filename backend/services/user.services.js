import userModel from '../models/user.model.js';

const createUser = async ({ firstname, lastname, email, password }) => {
  if (!firstname || !email || !password) {
    throw new Error('Required fields are missing');
  }

  const user = await userModel.create({
    fullname: { firstname, lastname },
    email,
    password,
  });

  return user;
};
const userService = {
    createUser
}
// ✅ Default export
export default userService;
