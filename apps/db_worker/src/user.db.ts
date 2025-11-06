import { prisma } from "@repo/database";

type newUserType = {
  id: string,
  email: string,
}

type updateBalanceType = {
  userid: string,
  balance: number,
}

export const createNewUser = async (data: newUserType) => {
  const { id, email } = data;

  if (!id || !email) {
    console.error("Invalid inputs for createNewUser - missing id or email");
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      console.log(`User ${id} already exists in database, skipping creation`);
      await prisma.user.update({
        where: { id },
        data: { lastLoggedIn: new Date() },
      });
      return;
    }

    await prisma.user.create({
      data: {
        id: id,
        email: email,
        lastLoggedIn: new Date(),
      },
    });

    console.log(`User ${id} (${email}) created successfully in database`);
  } catch (err) {
    console.error(`Error creating user ${id} in database:`, err);
    throw err;
  }
};

export const updateUserBalance = async (data: updateBalanceType) => {
  const { userid, balance } = data;

  if (!userid || balance === undefined || balance === null) {
    console.error("Invalid inputs for updateUserBalance:", data);
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userid },
      data: { balance: balance },
    });
    
    console.log(`User ${userid} balance updated to ${balance} in database`);
    return updatedUser;
  } catch (err) {
    console.error(`Error updating balance for user ${userid}:`, err);
    throw err;
  }
};

export const getUserBalanceFromDB = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });
    
    return user?.balance || null;
  } catch (err) {
    console.error(`Error fetching balance for user ${userId}:`, err);
    return null;
  }
};
