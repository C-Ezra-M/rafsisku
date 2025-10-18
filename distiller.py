from sys import argv
from xml.dom.minidom import parse
from json import dumps

# argv[1] is the file to distill
dom = parse(argv[1])
data = {}
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