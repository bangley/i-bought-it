import { postWhooingEntries } from "@/api/PostWhooingEntries";
import { WhooingAccount } from "@/models/EnumWhooingAccount";
import {
  IPostWhooingEntriesData,
  PostWhooingEntriesData,
} from "@/models/PostWhooingEntriesData";
import { IEntryInput } from "@/models/Types";
import { UserHelper } from "@/store/modules/User";
import { AppDataModule, EntriesModule } from "@/store/store";
import { WhooingDate } from "@/utils/WhooingDate";

export namespace EntriesInputHelper {
  export async function PushEntryAsync(payload: IEntryInput) {
    const data = CreatePostWhooingEntiesData(payload);
    if (!data) {
      throw Error("거래입력 아이템 생성 실패");
    }
    const res = await postWhooingEntries(new PostWhooingEntriesData(data));
    if (!res || res.code !== 200) {
      throw Error("거래 입력 실패");
    }
    const entries = res.results;
    EntriesModule.Push_EntryItem({
      section_id: payload.sId,
      data: entries,
    });

    entries
      .filter(
        (item) =>
          Math.floor(Number(item.entry_date)) <=
          WhooingDate.ConvertNumber(new Date()),
      )
      .forEach((item) => {
        const section_id = payload.sId;
        const money = item.money;

        UpdateBalanceState({
          section_id,
          account: item.l_account,
          account_id: item.l_account_id,
          money,
          position: "left",
        });

        UpdateBalanceState({
          section_id,
          account: item.r_account,
          account_id: item.r_account_id,
          money,
          position: "right",
        });
      });
  }

  export function UpdateBalanceState({
    section_id,
    account,
    account_id,
    money,
    position,
  }: {
    section_id: string;
    account: WhooingAccount;
    account_id: string;
    money: string | number;
    position: "left" | "right";
  }) {
    switch (account) {
      case WhooingAccount.assets:
        AppDataModule.Add_Balance({
          key: { section_id, account_id },
          addBalance: Number(money) * (position === "left" ? 1 : -1),
        });
        break;
      case WhooingAccount.liabilities:
        AppDataModule.Add_Balance({
          key: { section_id, account_id },
          addBalance: Number(money) * (position === "left" ? -1 : 1),
        });
        break;
    }
  }

  function CreatePostWhooingEntiesData(
    payload: IEntryInput,
  ): IPostWhooingEntriesData | undefined {
    const left = UserHelper.GetAccount(payload.sId, payload.left);
    const right = UserHelper.GetAccount(payload.sId, payload.right);
    if (left && right) {
      const result = {
        section_id: payload.sId,
        l_account: left.account,
        l_account_id: left.account_id,
        r_account: right.account,
        r_account_id: right.account_id,
        item: payload.item,
        money: Number(payload.money),
        memo: payload.memo || "",
        entry_date: payload.date
          ? WhooingDate.ConvertNumber(payload.date)
          : undefined,
      };
      return result;
    }
  }
}
