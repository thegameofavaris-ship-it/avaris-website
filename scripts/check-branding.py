from pathlib import Path
from PIL import Image
import numpy as np,struct,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1];b=root/'assets/branding'
a=np.array(Image.open(b/'avaris-world-emblem-master.png').convert('RGBA'));d=np.array(Image.open(b/'avaris-world-emblem-transparent.png').convert('RGBA'))
assert a.shape==d.shape and np.array_equal(a[:,:,:3],d[:,:,:3]),'Source RGB changed'
assert d[:,:,3].min()==0 and d[:,:,3].max()==255,'Missing true transparency'
assert (d[:,:,3]>0).any(axis=0).nonzero()[0][0]<110,'Outer structure clipped'
assert (d[:,:,3]>0).any(axis=1).nonzero()[0][-1]>1200,'Axial tip clipped'
for n in [16,32,48,180,192,512]:
 p=b/(f'favicon-{n}.png' if n<100 else 'apple-touch-icon.png' if n==180 else f'avaris-icon-{n}.png');assert Image.open(p).size==(n,n)
svg=ET.parse(b/'favicon.svg').getroot();circles=svg.findall('{http://www.w3.org/2000/svg}circle');assert len([c for c in circles if c.attrib.get('r')=='3'])==7
ico=(root/'favicon.ico').read_bytes();assert struct.unpack('<HHH',ico[:6])==(0,1,3)
assert {tuple(ico[6+i*16:8+i*16]) for i in range(3)}=={(16,16),(32,32),(48,48)}
count=0
for p in root.rglob('*.html'):
 s=p.read_text();assert s.count('world-emblem-v1')==5,p
 prefix='../' if p.parent!=root else ''
 assert f'href="{prefix}assets/branding/favicon.svg?v=world-emblem-v1"' in s,p
 assert f'href="{prefix}favicon.ico?v=world-emblem-v1"' in s,p
 count+=1
print(f'PASS: source RGB, transparent alpha, seven nodes, six icon sizes, ICO frames, and declarations on {count} pages.')
