export default function MemberUserSidebar(
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
        <summary className="text-lg">ระบบสมาชิก</summary>
        <ul className="text-md">
         
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.MY_CARS)}
              className={selectedMenu === MENU.MY_CARS ? "font-bold" : ""}
            >
              จัดการรถ
            </button>
          </li>

          <li>
            <button
              onClick={() => setSelectedMenu(MENU.MEMBER_HISTORY)}
              className={selectedMenu === MENU.MEMBER_HISTORY ? "font-bold" : ""}
            >
              ประวัติการเข้าออกรถ
            </button>
          </li>
        </ul>
      </details>
    </li>
  )
}