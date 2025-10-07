export default function ParkingSlotUserSidebar(
  { MENU,
    selectedMenu,
    setSelectedMenu,
  }:
  {
    MENU: any;
    selectedMenu: string;
    setSelectedMenu: (menu: string) => void;
  }) {
  return (
    <li>
      <details open>
        <summary className="text-lg">ระบบลานจอดรถ</summary>
        <ul className="text-md">
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.INTERACTIVE_MAP)}
              className={selectedMenu === MENU.INTERACTIVE_MAP ? "font-bold" : ""}
            >
              แผนผังลานจอดรถ
            </button>
          </li>
        </ul>
      </details>
    </li>
  )
}