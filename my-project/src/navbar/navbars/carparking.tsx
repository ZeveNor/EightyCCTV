export default function CarPlateSidebar(
  { MENU,
    selectedMenu,
    setSelectedMenu,
  }:
  { MENU: any;
    selectedMenu: string;
    setSelectedMenu: (menu: string) => void;
  }) {
  return (
    <li>
      <details>
        <summary className="text-lg">ระบบป้ายทะเบียน</summary>
        <ul className="text-md">
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.CARPLATE_DETECTOR)}
              className={selectedMenu === MENU.CARPLATE_DETECTOR ? "font-bold" : ""}
            >
              ตรวจจับป้ายทะเบียน
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.CAR_MANAGEMENT)}
              className={selectedMenu === MENU.CAR_MANAGEMENT ? "font-bold" : ""}
            >
              จัดการรถของสมาชิก
            </button>
          </li>
           <li>
            <button
              onClick={() => setSelectedMenu(MENU.CARPLATE_HISTORY)}
              className={selectedMenu === MENU.CARPLATE_HISTORY ? "font-bold" : ""}
            >
              ประวัติการเข้าออก
            </button>
          </li>
        </ul>
      </details>
    </li>
  )
}