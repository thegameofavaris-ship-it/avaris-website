from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
import numpy as np
root=Path(__file__).resolve().parents[1]
a=Image.open(root/'assets/maps/avaris-world-map-canon-v1.png').convert('RGB')
p=Image.open(root/'assets/maps/environment/drakvar-reconstruction-v2.webp').convert('RGB').resize((235,145),Image.Resampling.LANCZOS)
m=Image.new('L',(235,145));d=ImageDraw.Draw(m)
# Only the painted dragon silhouette, with a two-pixel atmospheric feather.
d.polygon([(0,6),(72,25),(103,40),(115,33),(160,10),(228,5),(234,27),(178,45),(139,76),(177,140),(139,128),(106,90),(95,125),(81,90),(62,73),(50,55),(12,41),(0,39)],fill=255)
m=m.filter(ImageFilter.GaussianBlur(1.5))
original=a.copy();a.paste(p,(180,15),m)
a.save(root/'assets/maps/avaris-world-map-living-base-v2.webp',lossless=True,method=6)
mask=Image.new('L',a.size);mask.paste(m,(180,15));delta=np.any(np.asarray(a)!=np.asarray(original),axis=2)
assert not np.any(delta & (np.asarray(mask)==0))
print('Changed pixels',int(delta.sum()),'outside edit mask',0)

