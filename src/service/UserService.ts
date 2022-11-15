import { Gibbet } from "./../@types/redux/gitbbet.interface";
import { AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";

//profile-character-info__server
//game-info__guild
//profile-character-list__server
//profile-character-list__char
//profile-equipment__slot

const tagRegex = /<[^>]*>?/g;

class UserService {
  public static async getChar(nickname: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (nickname === "") {
            resolve(null);
            return;
          }

          const { ipcRenderer } = window.require("electron");
          const request: AxiosRequestConfig = {
            url: `https://lostark.game.onstove.com/Profile/Character/${encodeURI(nickname)}`,
            method: "get",
          };
          const response = await ipcRenderer.invoke("request", request);
          const parseHtml = response.data.replace("<!DOCTYPE html>", "").replace(/\r?\n|\r/g, "");
          const $ = cheerio.load(parseHtml);
          const charClass = $(".profile-character-info__img").attr("alt") as string;

          if (!charClass) {
            resolve(null);
            return;
          }

          const itemLevel = $(".level-info2__expedition")
            .text()
            .replace("장착 아이템 레벨Lv.", "")
            .replace(",", "");
          const charLevel = $(".level-info__item")
            .text()
            .replace(/[^0-9]/g, "");
          const serverName = $(".profile-character-info__server").text().replace("@", "");
          const guildName = $(".game-info__guild").text().substring(2);
          const loadTime = new Date();
          const allCharList: Server[] = [];
          const charListDom = $(".profile-character-list__char");
          const charListSeverDom = $(".profile-character-list__server");
          charListSeverDom.each((index) => {
            const temp: Server = {
              serverName: charListSeverDom.eq(index).text(),
              charList: [],
            };
            const charListDomLi = charListDom.eq(index).find("li");
            charListDomLi.each((i) => {
              const char = charListDomLi.eq(i);
              const thumbnail = char.find("img").attr("src")?.trim();
              const name = char.find("button span").text()?.trim();
              const level = char.find("button").text().replace(name, "")?.trim();
              temp.charList.push({
                thumbnail,
                charName: name,
                charLevel: level,
                charClass: char.find("img").attr("alt"),
              });
            });
            allCharList.push(temp);
          });

          const charImg = $(".profile-equipment__character img").attr("src") || "";

          const engrave = $(".profile-ability-engrave");
          const engraves: string[] = [];

          engrave.find("span").each((index, item: any) => {
            const text = item.children[0].data;
            if (text) {
              engraves.push(text);
            }
          });

          const wisdomList = $(".game-info__wisdom span");
          const wisdom = {
            level: "-",
            name: "-",
          };
          wisdomList.each((index) => {
            const item = wisdomList.eq(index).text();
            if (index === 1) {
              wisdom.level = item;
            }
            if (index === 2) {
              wisdom.name = item;
            }
          });

          const ability = $(".profile-ability-battle");
          const abilities: string[] = [];

          ability.find("span").each((index, item: any) => {
            const text = item.children[0].data;
            if (text) {
              abilities.push(text);
            }
          });

          const script = $("script");
          const jewels: Jewel[] = [];
          const cards: {
            cardList: LoaCard[];
            cardSet: CardSet[];
          } = {
            cardList: [],
            cardSet: [],
          };

          const cardList = $("#cardList li");
          cardList.each((index) => {
            const item = cardList.eq(index);
            cards.cardList.push({
              img: item.find("img").attr("src") as string,
              name: item.find("strong").text(),
              grade: parseInt(item.find("div").attr("data-grade") as string, 10),
              awaken: parseInt(item.find("div").attr("data-awake") as string, 10),
            });
          });

          const cardSetList = $("#cardSetList > li");
          cardSetList.each((index) => {
            const item = cardSetList.eq(index);
            cards.cardSet.push({
              title: item.find(".card-effect__title").text(),
              effect: item.find(".card-effect__dsc").text(),
            });
          });

          const equipments: Equipments = {};
          const equipmentList = $(".profile-equipment__slot > div");

          equipmentList.each((index) => {
            const item = equipmentList.eq(index);
            const slot = item.attr("class") as string;
            const grade = parseInt(item.attr("data-grade") as string, 10);
            const img = item.find("img").attr("src") as string;
            const key = item.attr("data-item") as string;
            equipments[slot] = {
              grade,
              img,
              key,
            };
          });

          let text = script.eq(2).text();

          const skills: Skill[] = [];

          if (text.includes("$.Profile =")) {
            text = text.replace("$.Profile =", "");

            // JSON
            const data = JSON.parse(text.substring(0, text.length - 1));
            const { Equip, Engrave, Skill, GemSkillEffect } = data;

            // 스킬, 트라이포드
            Object.keys(Skill).forEach((key) => {
              const skillData = Skill[key];
              const skill: Skill = {
                name: "",
                tripods: [],
              };
              Object.keys(skillData).forEach((k) => {
                const { type, value } = skillData[k];
                if (type === "NameTagBox") {
                  skill.name = value;
                }
                if (type === "TripodSkillCustom") {
                  Object.keys(value).forEach((vk) => {
                    if (value[vk].tier.length) {
                      const tripodInfo = value[vk];
                      skill.tripods.push({
                        name: tripodInfo.name.replace(tagRegex, ""),
                        level: tripodInfo.tier.replace(tagRegex, ""),
                        efffect: tripodInfo.desc.replace(tagRegex, ""),
                      });
                    }
                  });
                }
              });
              if (skill.tripods.length) {
                skills.push(skill);
              }
            });

            Object.keys(Equip).forEach((key, index) => {
              if (key.includes("Gem")) {
                const jewelData = Equip[key];
                const jewelName = jewelData.Element_000.value.replace(tagRegex, "");
                const jewelImg = `https://cdn-lostark.game.onstove.com/${jewelData.Element_001.value.slotData.iconPath}`;
                const jewelLevel = jewelData.Element_001.value.slotData.rtString;
                const jewelSkill = GemSkillEffect.find(
                  ({ EquipGemSlotIndex }: any) => EquipGemSlotIndex === index,
                ).SkillDesc.replace(tagRegex, "");
                const jewelGrade = jewelData.Element_001.value.slotData.iconGrade;
                jewels.push({
                  name: jewelName,
                  img: jewelImg,
                  level: jewelLevel,
                  skill: jewelSkill,
                  grade: jewelGrade,
                });
              }
            });

            Object.keys(equipments).forEach((key, index) => {
              const item = equipments[key];
              if (!item.key) return;

              if (Equip[item.key]) {
                const temp = Equip[item.key];
                equipments[key].name = temp.Element_000.value.replace(tagRegex, "");
                equipments[key].quality = temp.Element_001.value.qualityValue;
                const trypod = temp.Element_008?.value?.Element_000;
                if (trypod?.contentStr) {
                  equipments[key].trypod = [];
                  Object.keys(trypod?.contentStr).forEach((k) => {
                    if (trypod.contentStr[k].contentStr) {
                      equipments[key].trypod?.push(
                        trypod.contentStr[k].contentStr.replace(tagRegex, ""),
                      );
                    }
                  });
                }
                // 어빌리티 스톤
                if (index === 12) {
                  const stone = temp.Element_005?.value;
                  if (stone && typeof stone.Element_001 === "string") {
                    const ability: string = stone.Element_001?.replace(tagRegex, "");
                    const abilityList: string[] = [];
                    ability.split("[").forEach((item) => {
                      if (item.length) {
                        abilityList.push(item.replace("]", ""));
                      }
                    });
                    equipments[key].abilityList = abilityList;
                  }
                }
              } else if (Engrave[item.key]) {
                const temp = Engrave[item.key];
                equipments[key].name = temp.Element_000.value;
                equipments[key].quality = temp.Element_001.value.leftText
                  .replace(/<[^>]*>?/g, "")
                  .replace(/[^0-9]/g, "");
              }
            });
          }

          resolve({
            charImg,
            charClass,
            itemLevel: parseFloat(itemLevel),
            charLevel,
            charName: nickname,
            serverName,
            guildName,
            loadTime,
            allCharList,
            engraves,
            abilities,
            cards,
            jewels,
            wisdom,
            equipments,
            skills,
          });
        } catch (err) {
          reject(err);
          console.log(err);
        }
      })();
    });
  }

  public static async getGibbets() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { ipcRenderer } = window.require("electron");
          const request: AxiosRequestConfig = {
            url: `https://arca.live/b/lostark/53703658`,
            method: "get",
          };
          const response = await ipcRenderer.invoke("request", request);
          const parseHtml = response.data.replace("<!DOCTYPE html>", "").replace(/\r?\n|\r/g, "");
          const $ = cheerio.load(parseHtml);
          const contents = $(".article-content").text();
          const arr = contents.split("`");
          const gibbets: Gibbet[] = [];
          const serverName = "서버 : ";
          const charName = "캐릭터명 : ";
          const islandName = "영지명 : ";
          const reason = "사유 : ";

          arr.forEach((item) => {
            const textList = item.split("-");
            const gibbet: Gibbet = {
              serverName: "",
              islandName: "",
              reason: "",
              charList: [],
            };
            textList.forEach((i) => {
              if (i.length) {
                const parsed = i.trim();
                if (parsed.indexOf(serverName) === 0) {
                  const value = parsed.replace(serverName, "").trim();
                  gibbet.serverName = value;
                }
                if (parsed.indexOf(islandName) === 0) {
                  const value = parsed.replace(islandName, "").trim();
                  gibbet.islandName = value;
                }
                if (parsed.indexOf(reason) === 0) {
                  const value = parsed.replace(reason, "").trim();
                  gibbet.reason = value;
                }
                if (parsed.indexOf(charName) === 0) {
                  const value = parsed.replace(charName, "");
                  const tempArr = value.split(",");
                  tempArr.forEach((v) => gibbet.charList.push(v.trim()));
                }
              }
            });
            gibbets.push(gibbet);
          });
          resolve(gibbets);
        } catch (err) {
          reject(err);
          console.log(err);
        }
      })();
    });
  }
}

export default UserService;
