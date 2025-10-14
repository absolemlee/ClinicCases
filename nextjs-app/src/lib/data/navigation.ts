export type NavigationSection = {
  title: string;
  links: Array<{
    label: string;
    tagline: string;
    href: string;
  }>;
};

export const navigationSections: NavigationSection[] = [
  {
    title: "Operational Workflows",
    links: [
      {
        label: "Dashboard",
        tagline: "Board.php",
        href: "/dashboard"
      },
      {
        label: "Cases",
        tagline: "Cases.php",
        href: "/cases"
      },
      {
        label: "Messages",
        tagline: "Messages.php",
        href: "/messages"
      },
      {
        label: "Journals",
        tagline: "Journals.php",
        href: "/journals"
      }
    ]
  },
  {
    title: "Administration",
    links: [
      {
        label: "Users",
        tagline: "Users.php",
        href: "/users"
      },
      {
        label: "Groups",
        tagline: "Group.php",
        href: "/groups"
      },
      {
        label: "Utilities",
        tagline: "Utilities.php",
        href: "/utilities"
      }
    ]
  },
  {
    title: "Personal",
    links: [
      {
        label: "Home",
        tagline: "Home.php",
        href: "/home"
      },
      {
        label: "Preferences",
        tagline: "Prefs.php",
        href: "/preferences"
      }
    ]
  },
  {
    title: "Documentation",
    links: [
      {
        label: "Migration Plan",
        tagline: "nextjs-migration-guide.md",
        href: "/documentation/migration"
      }
    ]
  }
];
