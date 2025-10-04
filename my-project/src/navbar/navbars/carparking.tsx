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
              onClick={() => setSelectedMenu(MENU.CARPLATE_DETECTOR)}
              className={selectedMenu === MENU.CARPLATE_DETECTOR ? "font-bold" : ""}
            >
              Carplate Detector
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.CAR_MANAGEMENT)}
              className={selectedMenu === MENU.CAR_MANAGEMENT ? "font-bold" : ""}
            >
              Cars Management
            </button>
          </li>
        </ul>
      </details>
    </li>
  )
}