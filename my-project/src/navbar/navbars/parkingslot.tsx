export default function ParkingSlotSidebar(
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
        <summary className="text-lg">Parking Slots</summary>
        <ul className="text-md">
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.INTERACTIVE_MAP)}
              className={selectedMenu === MENU.INTERACTIVE_MAP ? "font-bold" : ""}
            >
              Interactive Map
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.PARKING_HISTORY)}
              className={selectedMenu === MENU.PARKING_HISTORY ? "font-bold" : ""}
            >
              History
            </button>
          </li>
        </ul>
      </details>
    </li>
  )
}