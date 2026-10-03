"""Derive environmental masks from the unchanged canonical painting. No redraw."""
from pathlib import Path
import json, re, io, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / 'assets/maps/avaris-world-map-living-base-v2.webp'
OUT = ROOT / 'assets/maps/environment'
OUT.mkdir(exist_ok=True)
def save_mask(image,path):
 data=io.BytesIO();image.save(data,format='PNG',optimize=True)
 temporary=path.with_suffix('.tmp');temporary.write_bytes(data.getvalue());os.replace(temporary,path)
im = Image.open(MASTER).convert('RGB')
rgb = np.asarray(im).astype(float)
r,g,b = [rgb[:,:,i] for i in range(3)]
# Cyan/blue paint only: boats, architecture, labels and dry ground are excluded.
water = np.minimum(np.clip((g-r-9)/19,0,1), np.clip((b-r-10)/22,0,1))
water *= np.clip((b-g+16)/25,0,1)
river_sun = np.minimum(np.clip((g-r-2)/8,0,1),np.clip((b-r+12)/18,0,1))*np.clip((b-g+35)/20,0,1)
white = np.clip((np.minimum(np.minimum(r,g),b)-65)/105,0,1) * np.clip(1-(np.max(rgb,axis=2)-np.min(rgb,axis=2))/75,0,1)
warm = np.minimum(np.clip((r-g-9)/24,0,1),np.clip((g-b-7)/20,0,1))
fire = np.clip((r-g-25)/50,0,1)*np.clip((g-b-6)/25,0,1)
html = (ROOT/'world.html').read_text()
regions={name.lower():[(int(x),int(y)) for x,y in re.findall(r'(\d+) (\d+)',path)] for name,path in re.findall(r'<a class="map-hotspot" data-kingdom="([^"]+)".*?<path d="([^"]+)"',html)}
region_masks={}
for name,poly in regions.items():
 m=Image.new('L',im.size);ImageDraw.Draw(m).polygon(poly,fill=255);region_masks[name]=np.asarray(m)/255
 light=m.filter(ImageFilter.GaussianBlur(7))
 image=Image.new('RGBA',im.size,(255,255,255,0));image.putalpha(light);save_mask(image,OUT/('light-mask-'+name+'.png'))
manifest={'width':1536,'height':1024,'patches':[]}
def add(name,kingdom,kind,poly,color=None,feather=1.0,phase=0):
 m=Image.new('L',im.size);ImageDraw.Draw(m).polygon(poly,fill=255)
 a=np.asarray(m)/255*region_masks[kingdom]
 if color is not None:a*=color
 if kingdom=='ignivar':a[728:835,645:924]=0 # Painted kingdom title/emblem stay still.
 a[:18]=0;a[990:]=0;a[:,:18]=0;a[:,1518:]=0
 if kingdom=='equira':a[425:501,726:868]=0
 mask=Image.fromarray((a*255).astype('uint8')).filter(ImageFilter.GaussianBlur(feather))
 bounds=mask.getbbox()
 if not bounds:return
 x,y,x2,y2=bounds;alpha=mask.crop(bounds)
 out=Image.new('RGBA',alpha.size,(255,255,255,0));out.putalpha(alpha)
 save_mask(out,OUT/(name+'.png'))
 manifest['patches'].append(dict(id=name,kingdom=kingdom,kind=kind,x=x,y=y,width=x2-x,height=y2-y,phase=phase,mask='assets/maps/environment/'+name+'.png'))
def box(x,y,w,h):return [(x,y),(x+w,y),(x+w,y+h),(x,y+h)]
add('water-mask-armonia','armonia','river',[(405,70),(785,65),(862,160),(836,295),(727,338),(665,374),(548,421),(411,355)],water)
add('waterfall-mask-armonia-west','armonia','fall',[(453,168),(467,167),(465,201),(452,207)],white,.8)
add('waterfall-mask-armonia-east','armonia','fall',[(781,177),(806,184),(806,239),(785,249)],white,1)
add('waterfall-mask-armonia-south','armonia','fall',[(649,337),(673,339),(673,385),(651,389)],white,.8)
add('foliage-mask-armonia','armonia','foliage',box(530,212,70,35),np.clip((g-r-8)/30,0,1)*np.clip((g-b+5)/40,0,1),2)
add('water-mask-serapha','serapha','river',[(984,41),(1455,40),(1507,113),(1480,231),(1507,389),(1371,439),(1191,449),(1052,381),(1011,231)],river_sun,.9)
add('water-mask-nymora','nymora','ocean',[(20,430),(490,427),(561,572),(545,729),(474,833),(342,893),(208,867),(93,808),(16,646)],water,1)
add('water-mask-equira','equira','river',[(508,355),(999,301),(1118,425),(1081,579),(922,628),(712,607),(542,584)],water,1)
add('bridge-mask-equira','equira','bridge',[(774,506),(870,494),(874,501),(777,515)],warm,1)
add('water-mask-veritasa','veritasa','ocean',[(1080,462),(1494,474),(1509,732),(1480,902),(1230,924),(1108,802),(1031,652)],water,1)
for phase,(direction,rect) in enumerate([('north',(1268,465,47,72)),('east',(1423,552,58,79)),('south',(1250,718,68,86)),('west',(1080,557,56,79))]):
 add('temple-mask-veritasa-'+direction,'veritasa','temple',box(*rect),warm,1.2,phase)
add('mist-mask-drakvar-west','drakvar','mist',[(6,213),(42,219),(92,253),(83,294),(24,289),(6,256)],white,3)
add('mist-mask-drakvar-east','drakvar','mist',[(301,188),(363,176),(422,178),(434,230),(406,253),(359,247)],white,3)
add('smoke-mask-drakvar','drakvar','smoke',[(113,172),(145,161),(173,174),(167,199),(131,202)],white,2)
add('forge-mask-drakvar','drakvar','fire',box(151,116,32,28),warm,.9)
add('water-mask-drakvar','drakvar','river',box(18,302,371,100),water,1)
add('smoke-mask-ignivar-north','ignivar','smoke',[(618,578),(716,581),(777,618),(748,661),(682,645),(619,653),(597,629)],white,3)
add('smoke-mask-ignivar-south','ignivar','smoke',[(540,829),(608,822),(638,855),(641,891),(592,912),(533,879)],white,3)
add('fire-mask-ignivar','ignivar','fire',[(564,642),(679,588),(860,620),(936,711),(974,846),(1107,922),(1090,991),(807,1002),(648,913),(538,864)],fire,1.1)
add('settlement-mask-ignivar','ignivar','settlement',box(748,861,89,81),warm,1)
add('mist-mask-veritasa-south','veritasa','mist',[(1230,870),(1418,827),(1520,852),(1520,965),(1360,995),(1264,971)],white,4)
add('mist-mask-veritasa-west','veritasa','mist',[(1050,605),(1130,565),(1194,634),(1181,702),(1104,745),(1058,698)],white,4)
add('lava-mask-ignivar','ignivar','lava',[(564,642),(679,588),(860,620),(936,711),(974,846),(1107,922),(1090,991),(807,1002),(648,913),(538,864)],fire,1.1)
add('heat-mask-ignivar','ignivar','heat',box(837,891,167,97),None,5)
add('heat-mask-serapha','serapha','heat',box(1345,360,113,33),None,5)
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
for path in OUT.glob('*.png'):Image.open(path).verify()
print('Derived',len(manifest['patches']),'paint masks; master unchanged.')
