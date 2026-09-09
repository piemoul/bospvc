import fs from 'node:fs';
import assert from 'node:assert/strict';
const catalog=JSON.parse(fs.readFileSync('lib/catalog.json','utf8'));
const editorial=JSON.parse(fs.readFileSync('lib/product-editorial.json','utf8'));
const mp=new Set(['1','2','3','4','5','6','7','8','9','17','19','20','21','26']);
const slugs=new Set();
let colorCount=0;
for(const p of catalog){
  const e=editorial[p.id];
  assert(e,`Editorial missing for ${p.id}`);
  assert.match(e.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert(!slugs.has(e.slug),`Duplicate slug: ${e.slug}`);slugs.add(e.slug);
  assert.equal(e.label,mp.has(p.id)?'MP TECH':'',`Label ${p.id}`);
  assert.deepEqual(e.allowedUnits,Number(p.id)<=9?['roll','meter']:p.id==='25'?['piece']:['roll'],`Units ${p.id}`);
  assert(p.variants.length>0);
  assert.equal(new Set(p.variants.map(v=>v.id)).size,p.variants.length);
  for(const lang of ['id','en'])assert(e.details[lang].every(x=>typeof x==='string'&&x.length>0));
  for(const color of p.colors.filter(c=>c!=='Multiple colours'))assert(e.colorImages[color],`Missing photo ${p.id}: ${color}`);
  for(const [color,img] of Object.entries(e.colorImages)){
    assert(p.colors.includes(color),`Unknown color ${p.id}: ${color}`);
    assert(img.src.startsWith('/images/')&&!img.src.includes('..'));
    assert(fs.existsSync('public'+img.src),`Missing asset ${img.src}`);colorCount++;
  }
}
assert.equal(catalog.length,27);
assert.equal(catalog.reduce((n,p)=>n+p.variants.length,0),99);
assert.equal(JSON.parse(fs.readFileSync('docs/color-illustrations.json','utf8')).images.length,32);
console.log(`Catalog valid: ${catalog.length} groups, 99 variants, ${mp.size} MP TECH labels, ${colorCount} color mappings.`);
const liveArg=process.argv.indexOf('--live-url');
if(liveArg!==-1){
  const base=new URL(process.argv[liveArg+1]);
  assert(['127.0.0.1','localhost','[::1]'].includes(base.hostname),'Verification is local-only');
  for(const route of ['/','/store','/contact',...Array.from(slugs,s=>'/products/'+s)]){
    const response=await fetch(new URL(route,base));assert.equal(response.status,200,route);
    const html=await response.text();assert(html.includes('BOSS BAHAN PVC'),route);
  }
  assert.equal((await fetch(new URL('/products/no-such-material-rev1',base))).status,404);
  const en=await (await fetch(new URL('/contact',base),{headers:{Cookie:'boss-language=en'}})).text();
  assert(en.includes('ASK FOR PRICING &amp; AVAILABILITY'));
  const health=await fetch(new URL('/api/health',base));assert.equal(health.status,200);
  for(const entry of JSON.parse(fs.readFileSync('docs/color-illustrations.json','utf8')).images){
    assert.equal((await fetch(new URL(entry.output.replace('public/','/'),base),{method:'HEAD'})).status,200,entry.output);
  }
  console.log('Live checks passed: 30 routes, unknown-product 404, English contact, health and 32 generated assets.');
}
