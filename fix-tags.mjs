import fs from "fs";

const p = "components/dashboard/tasks/tasks-screen.tsx";
let t = fs.readFileSync(p, "utf8");
const end = "</" + "div" + ">";

for (const tag of ["motionCand", "motionPage", "motionRow", "motionDiv"]) {
  t = t.split("</" + tag + ">").join(end);
}
t = t.split("<motionDiv className").join("<div className");
t = t.split("<motionDiv>").join("<div>");

t = t.replace(
  /<motionDiv>\s*<span>İş yükü<\/span>/,
  '<div className="mb-0.5 flex justify-between text-[11px] text-[#5a6a85]"><span>İş yükü</span>',
);
t = t.split("<motionDiv>").join("<div>");

t = t.replace(
  /className=\{\`\$\{RANK_BORDER\[i\] \?\? ""\} \$\{assigned \? "border-\[var\(--teal\)\] bg-\[rgba\(0,201,167,0\.05\)\]" : ""\}\`\}/,
  "`flex items-center gap-3.5 rounded-[var(--border-radius-lg)] border-[1.5px] border-[var(--border)] bg-white p-3.5 transition-colors hover:border-[var(--teal)] ${RANK_BORDER[i] ?? \"\"} ${assigned ? \"border-[var(--teal)] bg-[rgba(0,201,167,0.05)]\" : \"\"}`",
);

t = t.replace(
  /<div className="bg-\[var\(--teal\)\]" style=\{\{ width: `\$\{skillPct\}%` \}\} \/>/,
  '<motionDiv className="h-full rounded-full bg-[var(--teal)]" style={{ width: `${skillPct}%` }} />',
);
t = t.split('<motionDiv className="h-full').join('<div className="h-full');

t = t.replace(
  /<div className="bg-\[var\(--blue\)\]" style=\{\{ width: `\$\{workloadPct\}%` \}\} \/>/,
  '<div className="h-full rounded-full bg-[var(--blue)]" style={{ width: `${workloadPct}%` }} />',
);

const cut = t.indexOf("function rankBadgeClass");
if (cut !== -1) {
  const endIdx = t.indexOf("\n}", cut) + 2;
  t = t.slice(0, endIdx);
}

fs.writeFileSync(p, t);
console.log("ok");
