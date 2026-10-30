/**
 * Seed content for HASA.
 *
 * This is the platform's real starting curriculum, not demonstration data.
 * It contains no student records, no fabricated statistics, and no invented
 * achievements. Teachers can add class-specific lessons and assessments.
 */

const BADGES = [
  {
    code: "unang-hakbang",
    name: "Unang Hakbang",
    description: "Nakapasa sa unang aktibidad o pagsusulit.",
    xp: 30,
    criteriaType: "activities_passed",
    criteriaTarget: 1,
    sortOrder: 1,
  },
  {
    code: "mausisang-mambabasa",
    name: "Mausisang Mambabasa",
    description: "Nakumpleto ang tatlong aralin.",
    xp: 50,
    criteriaType: "lessons_completed",
    criteriaTarget: 3,
    sortOrder: 2,
  },
  {
    code: "tapat-na-mag-aaral",
    name: "Tapat na Mag-aaral",
    description: "Nakumpleto ang limang aralin.",
    xp: 80,
    criteriaType: "lessons_completed",
    criteriaTarget: 5,
    sortOrder: 3,
  },
  {
    code: "siglang-mag-aaral",
    name: "Siglang Mag-aaral",
    description: "Nag-aral sa tatlong magkakasunod na araw.",
    xp: 50,
    criteriaType: "streak",
    criteriaTarget: 3,
    sortOrder: 4,
  },
  {
    code: "kampeon-ng-pagsusulit",
    name: "Kampeon ng Pagsusulit",
    description: "Nakapasa sa tatlong pagsusulit.",
    xp: 70,
    criteriaType: "quizzes_passed",
    criteriaTarget: 3,
    sortOrder: 5,
  },
  {
    code: "perpektong-iskor",
    name: "Perpektong Iskor",
    description: "Nakuha ang 100% sa isang pagsusulit.",
    xp: 100,
    criteriaType: "perfect_quiz",
    criteriaTarget: 1,
    sortOrder: 6,
  },
];

