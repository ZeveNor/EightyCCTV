export default function VideoRecordSidebar(
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
      <details open>
        <summary className="text-lg">ระบบกล้องวงจรปิด</summary>
        <ul className="text-md">
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.WATCH_RECORDS)}
              className={selectedMenu === MENU.WATCH_RECORDS ? "font-bold" : ""}
            >
              สตรีมภาพกล้องวงจรปิด
            </button>
          </li>
        </ul>
      </details>
    </li>
  )
}