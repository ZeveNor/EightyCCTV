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
        <summary className="text-lg">Video Record</summary>
        <ul className="text-md">
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.WATCH_RECORDS)}
              className={selectedMenu === MENU.WATCH_RECORDS ? "font-bold" : ""}
            >
              Watch Records<span className="badge badge-soft badge-error">Live</span>
            </button>
          </li>
        </ul>
      </details>
    </li>
  )
}