const LESSONS = [
  {
    slug: "heograpiya-at-simula-ng-sibilisasyon",
    title: "Heograpiya at ang Simula ng Sibilisasyon",
    unit: "Yunit 1 · Mga Sinaunang Sibilisasyon",
    description:
      "Paano nakatulong ang mga ilog, lambak, at matabang lupa sa pag-usbong ng mga unang lungsod at sibilisasyon?",
    difficulty: "madali",
    estimatedMinutes: 10,
    xp: 15,
    vocabulary: [
      {
        word: "sibilisasyon",
        explanation:
          "Isang lipunang may lungsod, pamahalaan, relihiyon, kalakalan, at paraan ng pagsulat.",
        example: "Umunlad ang sibilisasyon sa tabi ng malalaking ilog.",
      },
      {
        word: "agrikultura",
        explanation: "Ang pagtatanim ng halaman at pag-aalaga ng hayop para sa pagkain.",
        example: "Nagsimula ang agrikultura nang matutunan ng tao ang pagtatanim.",
      },
      {
        word: "espesyalisasyon",
        explanation:
          "Pagkakaroon ng iba't ibang trabaho dahil hindi na kailangang lahat ay magsaka.",
        example: "Dahil sa sobrang pagkain, nagkaroon ng espesyalisasyon sa trabaho.",
      },
      {
        word: "lambak",
        explanation: "Mababang bahagi ng lupa sa pagitan ng mga burol o bundok.",
        example: "Mataba ang lupa sa lambak dahil sa daluyong ng ilog.",
      },
    ],
    independent: `Ang heograpiya ay isang mahalagang salik sa pag-usbong ng mga unang sibilisasyon. Noong sinaunang panahon, ang mga tao ay nanirahan malapit sa mga ilog, lambak, at matabang lupa upang makakuha ng tubig at pagkain.

Nang matutunan ng mga tao ang agrikultura, nagkaroon sila ng pantay-pantay at madalas na sobrang ani. Dahil hindi na kailangang lahat ay magsaka, nagsimulang magkaroon ng espesyalisasyon sa trabaho. May naging artisano, pari, mangangalakal, at tagapagtala.

Sa paglaki ng populasyon, kailangan na ng organisadong pamahalaan, batas, at sistema ng pagsulat. Ang mga lungsod-estado ay umusbong sa mga lambak ng ilog tulad ng Tigris at Euphrates, Nile, Indus, at Huang He. Ang mga ilog ay nagbigay ng tubig, pataba mula sa daluyong, at daan para sa kalakalan.

Sa madaling salita, ang likas na kapaligiran ay tumulong sa paglikha ng agrikultura, kalakalan, pamahalaan, at kultura. Ito ang mga haligi ng isang sibilisasyon.`,
    instructional: `Bakit umusbong ang mga unang sibilisasyon sa tabi ng ilog?

Noong unang panahon, naglakbay ang mga tao para humanap ng pagkain. Napansin nila na maganda ang lupa sa tabi ng ilog. Umuulan doon at umaapaw ang tubig. Dahil dito, mataba ang lupa at maganda itong taniman.

Nang matuto silang magtanim, nagkaroon sila ng sobrang pagkain. Hindi na kailangang lahat ay magsaka. May mga taong naging karpintero, pari, mangangalakal, at guro. Tinatawag itong espesyalisasyon.

Dahil marami nang tao sa isang lugar, kailangan nila ng pamahalaan at mga tuntunin. Kailangan din nila ng paraan para itala ang bilang ng pagkain at kalakal. Kaya nagkaroon sila ng pagsulat.

Kaya mahalaga ang heograpiya. Ang tubig, matabang lupa, at magandang klima ang tumulong sa pag-usbong ng mga unang sibilisasyon.`,
    frustration: `Ano ang sibilisasyon? Ito ay isang malaking pamayanan. May lungsod ito. May pamahalaan ito. May relihiyon at kalakalan din ito. May paraan din ito ng pagsulat.

Saan nagsimula ang mga sibilisasyon? Nagsimula ang marami sa tabi ng ilog. Bakit? May tubig ang ilog. May matabang lupa rin sa tabi nito. Maganda itong taniman.

Nagtanim ang mga tao ng trigo, palay, at iba pang halaman. Nag-alaga rin sila ng hayop. Tinatawag itong agrikultura. Nang marami ang ani, may sobra silang pagkain.

Dahil may sobra, hindi na lahat ay kailangang magsaka. May naging karpintero. May naging pari. May naging mangangalakal. Tinatawag itong espesyalisasyon.

Dahil marami ang tao, kailangan nila ng tuntunin. Kailangan din nila ng pamahalaan. Kailangan din nila ng pagsulat para makapagtala. Kaya naging maayos ang kanilang pamayanan. Ito ang simula ng sibilisasyon.`,
  },
  {
    slug: "mesopotamia-unang-mga-lungsod",
    title: "Mesopotamia: Ang Unang mga Lungsod",
    unit: "Yunit 1 · Mga Sinaunang Sibilisasyon",
    description:
      "Tuklasin ang Sumer, cuneiform, at mga lungsod-estado sa lupain sa pagitan ng Tigris at Euphrates.",
    difficulty: "katamtaman",
    estimatedMinutes: 12,
    xp: 15,
    vocabulary: [
      {
        word: "Mesopotamia",
        explanation:
          "Lupain sa pagitan ng mga ilog Tigris at Euphrates; tinatawag ding Fertile Crescent.",
        example: "Ang Mesopotamia ay tinaguriang lunduyan ng sibilisasyon.",
      },
      {
        word: "lungsod-estado",
        explanation:
          "Isang lungsod na may sariling pamahalaan at teritoryo, tulad ng Ur at Uruk.",
        example: "Bawat lungsod-estado sa Sumer ay may sariling pinuno.",
      },
      {
        word: "cuneiform",
        explanation:
          "Sinaunang sistema ng pagsulat gamit ang hugis-kalso na tanda sa putik na tablet.",
        example: "Ginamit ang cuneiform sa pagtatala ng kalakalan.",
      },
      {
        word: "sistema ng patubig",
        explanation:
          "Mga kanal at dike na nagdadala ng tubig sa bukirin at pumipigil sa baha.",
        example: "Nagpatayo ang mga Sumerian ng sistema ng patubig.",
      },
    ],
    independent: `Ang Mesopotamia ay matatagpuan sa rehiyon ng Fertile Crescent, sa pagitan ng mga ilog Tigris at Euphrates. Ang pangalan nito ay nangangahulugang "lupain sa pagitan ng mga ilog." Dito umusbong ang ilan sa mga unang lungsod at sibilisasyon sa daigdig.

Ang mga Sumerian ang nagtatag ng mga lungsod-estado tulad ng Uruk, Ur, at Lagash. Bawat lungsod-estado ay may sariling pinuno, templo, at diyos. Dahil walang sentralisadong pamahalaan, madalas silang magkaroon ng hidwaan.

Upang makapagtanim sa tuyong lupa, gumawa ang mga Sumerian ng sistema ng patubig. Gumamit sila ng mga kanal, dike, at imbakan ng tubig. Ang sobrang ani ay nagbigay daan sa kalakalan at espesyalisasyon.

Naimbento rin nila ang cuneiform, isang sistema ng pagsulat gamit ang matulis na kawayan sa putik na tablet. Ito ang ginamit sa pagtatala ng kalakalan, buwis, at batas. Ang Code of Hammurabi ay isa sa mga unang nakasulat na kalipunan ng batas.

Ang Mesopotamia ay mahalaga dahil dito lumitaw ang mga unang lungsod, pagsulat, batas, at institusyong panlipunan.`,
    instructional: `Ang Mesopotamia ay isang rehiyon sa Gitnang Silangan. Nasa pagitan ito ng mga ilog Tigris at Euphrates. Ang ibig sabihin ng pangalan nito ay "lupain sa pagitan ng mga ilog."

Dito umusbong ang Sumer, isa sa mga unang sibilisasyon. Nagtayo ang mga Sumerian ng mga lungsod-estado tulad ng Ur at Uruk. Bawat lungsod ay may sariling pinuno at diyos.

Mahalaga ang mga ilog sa kanila. Pero may baha rin. Kaya gumawa sila ng mga kanal at dike. Tinatawag itong sistema ng patubig. Dahil dito, nakapagtanim sila ng maraming pagkain.

Nagsulat din ang mga Sumerian. Gumamit sila ng cuneiform. Nag-uukit sila ng hugis-kalso sa putik na tablet. Ginamit nila ito sa pagtatala ng kalakalan at batas.

Si Hammurabi ang isa sa mga kilalang pinuno ng Mesopotamia. Naglagda siya ng mga batas na nakasulat sa bato. Mahalaga ang Mesopotamia dahil dito nagsimula ang maraming bagay na ginagamit pa rin natin, tulad ng lungsod, pagsulat, at batas.`,
    frustration: `Ang Mesopotamia ay isang lugar. Nasa Gitnang Silangan ito. May dalawang malaking ilog dito: ang Tigris at Euphrates.

Ang ibig sabihin ng Mesopotamia ay "lupain sa pagitan ng mga ilog." Dito nakatira ang mga Sumerian. Sila ay nagtayo ng mga lungsod. Ang mga lungsod na ito ay may sariling pinuno. Tinatawag silang lungsod-estado.

Mahirap magtanim sa Mesopotamia dahil tuyo ang lupa at may baha. Kaya gumawa ang mga tao ng kanal at dike. Ang tawag dito ay sistema ng patubig. Dahil dito, may tubig sila para sa mga halaman.

Nagsulat din ang mga Sumerian. Gumamit sila ng cuneiform. Nag-uukit sila sa putik na tablet. Ginamit nila ito para itala ang mga kalakal at batas.

Si Hammurabi ay isang hari. Gumawa siya ng mga batas. Isinulat ang mga ito sa bato. Mahalaga ang Mesopotamia dahil dito nagsimula ang mga lungsod, pagsulat, at batas.`,
  },
  {
    slug: "sinaunang-ehipto-at-ilog-nile",
    title: "Sinaunang Ehipto at ang Ilog Nile",
    unit: "Yunit 1 · Mga Sinaunang Sibilisasyon",
    description:
      "Bakit tinawag ang Ehipto na “regalo ng Nile”? Alamin ang papel ng ilog sa agrikultura, pamahalaan, at kultura.",
    difficulty: "katamtaman",
    estimatedMinutes: 12,
    xp: 15,
    vocabulary: [
      {
        word: "Nile",
        explanation:
          "Ang pinakamahabang ilog sa Africa; nagbibigay ng tubig at matabang lupa sa Ehipto.",
        example: "Umaapaw ang Nile tuwing tag-init at nag-iiwan ng matabang putik.",
      },
      {
        word: "pharaoh",
        explanation:
          "Pinuno ng sinaunang Ehipto na itinuturing ding diyos o tagapamagitan ng mga diyos.",
        example: "Ang pharaoh ang namumuno sa buong Ehipto.",
      },
      {
        word: "hieroglyphics",
        explanation:
          "Sistema ng pagsulat ng sinaunang Ehipto gamit ang mga larawan at simbolo.",
        example: "Nakasulat sa hieroglyphics ang mga inskripsiyon sa templo.",
      },
      {
        word: "piramide",
        explanation:
          "Malaking istrukturang bato na ginawang libingan ng mga pharaoh.",
        example: "Ang Great Pyramid sa Giza ay para kay Pharaoh Khufu.",
      },
    ],
    independent: `Ang sinaunang Ehipto ay umusbong sa kahabaan ng Ilog Nile sa hilagang-silangan ng Africa. Ang Nile ay umaapaw taun-taon at nag-iiwan ng matabang putik sa mga pampang. Dahil dito, naging posible ang agrikultura sa disyerto. Sinabi ni Herodotus na ang Ehipto ay "regalo ng Nile."

Ang sobrang ani ay nagbigay daan sa paglaki ng populasyon at sa pagkakaroon ng organisadong pamahalaan. Ang pharaoh ang pinakamataas na pinuno. Itinuturing siyang tagapamagitan ng mga diyos at may kontrol sa lupa, hukbo, at relihiyon. Tumulong ang mga escriba at opisyal sa pamamahala.

Nagsulat ang mga Ehipto gamit ang hieroglyphics. Ginamit nila ang pagsulat sa relihiyon, batas, at talaan ng ani. Nagtayo rin sila ng mga piramide at templo. Ang mga piramide ay nagpapakita ng kakayahan sa inhinyeriya at ng paniniwala sa kabilang buhay.

Ang Ehipto ay isang halimbawa ng sibilisasyong nakasalalay sa isang ilog. Ang Nile ang nagbigay ng tubig, matabang lupa, at transportasyon para sa kalakalan.`,
    instructional: `Ang Ehipto ay isang bansa sa Africa. Dumadaloy dito ang Ilog Nile. Mahalaga ang Nile sa mga taga-Ehipto.

Tuwing tag-init, umaapaw ang Nile. Pagkatapos ng baha, may natitirang matabang putik sa lupa. Maganda itong taniman. Dahil dito, nakapagtanim ang mga tao ng trigo at iba pang halaman. Kaya tinawag ng mananalaysay na Herodotus ang Ehipto na "regalo ng Nile."

Ang pinuno ng Ehipto ay tinatawag na pharaoh. Naniniwala ang mga tao na may koneksyon siya sa mga diyos. Malaki ang kapangyarihan niya. Siya ang namamahala sa lupa, hukbo, at relihiyon.

Nagsulat din ang mga taga-Ehipto. Gumamit sila ng hieroglyphics. Mga larawan at simbolo ang kanilang ginamit. Nagtayo rin sila ng malalaking piramide para sa mga pharaoh.

Mahalaga ang Nile sa Ehipto. Nagbigay ito ng tubig, pagkain, at daan para sa kalakalan. Dahil dito, umunlad ang kanilang sibilisasyon.`,
    frustration: `Ang Ehipto ay isang bansa sa Africa. May malaking ilog dito. Ang pangalan niya ay Nile.

Mahalaga ang Nile. May tubig ito para sa mga tao at halaman. Tuwing tag-init, umaapaw ito. Pagkatapos, may matabang putik sa lupa. Maganda itong taniman ng trigo.

Dahil sa Nile, may pagkain ang mga tao. Dito nagsimula ang kanilang sibilisasyon. Tinawag ng isang mananalaysay na Herodotus ang Ehipto na "regalo ng Nile."

Ang pinuno ng Ehipto ay tinatawag na pharaoh. Malakas ang kanyang kapangyarihan. Naniniwala ang mga tao na malapit siya sa mga diyos.

Nagsulat ang mga taga-Ehipto gamit ang mga larawan. Ang tawag dito ay hieroglyphics. Nagtayo rin sila ng malalaking piramide. Libingan ito ng mga pharaoh. Mahalaga ang Nile sa buhay ng mga taga-Ehipto.`,
  },
  {
    slug: "sinaunang-greece-at-demokrasya",
    title: "Sinaunang Greece at ang Demokrasya",
    unit: "Yunit 2 · Greece, Roma, at mga Imperyo",
    description:
      "Ano ang polis, at paano nagsimula ang demokrasya sa Athens? Tingnan din ang papel ng Sparta at ng pilosopiya.",
    difficulty: "mahirap",
    estimatedMinutes: 14,
    xp: 20,
    vocabulary: [
      {
        word: "polis",
        explanation:
          "Lungsod-estado ng sinaunang Greece na may sariling pamahalaan at batas.",
        example: "Ang Athens at Sparta ay dalawang kilalang polis.",
      },
      {
        word: "demokrasya",
        explanation:
          "Sistemang ang kapangyarihan ay nasa mga mamamayan, na pumipili ng pinuno o bumuboto sa batas.",
        example: "Sa Athens, ang demokrasya ay direktang pagboto ng mga mamamayan.",
      },
      {
        word: "oligarkiya",
        explanation: "Pamahalaang hawak ng maliit na grupo ng makapangyarihang tao.",
        example: "Ang Sparta ay may halong oligarkiya at monarkiya.",
      },
      {
        word: "pilosopiya",
        explanation:
          "Paghahanap ng kaalaman at katotohanan sa pamamagitan ng pangangatwiran.",
        example: "Si Socrates ay kilalang pilosopo sa Athens.",
      },
    ],
    independent: `Ang sinaunang Greece ay hindi isang malaking bansa kundi isang grupo ng mga polis o lungsod-estado. Ang bawat polis ay may sariling pamahalaan, batas, at hukbo. Ang Athens at Sparta ang pinakamakapangyarihan.

Ang Athens ang unang lugar na nagkaroon ng demokrasya. Sa ilalim ni Cleisthenes, pinalawak ang paglahok ng mga mamamayan sa pagpili ng pinuno at sa paggawa ng batas. Gayunman, limitado ito: hindi makaboto ang mga babae, alipin, at dayuhan. Ang demokrasya sa Athens ay direktang demokrasya, kung saan direkta ang mamamayan sa pagboto.

Ang Sparta naman ay nakatuon sa hukbo at disiplina. May dalawang hari ito at isang konseho ng mga matatanda. Ang kapangyarihan ay hawak ng maliit na grupo, kaya tinatawag itong oligarkiya. Ang buhay sa Sparta ay mahigpit at nakatuon sa pagiging sundalo.

Ang Greece ay tahanan din ng pilosopiya. Sina Socrates, Plato, at Aristotle ay nagtanong tungkol sa kaalaman, etika, at pamahalaan. Ang kanilang mga ideya ay bahagi ng pundasyon ng makabagong pag-iisip.`,
    instructional: `Ang sinaunang Greece ay binubuo ng maraming lungsod-estado. Tinatawag silang polis. Ang bawat polis ay may sariling pamahalaan at batas. Ang Athens at Sparta ang dalawang kilala.

Ang Athens ay kilala sa demokrasya. Sa simula, hindi lahat ay makaboto. Mga lalaking mamamayan lamang ang may karapatan. Pero mahalaga ito dahil ang mga tao ang pumipili ng pinuno at bumuboto sa batas.

Ang Sparta ay iba. Mahigpit sila at nakatuon sa hukbo. Ang pamahalaan nila ay pinamumunuan ng maliit na grupo at ng mga hari. Tinatawag itong oligarkiya.

May mga pilosopo rin sa Greece. Sina Socrates, Plato, at Aristotle ay nagtanong tungkol sa tama at mali, kaalaman, at pamahalaan. Ang kanilang mga ideya ay ginagamit pa rin hanggang ngayon.

Mahalaga ang Greece dahil dito nagsimula ang ideya ng demokrasya at ng pag-aaral sa pamamagitan ng pangangatwiran.`,
    frustration: `Ang sinaunang Greece ay may maraming lungsod. Ang tawag sa lungsod ay polis. Ang bawat polis ay may sariling pinuno at batas. Ang Athens at Sparta ang dalawang kilalang polis.

Ang Athens ay may demokrasya. Ang ibig sabihin nito ay ang mga tao ang pumipili ng pinuno. Bumuboto rin sila sa batas. Pero hindi lahat ay makaboto. Mga lalaking mamamayan lamang. Hindi makaboto ang mga babae at alipin.

Ang Sparta ay iba. Mahigpit sila. Nakatuon sila sa hukbo. Ang pinuno nila ay maliit na grupo. Tinatawag itong oligarkiya.

May mga pilosopo rin sa Greece. Sina Socrates, Plato, at Aristotle. Nagtanong sila tungkol sa tama at mali. Nagtanong din sila tungkol sa kaalaman.

Mahalaga ang Greece. Dito nagsimula ang demokrasya. Dito rin nagsimula ang pilosopiya.`,
  },
  {
    slug: "roma-republika-at-imperyo",
    title: "Roma: Mula Republika tungo sa Imperyo",
    unit: "Yunit 2 · Greece, Roma, at mga Imperyo",
    description:
      "Paano naging republika ang Roma, at bakit ito naging imperyo? Alamin ang Senado, batas, at pamana ng Roma.",
    difficulty: "mahirap",
    estimatedMinutes: 14,
    xp: 20,
    vocabulary: [
      {
        word: "republika",
        explanation:
          "Pamahalaang ang pinuno ay pinipili ng mga mamamayan sa halip na mana o pamana.",
        example: "Ang Roma ay naging republika noong 509 BCE.",
      },
      {
        word: "Senado",
        explanation:
          "Konseho ng mga nakatatandang pinuno sa Roma na gumagawa ng batas at payo.",
        example: "Malaki ang kapangyarihan ng Senado sa Roma.",
      },
      {
        word: "patrician",
        explanation: "Maykayang pamilya sa Roma na may malaking impluwensya sa pamahalaan.",
        example: "Ang mga patrician ang unang miyembro ng Senado.",
      },
      {
        word: "Pax Romana",
        explanation:
          "Mahabang panahon ng kapayapaan at kaayusan sa Imperyo ng Roma.",
        example: "Sa panahon ng Pax Romana, umunlad ang kalakalan.",
      },
    ],
    independent: `Ayon sa tradisyon, itinatag ang Roma noong 753 BCE. Sa simula, pinamunuan ito ng mga hari. Noong 509 BCE, naging republika ito. Sa republika, ang mga mamamayan ay pumipili ng mga opisyal sa halip na mana ang pamumuno.

Ang Senado ang pangunahing konseho ng Roma. Binubuo ito ng mga patrician, o maykayang pamilya. May dalawang konsul na pinipili taun-taon upang mamuno sa hukbo at pamahalaan. Sa paglipas ng panahon, ang mga plebeian o karaniwang mamamayan ay nakakuha ng karapatang magkaroon ng tribuno at ng nakasulat na batas, ang Twelve Tables.

Lumaki ang teritoryo ng Roma sa pamamagitan ng digmaan at alyansa. Noong 27 BCE, naging imperyo ito sa ilalim ni Augustus. Ang mga emperador ang naging pinakamataas na pinuno. Nagkaroon ng mahabang panahon ng kapayapaan at kaayusan na tinatawag na Pax Romana.

Ang pamana ng Roma ay makikita sa batas, wika, arkitektura, at pamahalaan. Ang ideya ng republika at ng pantay na batas ay naging inspirasyon ng maraming bansa.`,
    instructional: `Ang Roma ay isang lungsod sa Italy. Noong una, may mga hari ito. Pagkatapos, naging republika ito. Sa republika, pumipili ang mga tao ng pinuno.

May Senado ang Roma. Dito nagpupulong ang mga maykayang pamilya. Sila ang gumagawa ng batas. May dalawa ring konsul na namumuno sa hukbo at pamahalaan. Isang taon lamang ang kanilang tungkulin.

Hindi lahat ay pantay sa Roma. Ang mga patrician ay maykaya. Ang mga plebeian ay karaniwang tao. Ngunit nakipaglaban ang mga plebeian para sa karapatan. Nagkaroon sila ng sariling kinatawan at nakasulat na batas.

Sa paglipas ng panahon, lumaki ang Roma. Naging imperyo ito sa ilalim ng mga emperador. May mga panahon ng kapayapaan na tinatawag na Pax Romana. Umunlad ang kalakalan at daan.

Mahalaga ang Roma dahil sa batas, wika, at pamahalaan nito. Marami sa mga ideyang ito ang ginagamit pa rin ngayon.`,
    frustration: `Ang Roma ay isang lungsod sa Italy. Noong una, may hari ito. Pagkatapos, naging republika.

Ang republika ay pamahalaan kung saan pumipili ang tao ng pinuno. May Senado ang Roma. Dito nagpupulong ang mga maykaya. Gumagawa sila ng batas.

May dalawang konsul din. Sila ang namumuno sa hukbo. Isang taon lang ang trabaho nila.

Hindi pantay ang mga tao sa Roma. Ang mga patrician ay maykaya. Ang mga plebeian ay karaniwang tao. Nakipaglaban ang mga plebeian para sa kanilang karapatan.

Lumaki ang Roma at naging imperyo. Pinamunuan ito ng mga emperador. May panahon ng kapayapaan na tinatawag na Pax Romana.

Mahalaga ang Roma. Marami tayong natutunan sa kanilang batas at pamahalaan.`,
  },
  {
    slug: "rebolusyong-pilipino-at-nasyonalismo",
    title: "Ang Rebolusyong Pilipino at ang Nasyonalismo",
    unit: "Yunit 3 · Nasyonalismo at Rebolusyon",
    description:
      "Paano nagising ang damdaming makabayan ng mga Pilipino laban sa pamamahala ng Espanya?",
    difficulty: "mahirap",
    estimatedMinutes: 15,
    xp: 20,
    vocabulary: [
      {
        word: "nasyonalismo",
        explanation:
          "Pagmamahal at katapatan sa sariling bansa at paghahangad ng kalayaan at karapatan.",
        example: "Lumakas ang nasyonalismo ng mga Pilipino noong ika-19 na siglo.",
      },
      {
        word: "Katipunan",
        explanation:
          "Lihim na samahan na itinatag noong 1892 upang labanan ang pamamahala ng Espanya.",
        example: "Si Andres Bonifacio ang isa sa mga nagtatag ng Katipunan.",
      },
      {
        word: "Kartilya",
        explanation:
          "Kalipunan ng mga aral at tungkulin ng mga kasapi ng Katipunan.",
        example: "Isinulat ni Emilio Jacinto ang Kartilya ng Katipunan.",
      },
      {
        word: "cedula",
        explanation:
          "Sertipiko ng pagbabayad ng buwis na naging simbolo ng paghihimagsik noong 1896.",
        example: "Pinunit ng mga Katipunero ang kanilang cedula.",
      },
    ],
    independent: `Ang nasyonalismo ay ang damdamin ng pagmamahal at katapatan sa sariling bansa. Sa Pilipinas, lumakas ito noong ika-19 na siglo dahil sa mga karanasang hindi makatarungan sa ilalim ng pamamahala ng Espanya.

Isa sa mga dahilan ay ang diskriminasyon. Hindi pantay ang turing sa mga Pilipino at Espanyol sa pamahalaan at simbahan. Mabigat din ang mga buwis at sapilitang paggawa. Maraming Pilipino ang naghangad ng reporma.

Ang mga ilustrado na sina Jose Rizal, Marcelo H. del Pilar, at Graciano Lopez Jaena ay gumamit ng panulat upang ipakita ang mga problema. Ngunit nang mabigo ang reporma, nagpasya ang iba na lumaban nang armado.

Itinatag ni Andres Bonifacio ang Kataastaasan, Kagalanggalangang Katipunan ng mga Anak ng Bayan noong 1892. Ang Katipunan ay lihim na samahan na naglalayong makamit ang kalayaan. Isinulat ni Emilio Jacinto ang Kartilya, na nagturo ng mga tungkulin at pagpapahalaga ng mga kasapi.

Noong Agosto 1896, naganap ang sigaw ng rebolusyon, na karaniwang tinatawag na Cry of Pugad Lawin. Pinunit ng mga Katipunero ang kanilang cedula bilang tanda ng paghihimagsik. Noong Hunyo 12, 1898, idineklara ang kalayaan sa Kawit, Cavite.`,
    instructional: `Noong ika-19 na siglo, ang Pilipinas ay pinamahalaan ng Espanya. Maraming Pilipino ang hindi masaya. May mga mabigat na buwis. May diskriminasyon. Hindi pantay ang turing sa mga Pilipino at Espanyol.

May mga Pilipinong nag-aral sa Europa. Sina Jose Rizal, Marcelo H. del Pilar, at Graciano Lopez Jaena. Sumulat sila ng mga akda para ipakita ang problema sa bansa. Ginamit nila ang panulat, hindi ang sandata.

Noong 1892, itinatag ni Andres Bonifacio ang Katipunan. Lihim itong samahan. Layunin nitong makamit ang kalayaan. May mga aral itong tinatawag na Kartilya. Isinulat ito ni Emilio Jacinto.

Noong Agosto 1896, naghimagsik ang mga Katipunero. Pinunit nila ang kanilang cedula. Ito ang Cry of Pugad Lawin. Nagsimula ang rebolusyon. Naging bayani sina Bonifacio at Rizal.

Noong Hunyo 12, 1898, idineklara ang kalayaan sa Kawit, Cavite. Mahalaga ang rebolusyon dahil ipinakita nito ang lakas ng nasyonalismo ng mga Pilipino.`,
    frustration: `Noong unang panahon, pinamahalaan ng Espanya ang Pilipinas. Maraming Pilipino ang nahirapan. Mabigat ang buwis. Hindi pantay ang turing sa kanila.

May mga Pilipinong nag-aral sa ibang bansa. Si Jose Rizal ay isa sa kanila. Sumulat siya ng mga libro. Ipinakita niya ang problema sa bansa.

Noong 1892, gumawa si Andres Bonifacio ng isang samahan. Ang pangalan nito ay Katipunan. Lihim ito. Gusto nilang maging malaya ang Pilipinas.

May mga aral ang Katipunan. Ang tawag dito ay Kartilya. Isinulat ito ni Emilio Jacinto.

Noong 1896, naghimagsik ang mga Katipunero. Pinunit nila ang kanilang cedula. Ito ang simula ng rebolusyon.

Noong Hunyo 12, 1898, idineklara ang kalayaan sa Kawit, Cavite. Mahalaga ang araw na ito. Ipinakita nito ang pagmamahal ng mga Pilipino sa bansa.`,
  },
];

