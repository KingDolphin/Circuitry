const math = require("remark-math");
const katex = require("rehype-katex");

module.exports = {
  title: "OpenCircuits",
  tagline: "The free, online, circuit designer",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "OpenCircuits", // Usually your GitHub org/user name.
  projectName: "OpenCircuits", // Usually your repo name.
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css",
      type: "text/css"
    },
  ],
  themeConfig: {
    navbar: {
      title: "OpenCircuits",
      logo: {
        alt: "OpenCircuits Logo",
        src: "img/icon.svg",
      },
      items: [
        {
          label: "Docs",
          type: "doc",
          docId: "test",
          position: "left"
        },
        {
          label: "API",
          type: "doc",
          docId: "test",
          position: "left"
        },
        {
          label: "JSDocs",
          type: "doc",
          docId: "ts/app/core/utils/math/Vector",
          position: "left"
        },
        {
          label: "Other",
          type: "doc",
          docId: "test",
          position: "left"
        },
        {
          href: "https://github.com/OpenCircuits/OpenCircuits",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Style Guide",
              to: "docs/",
            },
            {
              label: "Second Doc",
              to: "docs/doc2/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discordapp.com/invite/bCV2tYFer9",
            }
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/OpenCircuits/OpenCircuits",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OpenCircuits`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "../../../../docs",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/OpenCircuits/OpenCircuits/edit/master/docs/",
          remarkPlugins: [math],
          rehypePlugins: [katex]
        },
        theme: {
          customCss: [
            require.resolve("./src/css/custom.css")
          ]
        },
      },
    ],
  ],
};
