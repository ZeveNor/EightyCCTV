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
      <details>
        <summary className="text-lg">Video Record</summary>
        <ul className="text-md">
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.WATCH_RECORDS)}
              className={selectedMenu === MENU.WATCH_RECORDS ? "font-bold" : ""}
            >
              Watch Records
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.SEARCH_RECORDS)}
              className={selectedMenu === MENU.SEARCH_RECORDS ? "font-bold" : ""}
            >
              Search Records
            </button>
          </li>
        </ul>
      </details>
    </li>
  )
}