const ACTIVITIES = [
  {
    title: "Mabilisang Tanong: Kasaysayan ng Pilipinas",
    description:
      "Limang tanong tungkol sa Rebolusyong Pilipino. May 120 segundo upang sagutin ang lahat.",
    kind: "activity",
    lessonSlug: "rebolusyong-pilipino-at-nasyonalismo",
    xp: 30,
    passPercent: 60,
    timerSeconds: 120,
    questions: [
      {
        prompt: "Anong samahan ang itinatag ni Andres Bonifacio noong 1892?",
        options: ["Katipunan", "La Liga Filipina", "Ilustrados", "Guardia Civil"],
        correctIndex: 0,
        explanation:
          "Itinatag ang Katipunan noong 1892 upang makamit ang kalayaan mula sa Espanya.",
      },
      {
        prompt: "Sino ang sumulat ng Noli Me Tangere at El Filibusterismo?",
        options: ["Jose Rizal", "Emilio Jacinto", "Apolinario Mabini", "Andres Bonifacio"],
        correctIndex: 0,
        explanation:
          "Isinulat ni Jose Rizal ang dalawang nobelang nagbunyag ng mga problema sa ilalim ng pamamahala ng Espanya.",
      },
      {
        prompt: "Ano ang itinuturo ng Kartilya ng Katipunan?",
        options: [
          "Mga tungkulin at pagpapahalaga ng kasapi",
          "Paraan ng pakikipagkalakalan sa Espanya",
          "Mga batas ng pamahalaang Amerikano",
          "Kasaysayan ng sinaunang Greece",
        ],
        correctIndex: 0,
        explanation:
          "Ang Kartilya na isinulat ni Emilio Jacinto ay naglalaman ng mga aral at tungkulin ng mga Katipunero.",
      },
      {
        prompt: "Saan idineklara ang kalayaan ng Pilipinas noong Hunyo 12, 1898?",
        options: ["Kawit, Cavite", "Malolos, Bulacan", "Balintawak", "Vigan, Ilocos Sur"],
        correctIndex: 0,
        explanation:
          "Idineklara ang kalayaan sa Kawit, Cavite. Ang Kongreso ng Malolos ay naganap pagkatapos.",
      },
      {
        prompt: "Alin ang halimbawa ng primaryang sanggunian tungkol sa rebolusyon?",
        options: [
          "Talaarawan ng isang Katipunero noong 1897",
          "Aklat-aralin na nailathala noong 2024",
          "Encyclopedia entry sa website",
          "Dokumentaryong ginawa noong 2020",
        ],
        correctIndex: 0,
        explanation:
          "Ang primaryang sanggunian ay galing sa panahon ng pangyayari at isinulat ng nakasaksi o kalahok.",
      },
    ],
  },
  {
    title: "Detektib ng Sanggunian",
    description:
      "Suriin ang mga primarya at sekundaryang sanggunian sa kasaysayan.",
    kind: "activity",
    lessonSlug: "rebolusyong-pilipino-at-nasyonalismo",
    xp: 30,
    passPercent: 60,
    timerSeconds: null,
    questions: [
      {
        prompt: "Alin ang primaryang sanggunian tungkol sa rebolusyon?",
        options: [
          "Talaarawan ng isang Katipunero noong 1896",
          "Kabanata ng aklat-aralin noong 2024",
          "Encyclopedia entry",
          "Dokumentaryong ginawa noong 2021",
        ],
        correctIndex: 0,
        explanation:
          "Ang primaryang sanggunian ay nagmula sa panahon ng pangyayari at gawa ng kalahok o saksi.",
      },
      {
        prompt: "Ang aklat-aralin sa kasaysayan na isinulat noong 2020 ay halimbawa ng ano?",
        options: ["Primaryang sanggunian", "Sekundaryang sanggunian", "Artifact", "Oral na tradisyon"],
        correctIndex: 1,
        explanation:
          "Sinusuri at binibigyang-kahulugan ng aklat-aralin ang mga naunang ebidensya, kaya sekundaryang sanggunian ito.",
      },
      {
        prompt: "Bakit mahalagang ihambing ang dalawang salaysay ng isang pangyayari?",
        options: [
          "Upang suriin ang pagiging maaasahan at matukoy ang bias",
          "Upang gawing mas mahaba ang kuwento",
          "Upang piliin ang mas kapana-panabik na bersyon",
          "Upang hindi na gumamit ng ebidensya",
        ],
        correctIndex: 0,
        explanation:
          "Nakakatulong ang paghahambing upang masuri ang katotohanan at ang pananaw ng bawat sumulat.",
      },
      {
        prompt: "Bakit maaaring may bias ang liham ng isang opisyal na Espanyol?",
        options: [
          "Ito ay sumasalamin sa kanyang sariling pananaw at interes",
          "Hindi kailanman kapaki-pakinabang ang liham",
          "Dahil isinulat ito sa Espanyol",
          "Dahil laging kasinungalingan ang lahat ng liham",
        ],
        correctIndex: 0,
        explanation:
          "May pananaw ang lahat ng sanggunian. Maaaring protektahan ng opisyal ang interes ng Espanya.",
      },
      {
        prompt: "Aling tanong ang pinakamainam upang suriin ang isang sanggunian?",
        options: [
          "Sino ang sumulat, kailan, at bakit?",
          "Maikli ba ang pamagat?",
          "Makulay ba ang pabalat?",
          "Sikat ba ito sa social media?",
        ],
        correctIndex: 0,
        explanation:
          "Ang may-akda, petsa, at layunin ay tumutulong upang masuri ang bisa at pagiging maaasahan ng sanggunian.",
      },
    ],
  },
  {
    title: "Sino Ako? Sa Sinaunang Mundo",
    description:
      "Kilalanin ang mga tao at konsepto mula sa Greece, Roma, at Mesopotamia.",
    kind: "activity",
    lessonSlug: "sinaunang-greece-at-demokrasya",
    xp: 25,
    passPercent: 60,
    timerSeconds: null,
    questions: [
      {
        prompt: "Ako ang pilosopo sa Athens na nagtuturo sa pamamagitan ng pagtatanong. Sino ako?",
        options: ["Socrates", "Plato", "Aristotle", "Herodotus"],
        correctIndex: 0,
        explanation:
          "Si Socrates ang kilala sa paraan ng pagtatanong upang hanapin ang katotohanan.",
      },
      {
        prompt: "Ako ang pinuno ng Roma na naging unang emperador. Sino ako?",
        options: ["Augustus", "Julius Caesar", "Romulus", "Hammurabi"],
        correctIndex: 0,
        explanation:
          "Si Augustus ang unang emperador ng Roma. Si Julius Caesar ay diktador bago pa ang imperyo.",
      },
      {
        prompt: "Ako ang hari ng Mesopotamia na naglagda ng mga batas sa bato. Sino ako?",
        options: ["Hammurabi", "Nebuchadnezzar", "Sargon", "Gilgamesh"],
        correctIndex: 0,
        explanation:
          "Ang Code of Hammurabi ay isa sa mga unang nakasulat na kalipunan ng batas.",
      },
      {
        prompt: "Ako ang lungsod-estado ng Greece na kilala sa demokrasya. Ano ako?",
        options: ["Athens", "Sparta", "Troy", "Thebes"],
        correctIndex: 0,
        explanation:
          "Ang Athens ang kilala sa pagbuo ng direktang demokrasya, kahit limitado ang paglahok.",
      },
      {
        prompt: "Ako ang ilog na nagbigay-buhay sa sinaunang Ehipto. Ano ako?",
        options: ["Nile", "Tigris", "Euphrates", "Indus"],
        correctIndex: 0,
        explanation:
          "Ang Nile ang nagbigay ng tubig at matabang putik sa Ehipto, kaya tinawag itong regalo ng Nile.",
      },
    ],
  },
  {
    title: "Guhit ng Panahon",
    description:
      "Ayusin ang mga pangyayari ayon sa tamang pagkakasunod-sunod.",
    kind: "activity",
    lessonSlug: "heograpiya-at-simula-ng-sibilisasyon",
    xp: 25,
    passPercent: 60,
    timerSeconds: 90,
    questions: [
      {
        prompt: "Alin ang nangyari muna?",
        options: [
          "Pag-usbong ng agrikultura",
          "Pagtatayo ng mga unang lungsod",
          "Paggamit ng cuneiform",
          "Pagkakaroon ng mga emperador sa Roma",
        ],
        correctIndex: 0,
        explanation:
          "Nagsimula ang agrikultura bago ang paglaki ng mga lungsod at ng pagsulat.",
      },
      {
        prompt: "Alin ang huling nangyari?",
        options: [
          "Pag-usbong ng agrikultura",
          "Pagtatag ng Katipunan",
          "Pagdeklara ng kalayaan sa Kawit",
          "Pagbagsak ng Imperyo ng Roma",
        ],
        correctIndex: 2,
        explanation:
          "Ang pagdeklara ng kalayaan sa Kawit noong 1898 ang pinakahuli. Nauna rito ang pagbagsak ng Roma (476 AD) at ang pagtatag ng Katipunan (1892).",
      },
      {
        prompt: "Kailan itinatag ang Katipunan?",
        options: ["1892", "1896", "1898", "1901"],
        correctIndex: 0,
        explanation:
          "Itinatag ni Andres Bonifacio ang Katipunan noong 1892.",
      },
      {
        prompt: "Aling pangyayari ang naganap noong 1898?",
        options: [
          "Pagdeklara ng kalayaan sa Kawit",
          "Sigaw ng Pugad Lawin",
          "Pagbitay kay Jose Rizal",
          "Pagtatag ng La Liga Filipina",
        ],
        correctIndex: 0,
        explanation:
          "Idineklara ang kalayaan noong Hunyo 12, 1898, sa Kawit, Cavite.",
      },
      {
        prompt: "Alin ang tamang pagkakasunod-sunod?",
        options: [
          "Pagtatag ng Katipunan → Sigaw ng Pugad Lawin → Pagdeklara ng kalayaan",
          "Pagdeklara ng kalayaan → Pagtatag ng Katipunan → Sigaw ng Pugad Lawin",
          "Sigaw ng Pugad Lawin → Pagdeklara ng kalayaan → Pagtatag ng Katipunan",
          "Pagdeklara ng kalayaan → Sigaw ng Pugad Lawin → Pagtatag ng Katipunan",
        ],
        correctIndex: 0,
        explanation:
          "Itinatag ang Katipunan noong 1892, naganap ang sigaw noong 1896, at idineklara ang kalayaan noong 1898.",
      },
    ],
  },
  {
    title: "Pagsusulit 1: Mga Sinaunang Sibilisasyon",
    description:
      "Walong tanong tungkol sa heograpiya, Mesopotamia, at Ehipto. Pumasa sa 70%.",
    kind: "quiz",
    lessonSlug: "sinaunang-ehipto-at-ilog-nile",
    xp: 50,
    passPercent: 70,
    timerSeconds: null,
    questions: [
      {
        prompt: "Bakit umusbong ang mga unang sibilisasyon sa tabi ng ilog?",
        options: [
          "Dahil may tubig at matabang lupa para sa agrikultura",
          "Dahil walang baha sa mga ilog",
          "Dahil madaling magtayo ng piramide doon",
          "Dahil walang ibang tao sa lugar",
        ],
        correctIndex: 0,
        explanation:
          "Ang tubig at matabang lupa ang nagbigay-daan sa agrikultura at sa paglaki ng populasyon.",
      },
      {
        prompt: "Ano ang Mesopotamia sa wikang Griyego?",
        options: [
          "Lupain sa pagitan ng mga ilog",
          "Lupain ng mga piramide",
          "Lupain ng mga pilosopo",
          "Lupain sa tabi ng dagat",
        ],
        correctIndex: 0,
        explanation:
          "Nasa pagitan ng Tigris at Euphrates ang Mesopotamia, kaya ang ibig sabihin ay lupain sa pagitan ng mga ilog.",
      },
      {
        prompt: "Anong sistema ng pagsulat ang ginamit ng mga Sumerian?",
        options: ["Cuneiform", "Hieroglyphics", "Alphabet", "Sanskrit"],
        correctIndex: 0,
        explanation:
          "Ang cuneiform ay ginamit ng mga Sumerian sa putik na tablet.",
      },
      {
        prompt: "Ano ang naging papel ng Nile sa sinaunang Ehipto?",
        options: [
          "Nagbigay ng tubig at matabang putik para sa agrikultura",
          "Naging daan para sa mga piramide",
          "Pinatay ang mga pharaoh",
          "Naging hangganan ng Roma",
        ],
        correctIndex: 0,
        explanation:
          "Ang taunang pag-apaw ng Nile ay nag-iiwan ng matabang putik na mainam sa pagtatanim.",
      },
      {
        prompt: "Sino ang pinuno ng sinaunang Ehipto?",
        options: ["Pharaoh", "Konsul", "Senador", "Satrap"],
        correctIndex: 0,
        explanation:
          "Ang pharaoh ang pinakamataas na pinuno at itinuturing na tagapamagitan ng mga diyos.",
      },
      {
        prompt: "Ano ang piramide?",
        options: [
          "Libingan ng mga pharaoh",
          "Palasyo ng mga emperador",
          "Templo ng mga pilosopo",
          "Kanal para sa patubig",
        ],
        correctIndex: 0,
        explanation:
          "Ang mga piramide ay malalaking libingan ng mga pharaoh, tulad ng Great Pyramid sa Giza.",
      },
      {
        prompt: "Ano ang epekto ng sobrang ani sa mga unang sibilisasyon?",
        options: [
          "Nagkaroon ng espesyalisasyon at kalakalan",
          "Nawala ang lahat ng lungsod",
          "Napilitang lumipat ang lahat sa dagat",
          "Nagtigil ang pagsulat",
        ],
        correctIndex: 0,
        explanation:
          "Dahil may sobrang pagkain, may mga taong nakapagpokus sa ibang trabaho at kalakalan.",
      },
      {
        prompt: "Aling pahayag ang tama tungkol sa mga unang sibilisasyon?",
        options: [
          "Nakadepende ang kanilang pag-unlad sa likas na kapaligiran",
          "Lahat sila ay may parehong wika at batas",
          "Walang relihiyon ang mga unang lungsod",
          "Nagsimula sila sa mga bundok lamang",
        ],
        correctIndex: 0,
        explanation:
          "Malaki ang papel ng heograpiya, lalo na ng mga ilog, sa kanilang pag-unlad.",
      },
    ],
  },
  {
    title: "Pagsusulit 2: Greece at Roma",
    description:
      "Walong tanong tungkol sa polis, demokrasya, republika, at imperyo. Pumasa sa 70%.",
    kind: "quiz",
    lessonSlug: "roma-republika-at-imperyo",
    xp: 50,
    passPercent: 70,
    timerSeconds: null,
    questions: [
      {
        prompt: "Ano ang polis sa sinaunang Greece?",
        options: ["Lungsod-estado", "Malaking imperyo", "Templo", "Kahenera hukbo"],
        correctIndex: 0,
        explanation:
          "Ang polis ay lungsod-estado na may sariling pamahalaan at batas.",
      },
      {
        prompt: "Aling lungsod-estado ang kilala sa demokrasya?",
        options: ["Athens", "Sparta", "Troy", "Thebes"],
        correctIndex: 0,
        explanation:
          "Ang Athens ang nagbuo ng direktang demokrasya, bagaman limitado ang paglahok.",
      },
      {
        prompt: "Sino ang hindi maaaring bumoto sa demokrasya ng Athens?",
        options: ["Mga babae, alipin, at dayuhan", "Mga lalaking mamamayan", "Mga may-ari ng lupa", "Mga sundalo"],
        correctIndex: 0,
        explanation:
          "Limitado ang demokrasya ng Athens sa mga lalaking mamamayan; hindi kasama ang babae, alipin, at dayuhan.",
      },
      {
        prompt: "Ano ang oligarkiya?",
        options: [
          "Pamahalaang hawak ng maliit na grupo",
          "Pamahalaang pinipili ng lahat",
          "Pamahalaang pinamumunuan ng isang hari lamang",
          "Pamahalaang walang batas",
        ],
        correctIndex: 0,
        explanation:
          "Sa oligarkiya, maliit na grupo ng makapangyarihang tao ang may kontrol.",
      },
      {
        prompt: "Ano ang pangunahing tungkulin ng Senado sa Roma?",
        options: [
          "Gumawa ng batas at magpayo sa pamahalaan",
          "Mamuno sa hukbo sa labanan",
          "Pumili ng pharaoh",
          "Magtayo ng piramide",
        ],
        correctIndex: 0,
        explanation:
          "Ang Senado ay konseho ng mga pinuno na gumagawa ng batas at nagpapayo sa pamahalaan.",
      },
      {
        prompt: "Ano ang Pax Romana?",
        options: [
          "Mahabang panahon ng kapayapaan at kaayusan sa imperyo",
          "Digmaan sa pagitan ng Athens at Sparta",
          "Sistema ng pagsulat ng Roma",
          "Batas ng mga plebeian",
        ],
        correctIndex: 0,
        explanation:
          "Ang Pax Romana ay panahon ng relatibong kapayapaan at katatagan sa Imperyo ng Roma.",
      },
      {
        prompt: "Ano ang naging ambag ng Roma sa makabagong pamahalaan?",
        options: [
          "Mga ideya tungkol sa republika at nakasulat na batas",
          "Paglikha ng cuneiform",
          "Pagtatag ng Katipunan",
          "Pagbuo ng hieroglyphics",
        ],
        correctIndex: 0,
        explanation:
          "Ang republika, Senado, at mga batas ng Roma ay naging inspirasyon ng maraming bansa.",
      },
      {
        prompt: "Aling pahayag ang tama tungkol sa paglipat ng Roma mula republika tungo sa imperyo?",
        options: [
          "Naging emperador si Augustus noong 27 BCE",
          "Naging emperador si Socrates",
          "Bumagsak ang Roma noong 1892",
          "Naging pharaoh si Julius Caesar",
        ],
        correctIndex: 0,
        explanation:
          "Si Augustus ang naging unang emperador ng Roma noong 27 BCE.",
      },
    ],
  },
  {
    title: "Pagsusulit 3: Nasyonalismo at Rebolusyon",
    description:
      "Walong tanong tungkol sa Rebolusyong Pilipino at sa pag-usbong ng nasyonalismo. Pumasa sa 70%.",
    kind: "quiz",
    lessonSlug: "rebolusyong-pilipino-at-nasyonalismo",
    xp: 60,
    passPercent: 70,
    timerSeconds: null,
    questions: [
      {
        prompt: "Ano ang nasyonalismo?",
        options: [
          "Pagmamahal at katapatan sa sariling bansa",
          "Pag-aaral ng wikang Espanyol",
          "Pagbabayad ng buwis sa dayuhang pamahalaan",
          "Pangingibang-bansa",
        ],
        correctIndex: 0,
        explanation:
          "Ang nasyonalismo ay damdamin ng pagmamahal sa bansa at paghahangad ng kalayaan at karapatan.",
      },
      {
        prompt: "Sino ang nagtatag ng Katipunan noong 1892?",
        options: ["Andres Bonifacio", "Jose Rizal", "Emilio Aguinaldo", "Apolinario Mabini"],
        correctIndex: 0,
        explanation:
          "Itinatag ni Andres Bonifacio ang Katipunan noong 1892.",
      },
      {
        prompt: "Ano ang layunin ng Katipunan?",
        options: [
          "Makamit ang kalayaan mula sa Espanya",
          "Palakasin ang pamahalaang Espanyol",
          "Magtatag ng kolonya sa China",
          "Ipagbili ang Pilipinas sa Amerika",
        ],
        correctIndex: 0,
        explanation:
          "Layunin ng Katipunan na wakasan ang pamamahala ng Espanya at makamit ang kalayaan.",
      },
      {
        prompt: "Sino ang sumulat ng Kartilya ng Katipunan?",
        options: ["Emilio Jacinto", "Andres Bonifacio", "Jose Rizal", "Emilio Aguinaldo"],
        correctIndex: 0,
        explanation:
          "Isinulat ni Emilio Jacinto ang Kartilya, na naglalaman ng mga aral ng Katipunan.",
      },
      {
        prompt: "Ano ang ginawa ng mga Katipunero sa Sigaw ng Pugad Lawin?",
        options: [
          "Pinunit ang kanilang cedula",
          "Nakipagkasundo sa Espanya",
          "Itinatag ang Kongreso ng Malolos",
          "Bumalik si Rizal mula Europa",
        ],
        correctIndex: 0,
        explanation:
          "Ang pagpunit ng cedula ay naging simbolo ng paghihimagsik laban sa Espanya.",
      },
      {
        prompt: "Sino ang pinatay noong Disyembre 30, 1896?",
        options: ["Jose Rizal", "Andres Bonifacio", "Emilio Jacinto", "Apolinario Mabini"],
        correctIndex: 0,
        explanation:
          "Binaril si Jose Rizal sa Bagumbayan noong Disyembre 30, 1896.",
      },
      {
        prompt: "Kailan idineklara ang kalayaan ng Pilipinas sa Kawit, Cavite?",
        options: ["Hunyo 12, 1898", "Agosto 26, 1896", "Disyembre 30, 1896", "Hulyo 4, 1946"],
        correctIndex: 0,
        explanation:
          "Idineklara ang kalayaan noong Hunyo 12, 1898, sa Kawit, Cavite.",
      },
      {
        prompt: "Bakit mahalaga ang Rebolusyong Pilipino?",
        options: [
          "Ipinakita nito ang pagkakaisa at nasyonalismo ng mga Pilipino",
          "Pinatunayan nitong walang karapatan ang mga Pilipino",
          "Naging dahilan ito ng paglipat ng kabisera sa Espanya",
          "Tinapos nito ang lahat ng digmaan sa Asya",
        ],
        correctIndex: 0,
        explanation:
          "Ang rebolusyon ay nagpakita ng lakas ng nasyonalismo at ng hangarin ng mga Pilipino na magsarili.",
      },
    ],
  },
];

