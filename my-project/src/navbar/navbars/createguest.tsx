export default function CreateGuestPlateSidebar(
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
      <button
        className={`btn btn-neutral mt-5 ${selectedMenu === MENU.CREATE_GUEST_PLATE ? "font-bold" : ""}`}
        onClick={() => setSelectedMenu(MENU.CREATE_GUEST_PLATE)}
      >
        Create Guest Plate
      </button>
    </li>
  );
}