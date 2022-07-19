import { Client, Message } from "@line/bot-sdk";
import { google } from "googleapis";

const sheetConfig = {
  spreadsheetId: process.env.SPREADSHEET_ID,
};

const botConfig = {
  botCommandsPicture: process.env.BOTCOMMANDS_PHOTO,
};

const WebhookService = async (event: any, client: Client) => {
  if (event.type === "message" && event.message.type === "text") {
    const { text } = event.message;
    const myArray = text.split(" ");
    const sheets = await authentication();
    const { userId, groupId } = event.source;
    const isGroupId =
      groupId === "Ccf8acaf85b4dfb041b51ecd9fc832cb1" ||
      groupId === "Cbbb22e36b4b56d35cc02dda793b13747";

    if (!isGroupId) {
      return null;
    }
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetConfig.spreadsheetId,
      range: "Main",
    });

    let payload: Message = {
      type: "text",
      text: "",
    };
    let rows = res?.data?.values!;
    let resultText: any = [];
    switch (myArray[0]) {
      case "คำสั่งข้าวเช้า":
        const imagePayload: Message = {
          type: "image",
          originalContentUrl: botConfig.botCommandsPicture || "",
          previewImageUrl: botConfig.botCommandsPicture || "",
        };

        return client.replyMessage(event.replyToken, imagePayload);

      case "สรุปข้าวเช้า":
        if (rows.length !== 1) {
          for (let i = 1; i < rows.length; i++) {
            let spare = rows[i][3] === undefined ? `` : `สำรอง ${rows[i][3]}`;
            resultText.push(`\t- ${rows[i][1]} : ${rows[i][2]} ${spare}\n`);
          }
          resultText = resultText.join("");
          console.log(`RESULT_TEXT: \n${resultText}`);
          payload = {
            type: "text",
            text: `สรุปข้าวเช้า: \n` + resultText,
          };
        } else {
          console.log("No order");
          payload = {
            type: "text",
            text: `ยังไม่ได้สั่งข้าวเลยนะฮะ ʕ•́ᴥ•̀ʔっ \n` + resultText,
          };
        }
        return client.replyMessage(event.replyToken, payload);

      case "ข้าวเช้า":
        if (myArray[1] === undefined) {
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: `สวัสดีครับ ʕ•́ᴥ•̀ʔっ\nสั่งข้าวได้เลยนะฮะ  \n`,
          });
        }
        const { displayName } = await client.getGroupMemberProfile(
          `${groupId}`,
          `${userId}`
        );

        let date = new Date(event.timestamp);
        let dateString =
          date.getDate() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getFullYear() +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds();

        const storeData = [dateString, displayName, myArray[1], myArray[2]];

        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetConfig.spreadsheetId,
          range: "Main",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [storeData],
          },
        });

        let arrayEmpty = "สำรอง";
        if (myArray[2] === undefined) {
          arrayEmpty = "";
          myArray[2] = "";
        }

        payload = {
          type: "text",
          text: `น๊อล ${displayName}\nอยากกิน "${myArray[1]}" ${arrayEmpty}${myArray[2]} ครับแม่`,
        };

        return client.replyMessage(event.replyToken, payload);

      case "ตัดยอดข้าวเช้า":
        if (rows.length !== 1) {
          for (let i = 1; i < rows.length; i++) {
            let spare = rows[i][3] === undefined ? `` : `สำรอง ${rows[i][3]}`;
            let result_text = `\t- ${rows[i][1]} : ${rows[i][2]} ${spare}\n`;
            resultText.push(result_text);
          }
          resultText = resultText.join("");
          console.log(`RESULT_TEXT: \n${resultText}`);

          // * Store data to the backup sheet.
          await sheets.spreadsheets.values.append({
            spreadsheetId: sheetConfig.spreadsheetId,
            range: "Backup",
            valueInputOption: "USER_ENTERED",
            requestBody: {
              values: rows,
            },
          });

          // * Delete data of the main sheet.

          const params = {
            spreadsheetId: sheetConfig.spreadsheetId,
            resource: {
              requests: [
                {
                  deleteDimension: {
                    range: {
                      sheetId: 0,
                      dimension: "ROWS",
                      startIndex: 1,
                      endIndex: 999,
                    },
                  },
                },
              ],
            },
          };

          await sheets.spreadsheets.batchUpdate(params);

          payload = {
            type: "text",
            text: `ตัดยอดข้าวเช้า: \n` + resultText,
          };
        } else {
          console.log("No order");
          payload = {
            type: "text",
            text: `ยังไม่ได้สั่งข้าวเลยนะฮะ ʕ•́ᴥ•̀ʔっ \n` + resultText,
          };
        }
        return client.replyMessage(event.replyToken, payload);

      case "ยกเลิกข้าวเช้า":
        const Name = await client.getGroupMemberProfile(
          `${groupId}`,
          `${userId}`
        );
        const cancelName = Name.displayName.toString();

        const result = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetConfig.spreadsheetId,
          range: "Main!B:B",
        });

        const resultValue = result?.data?.values!;

        const isOrder: boolean = resultValue.length > 1;
        if (isOrder) {
          let ranges = [];
          let current = {
            dimension: "ROWS",
            startIndex: 0,
            endIndex: 0,
          };
          for (let i = 0; i < resultValue.length; i++) {
            if (resultValue[i][0] == cancelName) {
              if (current.endIndex === i - 1 || current.startIndex === 0) {
                if (current.startIndex === 0) {
                  current.startIndex = i;
                }
                current.endIndex = i + 1;
              } else {
                ranges.push(current);
                current = {
                  dimension: "ROWS",
                  startIndex: i,
                  endIndex: i + 1,
                };
              }
            }
          }
          if (current.startIndex !== 0) {
            ranges.push(current);
          }
          let requests = ranges
            .map((range) => {
              return {
                deleteDimension: {
                  range: range,
                },
              };
            })
            .reverse();

          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: sheetConfig.spreadsheetId,
            requestBody: {
              requests: requests,
            },
          });
          payload = {
            type: "text",
            text: `น๊อล ${cancelName} ยกเลิกเข้าข้าวแล้วครับแม่`,
          };
        } else {
          payload = {
            type: "text",
            text: `น๊อล ${cancelName} ยังไม่ได้สั่งข้าวเลยนะฮะ`,
          };
        }
        return client.replyMessage(event.replyToken, payload);

      case "ข้าวเช้าออกปุย":
        client.leaveGroup(`${groupId}`);
        break;

      default:
        return null;
    }
  } else {
    return null;
  }
};

const authentication = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const _client = await auth.getClient();
  return google.sheets({
    version: "v4",
    auth: _client,
  });
};

export default WebhookService;
