import { CardSet, Jewel, LoaCard, Server } from "../service/UserService";

export interface User {
  itemLevel: number;
  charLevel: string;
  charClass: string;
  charName: string;
  serverName: string;
  guildName?: string;
  loadTime: string | Date;
  allCharList: Server[];
  engraves?: string[];
  abilities?: string[];
  jewels?: Jewel[];
  cards?: {
    cardList: LoaCard[];
    cardSet: CardSet[];
  };
  wisdom: {
    name: string;
    level: string;
  };
}
