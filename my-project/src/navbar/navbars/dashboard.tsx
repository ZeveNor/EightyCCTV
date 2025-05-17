export default function DashboardSidebar(
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
        className={`text-lg ${selectedMenu === MENU.DASHBOARD ? "font-bold" : ""}`}
        onClick={() => setSelectedMenu(MENU.DASHBOARD)}
      >
        Dashboard
      </button>
    </li>
  );
}