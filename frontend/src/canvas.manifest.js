export const manifest = {
  screens: {
    scr_toczet: { name: "Home", route: "/", position: { "x": 160, "y": 220 } },
    scr_ii84nw: { name: "How It Works", route: "/how-it-works", position: { "x": 1560, "y": 220 } },
    scr_j4ordu: { name: "Search", route: "/search", position: { "x": 2960, "y": 220 } },
    scr_imrrk8: { name: "Help", route: "/help", position: { "x": 4360, "y": 220 } },
    scr_tmb5mr: { name: "No Results", route: "/no-results", position: { "x": -54.47, "y": 2442.24 } },
    scr_p4ote8: { name: "About", route: "/about", position: { "x": 5760, "y": 220 } },
    scr_ku0sxw: { name: "Map View", route: "/map-view", position: { "x": 0, "y": 0 }, isDefaultRow: true },
    scr_4b8q7b: { name: "Login", route: "/login" },
    scr_4bz571: { name: "Pharmacy Dashboard", route: "/pharmacy/dashboard" },
    scr_l3fwnz: { name: "Admin Panel", route: "/admin" }
  },
  sections: {
    sec_0lrvhm: { name: "Main Navigation", x: 0, y: 0, width: 7120, height: 1180 },
    sec_5rlcan: { name: "Search Results", x: -214.47, y: 2222.24, width: 1520, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_0lrvhm", children: [
    { kind: "screen", id: "scr_toczet" },
    { kind: "screen", id: "scr_ii84nw" },
    { kind: "screen", id: "scr_j4ordu" },
    { kind: "screen", id: "scr_imrrk8" },
    { kind: "screen", id: "scr_p4ote8" }]
  },
  { kind: "section", id: "sec_5rlcan", children: [
    { kind: "screen", id: "scr_tmb5mr" }]
  },
  { kind: "screen", id: "scr_ku0sxw" }]

};