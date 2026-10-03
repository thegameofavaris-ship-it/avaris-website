/* Reader UI only; approved canon stays in the shared EN/TR catalog. */
Object.assign(window.AvarisLocale.messages, {
"chronicle.art.final-harmony": {"en": "A quiet seven-part manuscript ornament.", "tr": "Yedi parçalı sade bir el yazması bezemesi."},
"chronicle.art.converging-roads": {"en": "Roads, travellers and trade converging.", "tr": "Buluşan yollar, yolcular ve ticaret."},
"chronicle.art.history-memory": {"en": "An abraded fragment of an old record.", "tr": "Eski bir kaydın aşınmış parçası."},
"chronicle.art.inheritance": {"en": "A wrapped object passing between hands.", "tr": "Eller arasında aktarılan sarılı bir nesne."},
"chronicle.art.seven-paths": {"en": "Seven streams or roots meeting at a shared center.", "tr": "Ortak bir merkezde buluşan yedi akarsu ya da kök."},
"chronicle.art.seven-sisters": {"en": "Seven anonymous sisters in a manuscript interpretation.", "tr": "Bir el yazması yorumunda yedi isimsiz kız kardeş."},
"chronicle.art.fire": {"en": "Stonework rising beside fire.", "tr": "Ateşin yanında yükselen taş yapı."},
"chronicle.art.shadows": {"en": "A figure and a faint double shadow.", "tr": "Bir figür ve belli belirsiz iki gölge."},
"chronicle.art.nature": {"en": "A listener among leaves and roots.", "tr": "Yapraklar ve kökler arasında bir dinleyici."},
"chronicle.art.healing": {"en": "Hands tending a wound with water.", "tr": "Bir yarayı suyla iyileştiren eller."},
"chronicle.art.truth": {"en": "Two faces looking toward one another.", "tr": "Birbirine bakan iki yüz."},
"chronicle.art.forge": {"en": "A smith shaping iron at a forge.", "tr": "Ocakta demire biçim veren bir demirci."},
"chronicle.art.stars": {"en": "An observer beneath the stars.", "tr": "Yıldızların altında bir gözlemci."},
"chronicle.art.settlement": {"en": "A settlement and winding roads following the shape of the land.", "tr": "Toprağın biçimine uyan bir yerleşim ve kıvrılan yollar."},
"chronicle.art.world-emerging": {"en": "Manuscript study of a world emerging from light and stone.", "tr": "Işık ve taştan doğan bir dünyanın el yazması çizimi."},
  "chronicle.close": {"en":"Close book","tr":"Kitabı kapat"},
  "chronicle.book": {
    "en": "THE LEGENDS OF AVARIS",
    "tr": "AVARİS'IN EFSANELERİ"
  },
  "chronicle.chapter": {
    "en": "I — THE CREATION MYTH",
    "tr": "I — YARATILIŞ DESTANI"
  },
  "chronicle.title": {
    "en": "THE CREATION MYTH",
    "tr": "YARATILIŞ DESTANI"
  },
  "chronicle.open": {
    "en": "Open the book",
    "tr": "Kitabı aç"
  },
  "chronicle.back": {
    "en": "Return to World",
    "tr": "Dünya'ya Dön"
  },
  "chronicle.contents": {
    "en": "Contents",
    "tr": "İçindekiler"
  },
  "chronicle.prev": {
    "en": "Previous",
    "tr": "Önceki"
  },
  "chronicle.next": {
    "en": "Next",
    "tr": "Sonraki"
  },
  "chronicle.expand": {
    "en": "Expand reading",
    "tr": "Okuma alanını genişlet"
  },
  "chronicle.collapse": {
    "en": "Exit expanded reading",
    "tr": "Geniş görünümden çık"
  },
  "chronicle.fullscreen": {
    "en": "Enter fullscreen",
    "tr": "Tam ekranı aç"
  },
  "chronicle.exitFullscreen": {
    "en": "Exit fullscreen",
    "tr": "Tam ekrandan çık"
  },
  "chronicle.progress": {
    "en": "Page {pages} / {total}",
    "tr": "Sayfa {pages} / {total}"
  },
  "chronicle.surface": {
    "en": "Chronicle pages",
    "tr": "Efsaneler kitabının sayfaları"
  },
  "chronicle.skip": {
    "en": "Skip to reading",
    "tr": "Metne geç"
  },
  "chronicle.fullText": {
    "en": "Read the complete text",
    "tr": "Metnin tamamını oku"
  },
  "chronicle.paged": {
    "en": "Return to book pages",
    "tr": "Kitap sayfalarına dön"
  }
});
Object.assign(window.AvarisLocale.messages, {
  "chronicle.art.opening-panorama": {
    "en": "A continuous landscape of seas, mountains, forests and settlements.",
    "tr": "Denizler, dağlar, ormanlar ve yerleşimlerden oluşan kesintisiz bir manzara."
  },
  "chronicle.art.terrain-portrait": {
    "en": "A settlement and roads following mountain and river.",
    "tr": "Dağa ve nehre uyum sağlayan bir yerleşim ve yollar."
  },
  "chronicle.art.seven-ways-scene": {
    "en": "Seven ways of knowing within one connected settlement scene.",
    "tr": "Tek bir yerleşim sahnesinde yedi farklı anlayış biçimi."
  },
  "chronicle.art.sisters-portrait": {
    "en": "Seven anonymous sisters beside a river.",
    "tr": "Nehir kıyısında yedi isimsiz kız kardeş."
  },
  "chronicle.art.seven-currents": {
    "en": "Seven currents converging into one landscape.",
    "tr": "Tek bir manzarada birleşen yedi akış."
  },
  "chronicle.art.inheritance-scene": {
    "en": "A concealed object passing between generations.",
    "tr": "Kuşaklar arasında aktarılan, bütünüyle sarılı bir nesne."
  },
  "chronicle.art.memory-scene": {
    "en": "A settlement, old road and weathered records.",
    "tr": "Bir yerleşim, eski bir yol ve aşınmış kayıtlar."
  },
  "chronicle.art.roads-scene": {
    "en": "Travellers and trade meeting at a river crossing.",
    "tr": "Nehir geçidinde buluşan yolcular ve ticaret."
  }
});
Object.assign(window.AvarisLocale.messages, {"chronicle.art.memory-road":{"en":"An old road and weathered ruins beside a river.","tr":"Nehir kıyısında eski bir yol ve aşınmış kalıntılar."}});
window.AvarisChronicles = {
  "book": {
    "titleKey": "chronicle.book"
  },
  "legends": [
    {
      "id": "creation-myth",
      "chapter": "I",
      "titleKey": "chronicle.title",
      "chapterKey": "chronicle.chapter",
      "units": [
        {
          "key": "creation.text.00.00",
          "beat": 0,
          "kind": "paragraph",
          "emphasis": "opening"
        },
        {
          "key": "creation.text.01.00",
          "beat": 1,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.02.00",
          "beat": 2,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.03.00",
          "beat": 3,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.04.00",
          "beat": 4,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.04.01",
          "beat": 4,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.04.02",
          "beat": 4,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.04.03",
          "beat": 4,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.04.04",
          "beat": 4,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.04.05",
          "beat": 4,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.04.06",
          "beat": 4,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.05.00",
          "beat": 5,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.06.00",
          "beat": 6,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.07.00",
          "beat": 7,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.08.00",
          "beat": 8,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.08.01",
          "beat": 8,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.08.02",
          "beat": 8,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.09.00",
          "beat": 9,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.10.00",
          "beat": 10,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.11.00",
          "beat": 11,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.12.00",
          "beat": 12,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.13.00",
          "beat": 13,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.13.01",
          "beat": 13,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.13.02",
          "beat": 13,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.14.00",
          "beat": 14,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.15.00",
          "beat": 15,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.16.00",
          "beat": 16,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.16.01",
          "beat": 16,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.16.02",
          "beat": 16,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.16.03",
          "beat": 16,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.17.00",
          "beat": 17,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.18.00",
          "beat": 18,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.19.00",
          "beat": 19,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.19.01",
          "beat": 19,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.19.02",
          "beat": 19,
          "kind": "sequence",
          "emphasis": null
        },
        {
          "key": "creation.text.20.00",
          "beat": 20,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.21.00",
          "beat": 21,
          "kind": "sequence",
          "emphasis": "creed"
        },
        {
          "key": "creation.text.21.01",
          "beat": 21,
          "kind": "sequence",
          "emphasis": "creed"
        },
        {
          "key": "creation.text.21.02",
          "beat": 21,
          "kind": "sequence",
          "emphasis": "creed"
        },
        {
          "key": "creation.text.22.00",
          "beat": 22,
          "kind": "paragraph",
          "emphasis": null
        },
        {
          "key": "creation.text.23.00",
          "beat": 23,
          "kind": "paragraph",
          "emphasis": "law"
        }
      ],
      "illustrations": [
        {
          "id": "opening-panorama",
          "src": "../assets/chronicle-art/interior-v4/opening-panorama.webp",
          "altKey": "chronicle.art.opening-panorama"
        },
        {
          "id": "terrain-portrait",
          "src": "../assets/chronicle-art/interior-v4/terrain-portrait.webp",
          "altKey": "chronicle.art.terrain-portrait"
        },
        {
          "id": "seven-ways-scene",
          "src": "../assets/chronicle-art/interior-v4/seven-ways-scene.webp",
          "altKey": "chronicle.art.seven-ways-scene"
        },
        {
          "id": "sisters-portrait",
          "src": "../assets/chronicle-art/interior-v4/sisters-portrait.webp",
          "altKey": "chronicle.art.sisters-portrait"
        },
        {
          "id": "seven-currents",
          "src": "../assets/chronicle-art/interior-v4/seven-currents.webp",
          "altKey": "chronicle.art.seven-currents"
        },
        {
          "id": "inheritance-scene",
          "src": "../assets/chronicle-art/interior-v4/inheritance-scene.webp",
          "altKey": "chronicle.art.inheritance-scene"
        },
        {
          "id": "memory-scene",
          "src": "../assets/chronicle-art/interior-v4/memory-scene.webp",
          "altKey": "chronicle.art.memory-scene"
        },
        {
          "id": "roads-scene",
          "src": "../assets/chronicle-art/interior-v4/roads-scene.webp",
          "altKey": "chronicle.art.roads-scene"
        },
        {
          "id": "world-emerging",
          "src": "../assets/chronicle-art/world-emerging.webp",
          "altKey": "chronicle.art.world-emerging"
        },
        {
          "id": "memory-road",
          "src": "../assets/chronicle-art/interior-v4/memory-road.webp",
          "altKey": "chronicle.art.memory-road"
        },
        {
          "id": "final-harmony",
          "src": "../assets/chronicle-art/final-harmony.webp",
          "altKey": "chronicle.art.final-harmony"
        }
      ],
      "treatments": {
        "creation.text.16.01": {
          "slot": "reserved-manuscript-detail"
        }
      },
      "spreads": [
        {
          "id": "opening",
          "pages": [
            {
              "layout": "opening",
              "beats": [
                0
              ],
              "heading": true,
              "dropcap": true
            },
            {
              "layout": "panorama",
              "beats": [],
              "art": "opening-panorama"
            }
          ],
          "cross": "opening-panorama"
        },
        {
          "id": "land",
          "pages": [
            {
              "layout": "horizontal",
              "beats": [
                1
              ],
              "art": "world-emerging",
              "dropcap": true
            },
            {
              "layout": "portrait-pair",
              "beats": [
                2,
                3
              ],
              "art": "terrain-portrait"
            }
          ]
        },
        {
          "id": "seven-ways",
          "pages": [
            {
              "layout": "seven-lines",
              "beats": [
                4,
                5,
                6
              ]
            },
            {
              "layout": "plate",
              "beats": [],
              "art": "seven-ways-scene"
            }
          ]
        },
        {
          "id": "sisters",
          "pages": [
            {
              "layout": "prose",
              "beats": [
                7,
                8,
                9,
                10
              ],
              "dropcap": true
            },
            {
              "layout": "plate",
              "beats": [],
              "art": "sisters-portrait"
            }
          ]
        },
        {
          "id": "powers-inheritance",
          "pages": [
            {
              "layout": "portrait-pair",
              "beats": [
                11,
                12
              ],
              "art": "seven-currents",
              "dropcap": true
            },
            {
              "layout": "horizontal",
              "beats": [
                13,
                14
              ],
              "art": "inheritance-scene"
            }
          ]
        },
        {
          "id": "memory",
          "pages": [
            {
              "layout": "multi-editorial",
              "beats": [
                15,
                16
              ],
              "art": "memory-scene",
              "secondaryArt": "memory-road",
              "dropcap": true
            },
            {
              "layout": "horizontal",
              "beats": [
                17,
                18
              ],
              "art": "roads-scene"
            }
          ]
        },
        {
          "id": "final",
          "pages": [
            {
              "layout": "prose",
              "beats": [
                19,
                20,
                21,
                22
              ]
            },
            {
              "layout": "closure",
              "beats": [
                23
              ],
              "art": "final-harmony"
            }
          ]
        }
      ]
    }
  ]
};
