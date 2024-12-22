const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

exports.addNewUser = async (username, password, email, isAdmin) => {
  try {
    console.log("hit inside");

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.users.create({
      data: {
        userName: username,
        password: hashedPassword,
        email: email,
        isAdmin: isAdmin,
      },
    });
    console.log(`New User created: ${result.userName}`);
    return;
  } catch (error) {
    console.error("Error in db addNewUser: ", error);
    throw new Error(error);
  }
};

exports.checkUserNameInUse = async (username) => {
  try {
    const result = await prisma.users.findFirst({
      where: {
        userName: username,
      },
    });
    return result;
  } catch (error) {
    console.error("Error in db checkUserNameInUse: ", error);
    throw new Error(error);
  }
};

exports.checkEmailInUse = async (email) => {
  try {
    const result = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    return result;
  } catch (error) {
    console.error("Error in db checkEmailInUse: ", error);
    throw new Error(error);
  }
};

exports.findUserById = async (id) => {
  try {
    const result = await prisma.users.findFirst({
      where: {
        id: id,
      },
    });
    return result;
  } catch (error) {
    console.error("Error in db findUserById", error);
    throw new Error(error);
  }
};

