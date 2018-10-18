export class AlertsStateModel {
    constructor(public top: Array<any> = []) { }
}
export class HistoryStateModel {
    constructor(public list: Array<any> = []) { }
}
export class InsertStateModel {
    constructor(public money: number = 0) { }
}

export class ValueLabelModel {
    constructor(
        public value: string,
        public label: string) { }
}

export class SettingsMemuItemModel extends ValueLabelModel {
    constructor(
        public value: string,
        public label: string,
        /** assets,liabilities,capital,expenses,income */
        public accountsType: string) {
        super(value, label)
        this.accountsType = accountsType
    }
}

export class SettingsModel {
    constructor(
        public selectedSection: string,
        public data: any = {}
    ) { }
}

export class SettingsDataModel {
    constructor(
        public sectionId: string,
        public itemList: string[] = [],
        public leftMenuList: SettingsMemuItemModel[] = [],
        public rightMenuList: SettingsMemuItemModel[] = []
    ) { }
}

export class UserState {
    constructor(
        public token: string,
        public token_secret: string,
        public user_id: string,
        public user: string,
        public sections: string,
        public accounts: string,
        public frequentItems: string) { }
}

export abstract class IPostData {
    abstract GetFormData(): FormData
}

/**
 * 후잉 엑서스 토큰 발급용 데이터
 */
export class GetWhooingAccessTokenData extends IPostData {
    GetFormData(): FormData {
        let formData = new FormData()
        formData.append('app_id', this.app_id)
        formData.append('app_secret', this.app_secret)
        formData.append('token', this.token)
        formData.append('pin', this.pin)
        return formData
    }
    constructor(
        public app_id: string,
        public app_secret: string,
        public token: string,
        public pin: string) {
        super()
    }
}

/**
 * 후잉 로그인 토큰 발급용 데이터
 */
export class GetWhooingAppTokenData extends IPostData {
    GetFormData(): FormData {
        let formData = new FormData()
        formData.append('app_id', this.app_id)
        formData.append('app_secret', this.app_secret)
        return formData
    }
    constructor(
        public app_id: string,
        public app_secret: string) {
        super()
    }
}

/**
 * 후잉 거래 입력용 데이터
 */
export class PostWhooingEntriesData extends IPostData {
    constructor(
        /** 섹션의 고유번호 Example Value : s99 */
        public section_id: string,
        /** 거래가 일어난 날짜 Example Value : 20110812 */
        public l_account: string,
        /** 왼쪽의 항목 고유번호 Example Value : x20 */
        public l_account_id: string,
        /** 오른쪽의 계정 Example Value : assets */
        public r_account: string,
        /** 오른쪽의 항목 고유번호 Example Value : x4 */
        public r_account_id: string,
        /** 아이템 or 거래처. 괄호메모나 명령어도 포함. Example Value : 후원(과장학금)**2 */
        public item: string,
        /** 거래액 Example Value : 10000 */
        public money: number,
        /** 거래에 들어가는 보충 메모. 일기. 이 값으로는 검색할 수 없음. Example Value : 오늘도 어김없이 빠져나갔다 */
        public memo: string) {
        super()
    }
    GetFormData(): FormData {
        let formData = new FormData()
        formData.append('section_id', this.section_id)
        formData.append('l_account', this.l_account)
        formData.append('l_account_id', this.l_account_id)
        formData.append('r_account', this.r_account)
        formData.append('r_account_id', this.r_account_id)
        formData.append('item', this.item)
        formData.append('money', this.money.toString())
        formData.append('memo', this.memo)
        return formData
    }
}

export class UserTokenData {
    constructor(
        public token: string,
        public token_secret: string,
        public user_id: string,
    ) { }
}

export class AlertModel {
    constructor(
        public message: string,
        public icon: string,
        public dismissible = false,
        public outline = false,
        public transition: string,
        /** success, info, warning, error*/
        public type = 'error',
        public value = true) { }
}


export interface WhooingResponseModel<T> {
    code: number
    message: string
    error_parameters: object
    rest_of_api: number
    results: T
}

export interface WhooingResponseArrayModel<T> extends WhooingResponseModel<Array<T>> { }

export class WhooingSectionModel {
    constructor(
        public section_id: string,
        public title: string,
        public memo: string,
        public currency: string,
        public isolation: string,
        public total_assets: number,
        public total_liabilities: number,
        public skin_id: number,
        public decimal_places: number,
        public date_format: string) { }
}

export class WhooingAccountModel {
    constructor(
        public account_id: string,
        public type: string,
        public title: string,
        public memo: string,
        public open_date: number,
        public close_date: number,
        public category: string
    ) { }
}

export class WhooingFrequentItem {
    constructor(
        public item_id: string,
        public item: string,
        public money: number,
        public l_account: string,
        public l_account_id: string,
        public r_account: string,
        public r_account_id: string
    ) { }
}


export class WhooingUserModel {
    constructor(
        public user_id: number,
        public username: string,
        public last_ip: string,
        public last_login_timestamp: number,
        public created_timestamp: number,
        public modified_timestamp: number,
        public language: string,
        public level: string,
        public expire: number,
        public timezone: string,
        public currency: string,
        public country: string,
        public image_url: string,
        public mileage: number
    ) { }
}

export class WhooingAccountTypeModel {
    constructor(
        public assets: Array<WhooingAccountModel>,
        public liabilities: Array<WhooingAccountModel>,
        public capital: Array<WhooingAccountModel>,
        public income: Array<WhooingAccountModel>,
        public expenses: Array<WhooingAccountModel>,
    ) { }
}


export class WhooingEntryModel {
    constructor(
        public entry_id: number,
        public entry_date: number,
        public l_account: string,
        public l_account_id: string,
        public r_account: string,
        public r_account_id: string,
        public item: string,
        public money: number,
        public total: string,
        public memo: string,
        public app_id: number
    ) { }
}