export function seedBadges(db) {
  const statement = db.prepare(`
    INSERT INTO badges (code, name_tl, description_tl, xp, criteria_type, criteria_target, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(code) DO UPDATE SET
      name_tl = excluded.name_tl,
      description_tl = excluded.description_tl,
      xp = excluded.xp,
      criteria_type = excluded.criteria_type,
      criteria_target = excluded.criteria_target,
      sort_order = excluded.sort_order
  `);

  for (const badge of BADGES) {
    statement.run(
      badge.code,
      badge.name,
      badge.description,
      badge.xp,
      badge.criteriaType,
      badge.criteriaTarget,
      badge.sortOrder,
    );
  }
}

export function seedCurriculum(db) {
  const now = new Date().toISOString();

  /*
   * Ang seeding ay idempotent sa pamamagitan ng slug (aralin) at pamagat
   * (aktibidad). Dati, humihinto ang seeding kapag may umiiral nang aralin,
   * kaya hindi umaabot sa lumang database ang mga koreksyon sa nilalaman.
   * Ngayon, ina-update ang platform rows (class_id IS NULL, created_by IS
   * NULL) nang hindi binabago ang kanilang id — kaya nananatili ang
   * lesson_progress, attempts, at attempt_answers ng mga mag-aaral.
   *
   * Hindi ginagalaw ang nilalamang ginawa ng guro (may class_id o
   * created_by).
   */
  const LESSON_ID = new Map();

  const selectLesson = db.prepare(
    "SELECT id, class_id, created_by FROM lessons WHERE slug = ?",
  );
  const updateLesson = db.prepare(`
    UPDATE lessons SET
      title = ?, unit = ?, description = ?, difficulty = ?, estimated_minutes = ?,
      xp = ?, content_independent = ?, content_instructional = ?,
      content_frustration = ?, vocabulary_json = ?, published = 1, updated_at = ?
    WHERE id = ?
  `);
  const insertLesson = db.prepare(`
    INSERT INTO lessons (
      slug, title, unit, description, difficulty, estimated_minutes, xp,
      content_independent, content_instructional, content_frustration,
      vocabulary_json, published, class_id, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NULL, NULL, ?, ?)
  `);

  for (const lesson of LESSONS) {
    const values = [
      lesson.title,
      lesson.unit,
      lesson.description,
      lesson.difficulty,
      lesson.estimatedMinutes,
      lesson.xp,
      lesson.independent,
      lesson.instructional,
      lesson.frustration,
      JSON.stringify(lesson.vocabulary),
    ];

    const existing = selectLesson.get(lesson.slug);
    if (!existing) {
      const result = insertLesson.run(
        lesson.slug,
        ...values,
        now,
        now,
      );
      LESSON_ID.set(lesson.slug, Number(result.lastInsertRowid));
      continue;
    }

    LESSON_ID.set(lesson.slug, Number(existing.id));
    const isPlatformLesson = existing.class_id === null && existing.created_by === null;
    if (isPlatformLesson) {
      updateLesson.run(...values, now, Number(existing.id));
    }
  }

  const selectActivity = db.prepare(
    "SELECT id, class_id, created_by FROM activities WHERE title = ? AND kind = ? ORDER BY id LIMIT 1",
  );
  const updateActivity = db.prepare(`
    UPDATE activities SET
      description = ?, lesson_id = ?, xp = ?, pass_percent = ?, timer_seconds = ?,
      published = 1, updated_at = ?
    WHERE id = ?
  `);
  const insertActivity = db.prepare(`
    INSERT INTO activities (
      title, description, kind, lesson_id, xp, pass_percent, timer_seconds,
      published, class_id, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, NULL, NULL, ?, ?)
  `);
  const selectQuestion = db.prepare(
    "SELECT id FROM questions WHERE activity_id = ? AND position = ?",
  );
  const updateQuestion = db.prepare(`
    UPDATE questions SET prompt = ?, options_json = ?, correct_index = ?, explanation = ?
    WHERE id = ?
  `);
  const insertQuestion = db.prepare(
    "INSERT INTO questions (activity_id, position, prompt, options_json, correct_index, explanation) VALUES (?, ?, ?, ?, ?, ?)",
  );
  const deleteQuestion = db.prepare("DELETE FROM questions WHERE id = ?");

  for (const activity of ACTIVITIES) {
    const existing = selectActivity.get(activity.title, activity.kind);
    const lessonId = LESSON_ID.get(activity.lessonSlug) ?? null;
    let activityId;

    if (!existing) {
      const result = insertActivity.run(
        activity.title,
        activity.description,
        activity.kind,
        lessonId,
        activity.xp,
        activity.passPercent,
        activity.timerSeconds,
        now,
        now,
      );
      activityId = Number(result.lastInsertRowid);
    } else {
      activityId = Number(existing.id);
      const isPlatformActivity = existing.class_id === null && existing.created_by === null;
      if (isPlatformActivity) {
        updateActivity.run(
          activity.description,
          lessonId,
          activity.xp,
          activity.passPercent,
          activity.timerSeconds,
          now,
          activityId,
        );
      }
    }

    // Tanong: i-update sa puwesto para manatili ang question_id na
    // tinutukoy ng attempt_answers, at alisin ang sobrang puwesto.
    const keptPositions = new Set();
    activity.questions.forEach((question, index) => {
      const position = index + 1;
      keptPositions.add(position);
      const existingQuestion = selectQuestion.get(activityId, position);
      if (existingQuestion) {
        updateQuestion.run(
          question.prompt,
          JSON.stringify(question.options),
          question.correctIndex,
          question.explanation,
          Number(existingQuestion.id),
        );
      } else {
        insertQuestion.run(
          activityId,
          position,
          question.prompt,
          JSON.stringify(question.options),
          question.correctIndex,
          question.explanation,
        );
      }
    });

    const extraQuestions = db
      .prepare("SELECT id, position FROM questions WHERE activity_id = ?")
      .all(activityId);
    for (const row of extraQuestions) {
      if (!keptPositions.has(Number(row.position))) {
        deleteQuestion.run(Number(row.id));
      }
    }
  }
}
