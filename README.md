# la rafsisku

## to( ti mo )toi

fi'e la .ezras. cu tutci leka

- sisku le rafsi .e le selrafsi
- gi'e cipcta le cumki rafsi be noda

## Introduction

la rafsisku (made by C.Ezra.M) is a tool:

- to search for rafsi and the words they are rafsi of
- to check which possible rafsi have no words assigned to them

## Development

`task` and `jekyll` are not required, but they're what I use in this case. `python`, however, is required.

- `task cipra` serves the site on localhost
- `task zbasu-poho` builds the site to `_site`
- `task jdikygau` reduces the jbovlaste dataset to just the words that have rafsi, and the words they are assigned to
- `task zbasu` runs the `zbasu-poho` and `jdikygau` tasks at once

Occasionally, a jbovlaste dataset update may be required.

## Notes

This tool can search for experimental rafsi. The rafsi come from both jbovlaste and a [list in the roljbogu'e Discord server compiled by la nalvai](https://discord.com/channels/771781383361921024/1304486371183951884/1429272862988177579), which contains rafsi recognized by latkerlo-jvotci.
