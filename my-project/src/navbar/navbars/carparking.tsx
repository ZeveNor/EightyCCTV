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
        <summary className="text-lg">Car Plates</summary>
        <ul className="text-md">
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.SEARCH_PLATE)}
              className={selectedMenu === MENU.SEARCH_PLATE ? "font-bold" : ""}
            >
              Search Plate
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.SEARCH_MEMBER)}
              className={selectedMenu === MENU.SEARCH_MEMBER ? "font-bold" : ""}
            >
              Search Member
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.CAR_HISTORY)}
              className={selectedMenu === MENU.CAR_HISTORY ? "font-bold" : ""}
            >
              History
            </button>
          </li>
        </ul>
      </details>
    </li>
  )
}