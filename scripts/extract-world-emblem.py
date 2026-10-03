from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import numpy as np,shutil
r=Path(__file__).resolve().parents[1]/'assets/branding'
s=r/'avaris-world-emblem-master.png'
im=Image.open(s).convert('RGBA');a=np.array(im);rgb=a[:,:,:3].astype(float);h,w=a.shape[:2];yy,xx=np.mgrid[:h,:w]
# Regions trace existing illustration bounds. They select source pixels, never redraw them.
mask=Image.new('L',(w,h));d=ImageDraw.Draw(mask)
for cx,cy,rx,ry in [(627,250,82,95),(423,330,85,93),(829,331,87,97),(297,495,108,101),(948,499,94,91),(322,723,92,100),(930,725,93,96)]:
 d.ellipse((cx-rx,cy-ry,cx+rx,cy+ry),fill=255)
# Branch silhouette selection, with enough margin to keep all carved outlines.
d.polygon([(617,8),(640,8),(640,152),(658,208),(672,279),(690,317),(726,279),(763,259),(754,332),(773,389),(837,397),(843,440),(791,473),(745,507),(710,551),(722,591),(780,612),(842,603),(865,562),(907,564),(935,596),(1015,595),(1086,638),(1140,686),(1140,764),(1066,773),(1004,793),(997,849),(958,882),(934,880),(927,848),(875,794),(844,775),(782,787),(753,827),(704,873),(684,921),(776,940),(846,942),(846,987),(702,993),(665,1024),(653,1086),(659,1142),(639,1199),(627,1224),(612,1199),(597,1142),(601,1085),(584,1024),(550,996),(408,985),(408,942),(508,940),(568,921),(549,873),(499,827),(465,788),(406,775),(373,795),(326,849),(320,880),(297,882),(259,849),(256,793),(201,773),(124,763),(120,689),(172,644),(239,599),(316,598),(343,566),(388,562),(412,603),(464,612),(526,591),(542,551),(505,505),(460,474),(410,441),(410,396),(476,385),(497,332),(495,268),(529,287),(562,320),(583,278),(596,208),(615,153)],fill=255)
# Source outer ring + rings/ornaments: color selection in a narrow geometric envelope.
radius=np.sqrt(((xx-627)/1.02)**2+((yy-562)/1.0)**2)
outer=(radius<545)&(radius>425)
inner=(radius<=425)
rgbmax=rgb.max(axis=2);rgbmin=rgb.min(axis=2)
warm=(rgb[:,:,0]>rgb[:,:,2]*1.12)&(rgb[:,:,1]>rgb[:,:,2]*1.02)
bright=rgbmax>105
color=np.where(warm|bright,1.,0.)
# Soft luminance key retains the original metal edge antialiasing; black becomes alpha zero.
region=np.array(mask)/255
metal=(rgb[:,:,0]>65)&(rgb[:,:,0]>rgb[:,:,2]*1.22)&(rgb[:,:,1]>rgb[:,:,2]*1.05)
ivory=(rgbmin>rgbmax*.72)&(rgbmax>105)
amethyst=(rgb[:,:,2]>rgb[:,:,1]*1.24)&(rgb[:,:,0]>rgb[:,:,1]*1.12)&(rgbmax>75)
blue=(rgb[:,:,2]>rgb[:,:,0]*1.18)&(rgb[:,:,1]>rgb[:,:,0]*1.05)&(rgbmax>60)
colored=metal|ivory|amethyst|blue
# Fine gold geometry outside the illustration bounds uses the original warm pixels only.
alpha=np.maximum(region*colored*np.clip((rgbmax-45)/45,0,1),((outer|inner)*metal)*np.clip((rgbmax-65)/50,0,1))
alpha=np.where((radius>550)&(region==0),0,alpha)
from scipy.ndimage import label
labels,count=label(alpha>0)
sizes=np.bincount(labels.ravel());alpha[sizes[labels]<12]=0
a[:,:,3]=np.round(alpha*255).astype('uint8')
Image.fromarray(a).save(r/'avaris-world-emblem-transparent.png',optimize=True)
Image.fromarray(a).save(r/'avaris-world-emblem-transparent.webp',lossless=True,method=6)
print('Extracted source RGB with alpha-only masks; canvas:', im.size)
