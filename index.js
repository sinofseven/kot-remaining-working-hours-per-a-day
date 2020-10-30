function isTimeCard() {
    /**
     * KoTのタイムカードのページか判定する
     * @return {boolean}
     */
    const title = document.querySelector("h1.htBlock-pageTitle");
    if (title == null) return false;
    return title.textContent.includes("タイムカード");
}

function main() {
    /**
     * 処理の本体
     */

    console.log("pre get");

    // 表からのデータ取得
    const laborStandardsTime = getElementNumber("労働基準時間", ".specific-table_800 > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1)");
    const overAndUnderTime = getElementNumber("過不足時間", "td.custom14") * -1;
    const workday = getElementNumber("平日", "div.work_count");
    const absence = getElementNumber("欠勤", "div.absent_count");
    const paidHoliday = getHolidayCountElementNumber("有休", ".specific-daysCount_1 > li:nth-child(4) > div:nth-child(2)");
    const compensatoryHoliday = getHolidayCountElementNumber("代休", ".specific-daysCount_1 > li:nth-child(5) > div:nth-child(2)");
    const specialLeave = getHolidayCountElementNumber("特別休暇", ".specific-daysCount_1 > li:nth-child(6) > div:nth-child(2)");

    console.log("pre calc")

    const remainingDays = Math.ceil((laborStandardsTime / 8) - (workday + absence + paidHoliday + compensatoryHoliday + specialLeave));
    console.log(remainingDays);
    let oneDateAverageBalanceWorkingHours = overAndUnderTime < 0 ? 0 : overAndUnderTime / remainingDays;
    console.log(oneDateAverageBalanceWorkingHours);

    if (isNaN(oneDateAverageBalanceWorkingHours) || !isFinite(oneDateAverageBalanceWorkingHours)) oneDateAverageBalanceWorkingHours = 0;

    console.log("pre insert")

    // 挿入処理
    insertThElement();
    insertTdElement(oneDateAverageBalanceWorkingHours);

    console.log("complete");
}

function getElementNumber(name, selector) {
    /**
     * 要素のを数値変換して取得する
     * @param name {string} 要素の名前 (エラー出力に使用する)
     * @param selector {string} 要素のCSS Selector
     */
    const cell = document.querySelector(selector);
    if (cell == null) throw new Error(`${name}の取得に失敗しました`);
    const num = Number(cell.textContent);
    if (isNaN(num)) throw new Error(`${name}の数値変換に失敗しました`);
    return num;
}

function getHolidayCountElementNumber(name, selector) {
    /**
     * 日数集計のholicay_countの要素のを数値変換して取得する
     * @param name {string} 要素の名前 (エラー出力に使用する)
     * @param selector {string} 要素のCSS Selector
     */
    const cell = document.querySelector(selector);
    if (cell == null) throw new Error(`${name}の取得に失敗しました`);
    const text = cell.textContent.split("(")[0];
    const num = Number(text);
    if (isNaN(num)) throw new Error(`${name}の数値変換に失敗しました`);
    return num;
}

function createInsertThElement() {
    /**
     * 挿入用のTh Elementを作成する
     * @return {HTMLTableHeaderCellElement}
     */
    const th = document.createElement("th");
    const p = document.createElement("p")
    p.textContent = "一日あたりの残労働時間"
    th.appendChild(p);
    return th;
}

function createInsertTdElement(hours) {
    /**
     * 挿入用のTd Elementを作成する
     * @param hours {number} 一日あたりの残労働時間
     * @return {HTMLTableDataCellElement}
     */
    const td = document.createElement("td");
    const showHours = Math.floor(hours);
    const rateMinute = hours - showHours;
    const showMinute = Math.ceil(60 * rateMinute);
    td.textContent = `${showHours}h ${showMinute}m`;
    return td;
}

function insertThElement() {
    const th = createInsertThElement();
    const tr = document.querySelector(".specific-table_800 > thead:nth-child(1) > tr:nth-child(1)");
    tr.appendChild(th);
}

function insertTdElement(hours) {
    /**
     * Td Elementを挿入する
     * @param hours {number} 一日あたりの残労働時間
     */
    const td = createInsertTdElement(hours);
    const tr = document.querySelector(".specific-table_800 > tbody:nth-child(2) > tr:nth-child(1)");
    tr.appendChild(td);
}

console.log("=== start ===")
if (isTimeCard()) {
    console.log("=== is time card ===");
    main()
    console.log("=== main finish ===");
}
