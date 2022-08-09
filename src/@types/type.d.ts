import { CardSet, Equipments, Jewel, LoaCard, Server, Skill } from "../service/UserService";

export interface User {
  charImg: string;
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
  equipments: Equipments;
  skills: Skill[];
}
