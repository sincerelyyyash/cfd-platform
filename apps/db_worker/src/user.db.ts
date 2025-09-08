import { prisma } from "@repo/database";

type newUserType = {
  id: string,
  email: string,
}

// type updateBalanceType = {
//   userId: string,
//   balance: number,
// }

export const createNewUser = async (data: newUserType) => {
  const { id, email } = data;

  if (!id || !email) {
    return console.error("Invalid inputs")
  }
  try {
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        lastLoggedIn: new Date(),
      }
    })

  } catch (err) {
    console.error("Error creating user:" + err);
  }
}

// export const updateUserBalance = async (data: updateBalanceType) => {
//   const { userId, balance } = data;
//
//   if (!userId || !balance) {
//     console.error("Invalid inputs")
//   }
//
//   try {
//     const balance = await prisma.user.update({
//       where: { id: userId },
//       data: { balance: balance },
//     })
//   }
// }
