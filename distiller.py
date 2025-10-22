from sys import argv
from xml.dom.minidom import parse
from json import dumps, loads

# argv[1] is the XML file to distill
# argv[2] is the JSON file for extra rafsi definitions
dom = parse(argv[1])
with open(argv[2]) as f:
    data = loads(f.read())
for k in data:
    data[k] += "*" # asterisk: experimental
#print(dir(dom))

directions = dom.getElementsByTagName("direction")
words = [d for d in directions if d.getAttribute("from") == "lojban"][0].getElementsByTagName("valsi")

for w in words:
    rafsi = w.getElementsByTagName("rafsi")
    if not rafsi:
        continue
    valsi = w.getAttribute("word")
    rafsi_list = [r.childNodes[0].data for r in rafsi]
    for r in rafsi_list:
        data[r] = valsi

print(dumps(data, separators=(',', ':')))