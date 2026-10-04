import fs from 'node:fs/promises';
import { format } from 'prettier';
// Original geometric drawings, authored here without external fonts or images.
const drawings = {
  lamp: '<path d="M112 234h96M158 234V130l62-42"/><path d="m194 82 30-16 32 48-52 28Z" fill="#d68b55"/><circle cx="159" cy="131" r="7" fill="#e7b67c"/>',
  notebook:
    '<rect x="111" y="69" width="114" height="174" rx="8" fill="#335d4b"/><path d="M130 69v174M145 104h58M145 122h58M145 140h58" stroke="#e5c594"/>',
  tray: '<path d="m78 161 148-26 40 53-150 28Z" fill="#b37751"/><path d="m78 161 38 55v25l-38-55Zm38 55 150-28v25l-150 28Z" fill="#d9a273"/><circle cx="167" cy="163" r="14" fill="#e4c997"/>',
  stand:
    '<path d="m85 219 44-104 138 70-43 43Z" fill="#bf8357"/><path d="m124 112 43 3 63-42 11 116-66 27-54-28Z" fill="#f8f0d8"/><path d="m167 115 8 101M181 136l38-17M184 157l35-15"/>',
  mug: '<path d="M217 125h19c47 0 45 72-1 72h-18" stroke-width="13"/><path d="M102 114h117v95c0 52-117 52-117 0Z" fill="#d99869"/><ellipse cx="160" cy="114" rx="59" ry="16" fill="#f3d2ab"/><ellipse cx="160" cy="116" rx="46" ry="9" fill="#795238"/>',
  planter:
    '<path d="M166 152V61M166 113c-51 4-60-20-63-49 49 3 62 20 63 49Zm0-18c39-1 48-19 53-46-38 1-50 22-53 46Z" fill="#4b7858"/><path d="m110 141 15 100h83l15-100Z" fill="#bb7656"/><path d="M103 141h127v21H103Z" fill="#d29b75"/>',
  cushion:
    '<rect x="84" y="80" width="169" height="161" rx="29" fill="#c48e6c"/><path d="m95 94 19 19M239 94l-19 19M96 223l19-19M239 224l-19-19M131 80v161M169 80v161M208 80v161" stroke="#e8c5a3"/>',
  vase: '<path d="M147 110h38v28c68 43 66 106-19 108-86-2-84-65-19-108Z" fill="#e1b581"/><path d="M164 111V47M164 73l-33-24M164 88l27-30" stroke="#57774b"/><ellipse cx="124" cy="45" rx="17" ry="8" fill="#a78c48"/><ellipse cx="196" cy="52" rx="17" ry="8" fill="#a78c48"/>',
  tote: '<path d="M131 106V76c0-43 75-43 75 0v30" stroke-width="12"/><path d="m90 101 15 147h130l15-147Z" fill="#d9bf91"/><path d="M136 133v91M204 133v91" stroke="#ad845e"/><circle cx="170" cy="174" r="22" fill="#416853"/>',
  bottle:
    '<rect x="145" y="43" width="47" height="27" rx="7" fill="#c29160"/><path d="M144 70h49v25c0 13 25 13 25 41v88c0 32-99 32-99 0v-88c0-28 25-28 25-41Z" fill="#558073"/><path d="M119 141h99v54h-99" fill="#dcc99e"/>',
  pouch:
    '<rect x="80" y="126" width="180" height="108" rx="18" fill="#b77951"/><path d="M89 141h158M242 131v27" stroke="#e6c79c"/><path d="m243 144 19-14 6 20-20 9Z" fill="#416853"/>',
  journal:
    '<rect x="116" y="69" width="109" height="173" rx="11" fill="#b57b4e"/><path d="M134 69v173M193 71v172" stroke="#eed4a4"/><rect x="150" y="104" width="35" height="49" rx="3" fill="#e7ce9e"/>',
};
const directory = new URL('../public/illustrations/', import.meta.url);
await fs.mkdir(directory, { recursive: true });
for (const [name, drawing] of Object.entries(drawings)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 300" width="340" height="300"><rect width="340" height="300" fill="#f0ece3"/><ellipse cx="170" cy="257" rx="96" ry="13" fill="#ded9cc"/><g stroke="#3f4b3d" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" fill="none">${drawing}</g></svg>`;
  await fs.writeFile(new URL(`${name}.svg`, directory), await format(svg, { parser: 'html' }));
}
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 500" width="640" height="500"><rect width="640" height="500" fill="#e4e9dc"/><circle cx="364" cy="221" r="187" fill="#d1dcc6"/><path d="M45 365h550v90H45Z" fill="#c8b38d"/><path d="M45 365h550v16H45Z" fill="#ab906b"/><g stroke="#3f4b3d" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"><path d="M372 364V194l76-66M324 364h94" fill="none"/><path d="m416 123 43-23 49 66-73 38Z" fill="#ba855a"/><path d="M160 315h152v49H160Z" fill="#638168"/><path d="M151 290h142v25H151Z" fill="#e7d5ad"/><path d="M173 266h124v24H173Z" fill="#bb885d"/><path d="M235 270h64c36 0 36 39 0 39h-10" fill="none"/><path d="M216 258h79v56c0 24-79 24-79 0Z" fill="#c4855c"/><ellipse cx="255" cy="258" rx="40" ry="9" fill="#e8cfa2"/><path d="M116 290V180m0 38c-41 4-49-17-51-40 36 1 49 19 51 40Zm0-13c38 0 46-20 50-40-32 1-46 20-50 40Z" fill="#5b7c4d"/><path d="m76 286 11 78h58l11-78Z" fill="#dca875"/></g><path d="M76 434h490" stroke="#ab906b" stroke-width="3"/></svg>`;
await fs.writeFile(new URL('still-life.svg', directory), await format(hero, { parser: 'html' }));
console.log('Generated original catalog illustrations and still life.');
