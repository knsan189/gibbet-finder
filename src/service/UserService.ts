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
}

export default UserService;
