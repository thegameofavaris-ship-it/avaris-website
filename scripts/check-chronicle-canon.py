"""Verify the reader uses every approved canon key once, in the original order.
Run from any directory. Optional --baseline path validates unchanged bilingual strings.
"""
import argparse,json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--baseline',type=Path);args=p.parse_args()
s=(root/'assets/i18n.js').read_text();locale=json.loads(s.removeprefix('window.AvarisLocale = ').strip().removesuffix(';'))
canon={k:v for k,v in locale['messages'].items() if k.startswith('creation.text.')}
s=(root/'assets/chronicle-data.js').read_text().split('window.AvarisChronicles = ',1)[1].strip().removesuffix(';');data=json.loads(s)
keys=[unit['key'] for unit in data['legends'][0]['units']]
assert keys==sorted(canon), 'Canon order/keys changed'
assert len(keys)==len(set(keys)), 'Duplicate canon key'
html=(root/'world/creation.html').read_text();fallback=re.findall(r'data-i18n="(creation.text.[^"]+)"',html)
assert fallback==keys, 'Fallback canon does not match the reader'
if args.baseline:assert json.loads(args.baseline.read_text())==canon, 'Approved EN/TR wording changed'
print(f'All {len(keys)} bilingual canon entries retained in order; no duplicate or missing entry.')
