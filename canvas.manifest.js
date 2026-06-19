export const manifest = {
  screens: {
    scr_2lxtf3: { name: "Home", route: "/", position: { "x": 160, "y": 2200 } },
    scr_6z3ady: { name: "Daftar / Login", route: "/auth", position: { "x": 160, "y": 220 } },
    scr_u1x16k: { name: "Buat Photostrip", route: "/create", position: { "x": 1560, "y": 2200 } },
    scr_v70phf: { name: "Galeri", route: "/gallery", position: { "x": 2960, "y": 2200 } }
  },
  sections: {
    sec_6l63ae: { name: "Authentication", x: 0, y: 0, width: 1520, height: 1180 },
    sec_yb12sb: { name: "Main App", x: 0, y: 1980, width: 4320, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_6l63ae", children: [
    { kind: "screen", id: "scr_6z3ady" }]
  },
  { kind: "section", id: "sec_yb12sb", children: [
    { kind: "screen", id: "scr_2lxtf3" },
    { kind: "screen", id: "scr_u1x16k" },
    { kind: "screen", id: "scr_v70phf" }]
  }]

};