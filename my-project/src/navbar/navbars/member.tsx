export default function MemberSidebar(
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
        <summary className="text-lg">Members</summary>
        <ul className="text-md">
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.MANAGE_MEMBER)}
              className={selectedMenu === MENU.ADD_MEMBER ? "font-bold" : ""}
            >
              Members Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedMenu(MENU.EDIT_MEMBER)}
              className={selectedMenu === MENU.EDIT_MEMBER ? "font-bold" : ""}
            >
              Edit Member
            </button>
          </li>

          <li>
            <button
              onClick={() => setSelectedMenu(MENU.MEMBER_HISTORY)}
              className={selectedMenu === MENU.MEMBER_HISTORY ? "font-bold" : ""}
            >
              History
            </button>
          </li>
        </ul>
      </details>
    </li>
  )
}