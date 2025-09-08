type User = {
  id: string
  name: string,
  email: string,
  balance: number,
}


export class UserStore {
  private static instance: UserStore;
  private users = new Map<string, User>();
  private BALANCE_DECIMAL = 100;      // 2 decimals
  public PRICE_DECIMAL = 10_000;     // 4 decimals


  private constructor() { };

  static getInstance() {
    if (!this.instance) {
      return this.instance = new UserStore();
    }
    return this.instance;
  }
  addUser(userData: any) {
    this.users.set(userData.id, { ...userData, balance: 5000 * this.BALANCE_DECIMAL });
    return this.users.get(userData.id)
  }

  getUserById(id: string) {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return undefined;
  }

  getUserByEmail(email: string) {
    return Object.values(this.users).find(u => u.email === email);
  }

  updateBalance(userId: string,) {
    const user = this.getUserById(userId);
    if (!user) throw new Error("User not found");
    user.balance += Math.round(this.BALANCE_DECIMAL);
  }

  getBalance(userId: string) {
    const user = this.getUserById(userId);
    if (!user) throw new Error("User not found");
    return user.balance;
  }

  getAllUsers() {
    return this.users.values();
  }

  addUsersFromScreenshot(data: [string, User][]) {
    for (const [key, value] of data) {
      this.users.set(key, value);
    }
  }

}
