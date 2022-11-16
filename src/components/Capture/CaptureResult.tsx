import { Box, debounce, TextField } from "@mui/material";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Gibbet } from "../../@types/redux/gitbbet.interface";
import { RootState } from "../../redux/reducers";
import UserService from "../../service/UserService";
import CaptureResultTag from "./CaptureResultTag";

interface Props {
  word: CaptureWord;
  index: number;
  lastIndex: boolean;
}

const CaptureResult = ({ word, index, lastIndex }: Props) => {
  const [user, setUser] = useState<User>();
  const [status, setStatus] = useState<"loading" | "no" | "gibbet" | "ok">("loading");
  const { gibbets } = useSelector((state: RootState) => state.gibbets);

  const getUser = useCallback(
    async (name: string) => {
      try {
        setStatus("loading");
        const response = await UserService.getChar(name);
        if (!response) throw new Error();
        const gibbet = await new Promise<Gibbet | undefined>((resolve) => {
          response.allCharList.forEach(({ serverName, charList }) => {
            charList.forEach((char: Char) => {
              for (let i = 0; i < gibbets.length; i++) {
                if (char.charName && gibbets[i].charList.includes(char.charName)) {
                  resolve(gibbets[i]);
                  return;
                }
              }
            });
          });
          resolve(undefined);
        });
        if (gibbet) {
          setStatus("gibbet");
          return;
        }
        setUser(response);
        setStatus("ok");
      } catch (error) {
        setUser(undefined);
        setStatus("no");
      }
    },
    [gibbets],
  );

  useEffect(() => {
    getUser(word.text);
  }, [word, getUser]);

  const delayQuery = useMemo(
    () => debounce((inputValue: string) => getUser(inputValue), 500),
    [getUser],
  );
  const onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => delayQuery(value);

  return (
    <Box display="flex" alignItems="start" pb={lastIndex ? 0 : 1}>
      <Box width={300} mr={1} display="flex">
        <TextField
          defaultValue={word.text}
          size="small"
          fullWidth
          onChange={onChange}
          label={`${index + 1}번`}
          helperText={`정확도 : ${Math.floor(word.confidence)}점`}
        />
      </Box>
      <CaptureResultTag type={status} user={user} />
    </Box>
  );
};

export default CaptureResult;
