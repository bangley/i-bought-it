import { ISettingsSection } from "@/models/ISettingsSection";
import { ISettingsState } from "@/models/ISettingsState";
import { SettingsSection } from "@/models/SettingsSection";
import store, { SettingsModule, UserModule } from "@/store/store";
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";

const LOCALSTORAGEKEY = "Settings";
const initValue = (JSON.parse(
  localStorage.getItem(LOCALSTORAGEKEY) || "null",
) as ISettingsState) || {
  sections: [],
};

function setLocalStorage(state: ISettingsState | null): void {
  if (state) {
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(state));
  } else {
    localStorage.removeItem(LOCALSTORAGEKEY);
  }
}

@Module({ store, name: "Settings" })
export class Settings extends VuexModule implements ISettingsState {
  /** 섹션 설정 */
  public sections: ISettingsSection[] = initValue.sections;

  @Mutation
  public Set_SettingsSections(sections: ISettingsSection[]) {
    this.sections = sections;
    setLocalStorage(this);
  }

  /** 섹션설정 추가 */
  @Mutation
  public Push_SettingsSection(newSection: ISettingsSection) {
    this.sections.push(newSection);
    setLocalStorage(this);
  }

  /** 대시보드 표시 항목 추가 */
  @Mutation
  public Push_PinedItem(payload: {
    section_id: string;
    account_id: string;
  }): void {
    const section = SettingsHelper.Get_SettingSecion(this, payload.section_id);
    section.pinedList.push(payload.account_id);
    setLocalStorage(this);
  }

  /** 대시보드 표시 항목 설정 */
  @Mutation
  public Set_PinedList(payload: {
    section_id: string;
    pinedList: string[];
  }): void {
    const section = SettingsHelper.Get_SettingSecion(this, payload.section_id);
    section.pinedList = payload.pinedList;
    setLocalStorage(this);
  }

  @Action
  public CLEAR_Settings() {
    this.Set_SettingsSections([]);
  }

  /** 대시보드 표시 항목 토글 */
  @Action
  public Toggle_PinedItem(payload: {
    section_id: string;
    account_id: string;
  }): void {
    const section = SettingsHelper.Get_SettingSecion(this, payload.section_id);
    if (section.pinedList.some((p) => p === payload.account_id)) {
      const newPinedList = section.pinedList.filter(
        (p) => p === payload.account_id,
      );
      this.Set_PinedList({
        section_id: payload.section_id,
        pinedList: newPinedList,
      });
    } else {
      this.Push_PinedItem(payload);
    }
  }
}

export namespace SettingsHelper {
  /** section_id에 해당하는 섹션 설정을 불러옵니다.
   *  해당 하는 항목이 없을경우 새 섹션 설정을 추가합니다.
   */
  export function Get_SettingSecion(
    settingsModule: Settings,
    section_id: string,
  ): ISettingsSection {
    const item = settingsModule.sections.find(
      (o) => o.section_id === section_id,
    );
    if (item) {
      return item;
    } else {
      if (UserModule.sectionList.some((o) => o.section_id === section_id)) {
        const newSection = new SettingsSection(section_id);
        settingsModule.Push_SettingsSection(newSection);
        return newSection;
      }
    }
    throw new Error(`섹션아이디 [${section_id}]는 유효하지 않습니다.`);
  }

  /**
   * 대시보드 표시 항목일경우 true
   * @param payload 조건
   * @param settings 셋팅모듈
   */
  export const IsPined = (
    payload: { section_id: string; account_id: string },
    settings: Settings = SettingsModule,
  ): boolean => {
    return settings.sections.some((section) => {
      return (
        section.section_id === payload.section_id &&
        section.pinedList.includes(payload.account_id)
      );
    });
  };
}
