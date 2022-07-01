import { Server } from "../service/UserService";

export interface User {
  itemLevel: number;
  charLevel: string;
  charClass: string;
  charName: string;
  serverName: string;
  guildName?: string;
  loadTime: string | Date;
  allCharList: Server[];
}
