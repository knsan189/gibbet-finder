import { Gibbet } from "./../@types/redux/gitbbet.interface";
import { AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";

//profile-character-info__server
//game-info__guild
//profile-character-list__server
//profile-character-list__char

interface Char {
  thumbnail?: string;
  charName?: string;
  charLevel?: string;
  charClass?: string;
}

export interface Server {
  serverName: string;
  charList: Char[];
}

class UserService {
  public static async getChar(nickname: string) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { ipcRenderer } = window.require("electron");
          const request: AxiosRequestConfig = {
            url: `https://lostark.game.onstove.com/Profile/Character/${encodeURI(nickname)}`,
            method: "get",
          };
          const response = await ipcRenderer.invoke("request", request);
          const parseHtml = response.data.replace("<!DOCTYPE html>", "").replace(/\r?\n|\r/g, "");
          const $ = cheerio.load(parseHtml);
          const charClass = $(".profile-character-info__img").attr("alt") as string;
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

          resolve({
            charClass,
            itemLevel: parseFloat(itemLevel),
            charLevel,
            charName: nickname,
            serverName,
            guildName,
            loadTime,
            allCharList,
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
