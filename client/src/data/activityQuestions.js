import { demoQuestions } from "./demoData.js";

/**
 * Mga tanong para sa mga aktibidad sa Pagsasanay.
 *
 * Lahat ng nilalaman ay halimbawa para sa prototype. Ang mga tanong ay
 * nakabatay sa mga paksang Araling Panlipunan (Rebolusyong Pilipino) at
 * ginagamit lamang ng lokal na activity player, hindi ng isang backend.
 *
 * Ang mga pamagat ng tao, lugar, at kilusan ay hindi isinasalin dahil
 * mga pangngalang pantangi ang mga ito.
 *
 * Ang `reading-water` ay direktang gumagamit ng umiiral na `demoQuestions`
 * mula sa demo data, kaya hindi na ito dinoble.
 */
export const ACTIVITY_QUESTIONS = {
  "featured-hot-seat": [
    {
      id: "hot-seat-q1",
      prompt:
        "Aling samahan ang nakipaglaban para sa kalayaan ng Pilipinas mula sa Espanya noong 1896?",
      options: [
        "Ang Katipunan",
        "Ang Cortes ng Espanya",
        "Ang pamahalaang kolonyal ng Amerika",
        "Ang Nagkakaisang mga Bansa",
      ],
      correctIndex: 0,
      explanation:
        "Ang Katipunan, sa pamumuno ni Andres Bonifacio, ang nagpasimula ng Rebolusyong Pilipino laban sa mga Kastila noong 1896.",
    },
    {
      id: "hot-seat-q2",
      prompt:
        "Sino ang pambansang bayani na ang mga nobela ay nagsiwalat ng mga pang-aabuso noong panahon ng mga Kastila?",
      options: [
        "Emilio Aguinaldo",
        "Jose Rizal",
        "Apolinario Mabini",
        "Andres Bonifacio",
      ],
      correctIndex: 1,
      explanation:
        "Isinulat ni Jose Rizal ang Noli Me Tangere at El Filibusterismo. Binaril siya noong 1896.",
    },
    {
      id: "hot-seat-q3",
      prompt: "Ano ang itinuturo ng Kartilya ng Katipunan sa mga kasapi nito?",
      options: [
        "Kung paano makipagkalakalan sa Espanya",
        "Ang mga tungkulin at pagpapahalaga ng isang Katipunero",
        "Kung paano maging opisyal ng Espanya",
        "Ang mga alituntunin ng pamahalaang Amerikano",
      ],
      correctIndex: 1,
      explanation:
        "Ang Kartilya, na isinulat ni Emilio Jacinto, ay nagpapaliwanag ng mga tungkulin at mabubuting pagpapahalagang inaasahan sa mga kasapi ng Katipunan.",
    },
    {
      id: "hot-seat-q4",
      prompt:
        "Saan ipinahayag ang kalayaan ng Pilipinas noong Hunyo 12, 1898?",
      options: [
        "Kawit, Cavite",
        "Malolos, Bulacan",
        "Balintawak, Quezon City",
        "Vigan, Ilocos Sur",
      ],
      correctIndex: 0,
      explanation:
        "Ipinahayag ang kalayaan sa Kawit, Cavite. Sumunod na lamang ang Kongreso ng Malolos.",
    },
    {
      id: "hot-seat-q5",
      prompt: "Alin sa mga ito ang pangunahing sanggunian tungkol sa rebolusyon?",
      options: [
        "Isang kabanata ng aklat na isinulat noong 2024",
        "Isang talaarawang isinulat ng isang Katipunero noong 1897",
        "Isang makabagong lahok sa ensiklopedya",
        "Isang dokumentaryong pelikulang ginawa noong 2020",
      ],
      correctIndex: 1,
      explanation:
        "Ang talaarawang isinulat noong panahong iyon ay pangunahing sanggunian dahil galing ito mismo sa kalahok o saksi.",
    },
  ],

  ch1: [
    {
      id: "ch1-q1",
      prompt: "Aling pangyayari ang nauna?",
      options: [
        "Ang pagtatatag ng Katipunan",
        "Ang Sigaw sa Pugad Lawin",
        "Ang pagpapahayag ng kalayaan ng Pilipinas",
        "Ang Labanan sa Look ng Maynila",
      ],
      correctIndex: 0,
      explanation:
        "Itinatag ang Katipunan noong 1892. Nagsimula ang rebolusyon noong 1896, at ipinahayag ang kalayaan noong 1898.",
    },
    {
      id: "ch1-q2",
      prompt: "Aling pangyayari ang huli?",
      options: [
        "Ang pagtatatag ng Katipunan",
        "Ang pagpapahayag ng kalayaan ng Pilipinas",
        "Ang pagbitay kay Jose Rizal",
        "Ang pagsisimula ng Rebolusyong Pilipino",
      ],
      correctIndex: 1,
      explanation:
        "Ipinahayag ang kalayaan noong Hunyo 12, 1898, matapos magsimula ang rebolusyon.",
    },
    {
      id: "ch1-q3",
      prompt: "Anong taon itinatag ang Katipunan?",
      options: ["1892", "1896", "1898", "1901"],
      correctIndex: 0,
      explanation:
        "Itinatag ni Andres Bonifacio at ng iba pang makabayan ang Katipunan noong 1892.",
    },
    {
      id: "ch1-q4",
      prompt: "Aling pangyayari ang naganap noong 1898?",
      options: [
        "Ang Labanan sa Look ng Maynila",
        "Ang Sigaw sa Pugad Lawin",
        "Ang pagbitay kay Jose Rizal",
        "Ang pagtatatag ng La Liga Filipina",
      ],
      correctIndex: 0,
      explanation:
        "Naganap ang Labanan sa Look ng Maynila noong 1898 sa panahon ng Digmaang Espanyol-Amerikano.",
    },
    {
      id: "ch1-q5",
      prompt: "Alin ang tamang pagkakasunod-sunod?",
      options: [
        "Pagtatatag ng Katipunan → Sigaw sa Pugad Lawin → Pagpapahayag ng Kalayaan",
        "Pagpapahayag ng Kalayaan → Pagtatatag ng Katipunan → Sigaw sa Pugad Lawin",
        "Sigaw sa Pugad Lawin → Pagpapahayag ng Kalayaan → Pagtatatag ng Katipunan",
        "Pagpapahayag ng Kalayaan → Sigaw sa Pugad Lawin → Pagtatatag ng Katipunan",
      ],
      correctIndex: 0,
      explanation:
        "Itinatag ang Katipunan noong 1892, nagsimula ang rebolusyon noong 1896, at ipinahayag ang kalayaan noong 1898.",
    },
  ],

  ch2: [
    {
      id: "ch2-q1",
      prompt: "Sino ang namuno sa Katipunan at tinawag na Supremo?",
      options: [
        "Andres Bonifacio",
        "Jose Rizal",
        "Emilio Aguinaldo",
        "Graciano Lopez Jaena",
      ],
      correctIndex: 0,
      explanation:
        "Si Andres Bonifacio ang pinuno ng Katipunan at naaalala bilang Supremo.",
    },
    {
      id: "ch2-q2",
      prompt: "Sino ang sumulat ng Noli Me Tangere at El Filibusterismo?",
      options: [
        "Jose Rizal",
        "Emilio Jacinto",
        "Apolinario Mabini",
        "Marcelo H. del Pilar",
      ],
      correctIndex: 0,
      explanation:
        "Isinulat ni Jose Rizal ang dalawang nobela, na nagsiwalat ng mga pang-aabuso at naghikayat ng reporma.",
    },
    {
      id: "ch2-q3",
      prompt: "Sino ang naging unang Pangulo ng Republika ng Pilipinas?",
      options: [
        "Emilio Aguinaldo",
        "Andres Bonifacio",
        "Apolinario Mabini",
        "Antonio Luna",
      ],
      correctIndex: 0,
      explanation:
        "Pinamunuan ni Emilio Aguinaldo ang rebolusyonaryong pamahalaan at naging unang Pangulo ng Republika ng Pilipinas.",
    },
    {
      id: "ch2-q4",
      prompt:
        "Sino ang tinawag na Dakilang Paralitiko at nagsilbing tagapayo ng rebolusyon?",
      options: [
        "Apolinario Mabini",
        "Emilio Jacinto",
        "Gregorio del Pilar",
        "Melchora Aquino",
      ],
      correctIndex: 0,
      explanation:
        "Si Apolinario Mabini ang tinawag na Dakilang Paralitiko at naging pangunahing tagapayo ng rebolusyonaryong pamahalaan.",
    },
    {
      id: "ch2-q5",
      prompt:
        "Sino ang tinawag na Lakambini at tumulong sa pag-oorganisa ng mga kababaihan ng Katipunan?",
      options: [
        "Gregoria de Jesus",
        "Melchora Aquino",
        "Josefa Llanes Escoda",
        "Trinidad Tecson",
      ],
      correctIndex: 0,
      explanation:
        "Si Gregoria de Jesus, asawa ni Andres Bonifacio, ang tinawag na Lakambini at tumulong sa pag-oorganisa ng mga kababaihan ng Katipunan.",
    },
  ],

  ch3: [
    {
      id: "ch3-q1",
      prompt: "Alin sa mga ito ang pangunahing sanggunian tungkol sa rebolusyon?",
      options: [
        "Isang talaarawang isinulat ng isang Katipunero noong 1896",
        "Isang kabanata ng aklat na isinulat noong 2024",
        "Isang makabagong lahok sa ensiklopedya",
        "Isang dokumentaryong pelikulang ginawa noong 2021",
      ],
      correctIndex: 0,
      explanation:
        "Ang pangunahing sanggunian ay galing sa panahon ng pangyayari at ginawa ng mga kalahok o saksi.",
    },
    {
      id: "ch3-q2",
      prompt:
        "Ang aklat sa kasaysayan na isinulat noong 2020 ay halimbawa ng anong uri ng sanggunian?",
      options: [
        "Pangunahing sanggunian",
        "Pangalawang sanggunian",
        "Artifakto",
        "Salitang pasalita",
      ],
      correctIndex: 1,
      explanation:
        "Ang aklat ay nagbibigay-kahulugan sa mga naunang ebidensiya, kaya pangalawang sanggunian ito.",
    },
    {
      id: "ch3-q3",
      prompt:
        "Bakit dapat ihambing ng mga mananalaysay ang dalawang salaysay ng isang pangyayari?",
      options: [
        "Upang masuri ang pagiging mapagkakatiwalaan at makita ang pagkiling",
        "Upang gawing mas mahaba ang kuwento",
        "Upang piliin ang mas kapana-panabik na bersyon",
        "Upang iwasang gumamit ng ebidensiya",
      ],
      correctIndex: 0,
      explanation:
        "Tumutulong ang paghahambing upang masuri ang mga katotohanan, makita ang pagkakaiba, at maunawaan ang pananaw ng bawat may-akda.",
    },
    {
      id: "ch3-q4",
      prompt:
        "Bakit maaaring magpakita ng pagkiling ang liham mula sa isang opisyal na Kastila?",
      options: [
        "Sumasalamin ito sa sariling pananaw at interes ng sumulat",
        "Walang saysay ang mga liham bilang ebidensiya",
        "Isinulat ito sa wikang Espanyol",
        "Laging lubos itong mali",
      ],
      correctIndex: 0,
      explanation:
        "May sariling pananaw ang lahat ng sanggunian. Maaaring protektahan ng liham ng opisyal na Kastila ang interes ng Espanya o ilarawan nang di-makatarungan ang mga Pilipino.",
    },
    {
      id: "ch3-q5",
      prompt: "Aling tanong ang pinakanakatutulong sa pagsusuri ng sanggunian?",
      options: [
        "Sino ang sumulat, kailan, at bakit?",
        "Maikli ba ang pamagat?",
        "May makulay ba itong pabalat?",
        "Ito ba ang pinakasikat na post sa internet?",
      ],
      correctIndex: 0,
      explanation:
        "Ang may-akda, petsa, at layunin ang tumutulong upang hatulan kung mapagkakatiwalaan at kapaki-pakinabang ang isang sanggunian.",
    },
  ],

  ch4: [
    {
      id: "ch4-q1",
      prompt:
        "Pinamunuan ko ang Katipunan at ipinanganak ako sa Tondo. Sino ako?",
      options: [
        "Andres Bonifacio",
        "Jose Rizal",
        "Emilio Aguinaldo",
        "Emilio Jacinto",
      ],
      correctIndex: 0,
      explanation:
        "Ipinanganak si Andres Bonifacio sa Tondo, Maynila, at pinamunuan niya ang Katipunan.",
    },
    {
      id: "ch4-q2",
      prompt:
        "Sumulat ako ng mga nobelang nagsiwalat ng pang-aabuso at binaril noong 1896. Sino ako?",
      options: [
        "Jose Rizal",
        "Andres Bonifacio",
        "Apolinario Mabini",
        "Antonio Luna",
      ],
      correctIndex: 0,
      explanation:
        "Isinulat ni Jose Rizal ang Noli Me Tangere at El Filibusterismo at binaril noong Disyembre 30, 1896.",
    },
    {
      id: "ch4-q3",
      prompt:
        "Naging pangulo ako ng rebolusyonaryong pamahalaan at nagpahayag ng kalayaan sa Kawit. Sino ako?",
      options: [
        "Emilio Aguinaldo",
        "Andres Bonifacio",
        "Emilio Jacinto",
        "Gregorio del Pilar",
      ],
      correctIndex: 0,
      explanation:
        "Ipinahayag ni Emilio Aguinaldo ang kalayaan ng Pilipinas sa Kawit, Cavite, noong Hunyo 12, 1898.",
    },
    {
      id: "ch4-q4",
      prompt:
        "Nagpayo ako sa rebolusyonaryong pamahalaan at tinawag na Dakilang Paralitiko. Sino ako?",
      options: [
        "Apolinario Mabini",
        "Jose Rizal",
        "Marcelo H. del Pilar",
        "Graciano Lopez Jaena",
      ],
      correctIndex: 0,
      explanation:
        "Si Apolinario Mabini ay isang palaisip at tagapayo sa pulitika na kilala bilang Dakilang Paralitiko.",
    },
    {
      id: "ch4-q5",
      prompt: "Inorganisa ko ang pangkat ng kababaihan ng Katipunan. Sino ako?",
      options: [
        "Gregoria de Jesus",
        "Melchora Aquino",
        "Trinidad Tecson",
        "Josefa Llanes Escoda",
      ],
      correctIndex: 0,
      explanation:
        "Si Gregoria de Jesus, ang Lakambini, ang tumulong sa pag-oorganisa ng mga kababaihan ng Katipunan.",
    },
  ],

  ch5: [
    {
      id: "ch5-q1",
      prompt: "Itinatag ni Andres Bonifacio ang Katipunan noong 1892.",
      options: ["Katotohanan", "Katha"],
      correctIndex: 0,
      explanation:
        "Katotohanan ito. Itinatag ang Katipunan noong 1892, at si Bonifacio ang isa sa mga pinuno nito.",
    },
    {
      id: "ch5-q2",
      prompt: "Pinamunuan ni Jose Rizal ang armadong rebolusyon bilang Supremo.",
      options: ["Katotohanan", "Katha"],
      correctIndex: 1,
      explanation:
        "Katha ito. Si Andres Bonifacio ang Supremo. Si Rizal ay repormista at nobelista.",
    },
    {
      id: "ch5-q3",
      prompt:
        "Ang Sigaw sa Pugad Lawin ay naaalala bilang simula ng Rebolusyong Pilipino.",
      options: ["Katotohanan", "Katha"],
      correctIndex: 0,
      explanation:
        "Katotohanan ito. Ang Sigaw sa Pugad Lawin noong 1896 ang nagtanda ng hayagang pag-aalsa laban sa Espanya.",
    },
    {
      id: "ch5-q4",
      prompt:
        "Ipinahayag ang kalayaan ng Pilipinas noong Hunyo 12, 1898, sa Kawit, Cavite.",
      options: ["Katotohanan", "Katha"],
      correctIndex: 0,
      explanation:
        "Katotohanan ito. Naganap ang pagpapahayag sa Kawit, Cavite, noong Hunyo 12, 1898.",
    },
    {
      id: "ch5-q5",
      prompt: "Sinuportahan ng pamahalaang kolonyal ng Espanya ang Katipunan.",
      options: ["Katotohanan", "Katha"],
      correctIndex: 1,
      explanation:
        "Katha ito. Ang Katipunan ay lihim na samahan na lumaban sa pamamahala ng mga Kastila.",
    },
  ],

  ch6: [
    {
      id: "ch6-q1",
      prompt: "Ano ang buong pangalan ng Katipunan?",
      options: [
        "Kataastaasan, Kagalanggalangang Katipunan ng mga Anak ng Bayan",
        "Kilusang Kabataan ng Bayan",
        "Kapisanan ng mga Kawani ng Bayan",
        "Katipunan ng mga Guro at Mag-aaral",
      ],
      correctIndex: 0,
      explanation:
        "Ang buong pangalan ay Kataastaasan, Kagalanggalangang Katipunan ng mga Anak ng Bayan.",
    },
    {
      id: "ch6-q2",
      prompt: "Ano ang pangunahing layunin ng Katipunan?",
      options: [
        "Ang kalayaan mula sa Espanya",
        "Ang pakikipagkaibigan sa pamahalaang Kastila",
        "Ang malayang kalakalan sa Tsina",
        "Ang paggawang Maynila na kabisera ng Espanya",
      ],
      correctIndex: 0,
      explanation:
        "Layunin ng Katipunan na wakasan ang pamamahala ng mga Kastila at makamit ang kalayaan ng Pilipinas.",
    },
    {
      id: "ch6-q3",
      prompt: "Sino ang sumulat ng Kartilya ng Katipunan?",
      options: [
        "Emilio Jacinto",
        "Andres Bonifacio",
        "Jose Rizal",
        "Emilio Aguinaldo",
      ],
      correctIndex: 0,
      explanation:
        "Isinulat ni Emilio Jacinto ang Kartilya, na nagpapaliwanag ng mga tungkulin at pagpapahalaga ng mga kasapi ng Katipunan.",
    },
    {
      id: "ch6-q4",
      prompt: "Sino ang Supremo ng Katipunan?",
      options: [
        "Andres Bonifacio",
        "Emilio Jacinto",
        "Jose Rizal",
        "Antonio Luna",
      ],
      correctIndex: 0,
      explanation:
        "Si Andres Bonifacio ang nagsilbing Supremo ng Katipunan.",
    },
    {
      id: "ch6-q5",
      prompt: "Ano ang naaalala sa Sigaw sa Pugad Lawin?",
      options: [
        "Pinunit ng mga Katipunero ang kanilang sedula at nagpahayag ng pag-aalsa",
        "Pumirma ang Espanya ng kasunduan sa kapayapaan sa Pilipinas",
        "Itinatag ang unang Republika ng Pilipinas",
        "Bumalik si Jose Rizal mula sa Europa",
      ],
      correctIndex: 0,
      explanation:
        "Ang Sigaw sa Pugad Lawin ay naaalala bilang sandaling pinunit ng mga Katipunero ang kanilang sedula at sinimulan ang rebolusyon.",
    },
  ],

  "reading-water": demoQuestions,
};
