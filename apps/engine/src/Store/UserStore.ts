type User = {
  id: string
  name: string,
  email: string,
  balance: number,
}


export class UserStore {
  private static instance: UserStore;
  private users = new Map<string, User>();
  private SCALE_BALANCE = 100;      // 2 decimals
  public SCALE_PRICE = 10_000;     // 4 decimals


  private constructor() { };

  static getInstance() {
    if (!this.instance) {
      return this.instance = new UserStore();
    }
    return this.instance;
  }
  addUser(userData: any) {
    this.users.set(userData.id, { ...userData, balance: 5000 * this.SCALE_BALANCE });
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

  updateBalance(userId: string, delta: number) {
    const user = this.getUserById(userId);
    if (!user) throw new Error("User not found");
    user.balance += Math.round(delta * this.SCALE_BALANCE);
  }

  getBalance(userId: string) {
    const user = this.getUserById(userId);
    if (!user) throw new Error("User not found");
    return user.balance / this.SCALE_BALANCE;
  }

}
