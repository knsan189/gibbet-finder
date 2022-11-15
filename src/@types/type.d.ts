interface User {
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

interface Equipment {
  grade: number;
  img: string;
  key: string;
  name?: string;
  quality?: number;
  trypod?: string[];
  abilityList?: string[];
}

interface Equipments {
  [slot: string]: Equipment;
}

interface CardSet {
  title: string;
  effect: string;
}

interface LoaCard {
  name: string;
  img: string;
  grade: number;
  awaken: number;
}

interface Jewel {
  name: string;
  img: string;
  level: string;
  grade: string;
  skill: string;
}

interface Char {
  thumbnail?: string;
  charName?: string;
  charLevel?: string;
  charClass?: string;
}

interface Tripod {
  name: string;
  level: string;
  efffect: string;
}

interface Skill {
  name: string;
  tripods: Tripod[];
}

interface Server {
  serverName: string;
  charList: Char[];
}
