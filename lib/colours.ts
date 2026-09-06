import type { Lang } from './catalog';
const colours:Record<string,[string,string,string]>={
  'black':['Hitam','Black','#30312f'],'hitam':['Hitam','Black','#30312f'],
  'navy':['Biru dongker','Navy','#29334c'],'biru dongker':['Biru dongker','Navy','#29334c'],
  'dark grey':['Abu tua','Dark grey','#626361'],'light grey':['Abu muda','Light grey','#c7c6c1'],'abu':['Abu','Grey','#888b88'],
  'red':['Merah','Red','#ae3334'],'merah tua':['Merah tua','Dark red','#872e34'],'merah cabe':['Merah cerah','Bright red','#c6372d'],
  'brown':['Cokelat','Brown','#725341'],'cappucino':['Cappuccino','Cappuccino','#baa388'],'capucinno':['Cappuccino','Cappuccino','#baa388'],
  'yellow':['Kuning','Yellow','#d6b64e'],'green':['Hijau','Green','#468765'],'hijau botol':['Hijau botol','Bottle green','#305443'],
  'blue':['Biru','Blue','#527aaa'],'royal blue':['Biru royal','Royal blue','#3554ab'],
  'light brown':['Cokelat muda','Light brown','#b69372'],'med brown':['Cokelat sedang','Medium brown','#927259'],
  'dark brown':['Cokelat tua','Dark brown','#504134'],'canyon brown':['Cokelat canyon','Canyon brown','#936747'],
  'maroon':['Marun','Maroon','#702f43'],'salem':['Salem','Salmon','#c38f86'],'orange':['Oranye','Orange','#ce763a'],
  'multiple colours':['Beragam warna','Multiple colours','linear-gradient(90deg,#38476b,#c74640,#e4b95a,#55876d)'],
  'clear':['Bening','Clear','#e0e8e2'],'biru & silver':['Biru & perak','Blue & silver','linear-gradient(135deg,#284e8c 50%,#c5c9c9 50%)'],
  'biru terang & biru':['Biru terang & biru','Light blue & blue','linear-gradient(135deg,#619bcd 50%,#284e8c 50%)'],
  'biru & oren':['Biru & oranye','Blue & orange','linear-gradient(135deg,#284e8c 50%,#ce763a 50%)'],
  'biru & biru':['Biru dua sisi','Blue on both sides','#31599a'],'hijau daun':['Hijau daun','Leaf green','#448454'],
  'hijau hijau':['Hijau dua sisi','Green on both sides','#367250'],'hijau hitam':['Hijau & hitam','Green & black','linear-gradient(135deg,#367250 50%,#30312f 50%)'],
};
export const colourLabel=(value:string,lang:Lang)=>colours[value.toLowerCase()]?.[lang==='id'?0:1]??value;
export const colourSwatch=(value:string)=>colours[value.toLowerCase()]?.[2]??'#aa9c86';
