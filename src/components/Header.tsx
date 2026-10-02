import { Page } from "./Shared";

interface HeaderProps {
  page: Page;
  onSettingsClick: () => void;
}

const GAME_LINK = { href: "#/", title: "Back to the game", icon: "sports_esports" };

function Header({ page, onSettingsClick }: HeaderProps): JSX.Element {
  // On the rules or stats page, that page's own icon becomes a link back to the game.
  const rulesLink =
    page === Page.rules
      ? GAME_LINK
      : { href: "#/rules", title: "How to play", icon: "help" };
  const statsLink =
    page === Page.stats
      ? GAME_LINK
      : { href: "#/stats", title: "Statistics", icon: "bar_chart" };

  return (
    <header>
      <div className="left">
        <a id="icons" href="https://www.dimitrifrazao.com">
          <i className="material-symbols-outlined">home</i>
        </a>
      </div>
      <h1 className="title">Wordle</h1>
      <div className="right">
        {[rulesLink, statsLink].map((link) => (
          <a
            key={link.title}
            id="icons"
            className="material-symbols-outlined"
            href={link.href}
            title={link.title}
          >
            {link.icon}
          </a>
        ))}
        <span
          id="icons"
          className="material-symbols-outlined"
          style={{ cursor: "pointer" }}
          title="Settings"
          onClick={onSettingsClick}
        >
          settings
        </span>
      </div>
    </header>
  );
}

export default Header;
