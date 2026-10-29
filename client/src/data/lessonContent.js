/**
 * NILALAMAN NG ARALIN — DRAFT PARA SA PROTOTYPE
 *
 * Ang mga tekstong ito ay maikling buod ng paksang Araling Panlipunan
 * (Baitang 8: Rebolusyong Pilipino). Sinusunod nila ang karaniwang
 * nilalaman ng DepEd SLM, ngunit DRAFT pa lamang ang mga ito:
 *
 *  - Kailangan pa ng pagsusuri ng guro sa Araling Panlipunan bago
 *    gamitin sa totoong klase.
 *  - Hindi ito galing sa AI at hindi ito kinopya mula sa isang partikular
 *    na modyul; buod lamang ng mga tiyak na petsa at pangyayari.
 *
 * Ang `activityId` ang nag-uugnay sa aralin sa umiiral nang tanong sa
 * `activityQuestions.js`, kaya ang "Simulan / Ipagpatuloy / Balikan" ay
 * tunay na nagbubukas ng pagsusulit — walang naaabing patay na link.
 */

export const LESSON_CONTENT_STATUS =
  "Draft na nilalaman ng aralin. Kailangan pa ng pagsusuri ng guro sa Araling Panlipunan bago gamitin sa totoong klase.";

export const LESSON_CONTENT = {
  "lesson-1-5": {
    activityId: "featured-hot-seat",
    objective:
      "Matukoy ang mga pangunahing sanhi ng Rebolusyong Pilipino at kung paano ito nag-udyok ng pag-aalsa noong 1896.",
    sections: [
      {
        heading: "Mga pang-aabuso noong panahon ng mga Kastila",
        paragraphs: [
          "Maraming Pilipino ang naghirap dahil sa sapilitang paggawa o polo y servicio, sa mataas na buwis, at sa monopolyo ng pamahalaan sa mga produkto tulad ng tabako.",
          "Malaki rin ang kapangyarihan ng mga prayleng Kastila sa pamahalaan at sa paaralan. Hindi pantay ang pagtrato sa mga Pilipino at Kastila sa batas at sa lipunan.",
        ],
      },
      {
        heading: "Pag-usbong ng kamalayang nasyonal",
        paragraphs: [
          "Noong 1880s, humingi ng reporma ang Kilusang Propaganda sa pamamagitan ng pahayagang La Solidaridad. Kabilang dito sina Jose Rizal, Marcelo H. del Pilar, at Graciano Lopez Jaena.",
          "Nang hindi pinakinggan ang mga kahilingang reporma, itinatag ni Andres Bonifacio ang Katipunan noong 1892. Noong Agosto 1896, nagsimula ang armadong rebolusyon sa Sigaw sa Pugad Lawin.",
        ],
      },
    ],
    keyTerms: [
      {
        word: "tributo",
        meaning: "Buwis na binabayaran ng mga Pilipino sa pamahalaang Kastila.",
      },
      {
        word: "polo y servicio",
        meaning: "Sapilitang paggawa ng mga lalaking Pilipino sa mga proyektong pambayan.",
      },
      {
        word: "Kilusang Propaganda",
        meaning:
          "Kilusang humingi ng reporma sa pamamagitan ng pagsulat, hindi ng armadong labanan.",
      },
      {
        word: "nasyonalismo",
        meaning: "Pagmamahal at katapatan sa sariling bayan.",
      },
    ],
  },

  "lesson-2-3": {
    activityId: "ch6",
    objective:
      "Ilarawan ang layunin, kasapi, at paraan ng pakikibaka ng Katipunan.",
    sections: [
      {
        heading: "Pagtatatag ng Katipunan",
        paragraphs: [
          "Itinatag ang Kataastaasan, Kagalanggalangang Katipunan ng mga Anak ng Bayan noong Hulyo 1892 sa Tondo, Maynila. Si Andres Bonifacio ang Supremo, kasama sina Deodato Arellano, Ladislao Diwa, at Teodoro Plata.",
          "Lihim ang samahan. Bawat kasapi ay may tungkulin at sumusumpa na ipaglalaban ang kalayaan ng bayan.",
        ],
      },
      {
        heading: "Kartilya at mga kasapi",
        paragraphs: [
          "Isinulat ni Emilio Jacinto ang Kartilya ng Katipunan, na nagtuturo ng mga tungkulin at pagpapahalaga ng isang Katipunero.",
          "Sumapi rin ang mga kababaihan. Si Gregoria de Jesus, ang Lakambini, ang tumulong sa pag-oorganisa sa kanila at sa pag-iingat ng mga dokumento ng samahan.",
        ],
      },
      {
        heading: "Panawagan sa pakikidigma",
        paragraphs: [
          "Noong Agosto 1896, pinunit ng mga Katipunero ang kanilang sedula sa Pugad Lawin at nagpahayag ng pag-aalsa. Ito ang tinatawag na Sigaw sa Pugad Lawin.",
          "Kumalat ang labanan sa mga lalawigan. Nagkaroon din ng hidwaan sa loob ng pamunuan, at nahatulan ng kamatayan si Bonifacio noong 1897.",
        ],
      },
    ],
    keyTerms: [
      {
        word: "Kartilya",
        meaning: "Kalipunan ng mga turo at tungkulin ng kasapi ng Katipunan.",
      },
      { word: "Supremo", meaning: "Pinakamataas na pinuno ng Katipunan." },
      {
        word: "sedula",
        meaning: "Katibayan ng pagbabayad ng buwis noong panahon ng mga Kastila.",
      },
      {
        word: "Sigaw sa Pugad Lawin",
        meaning:
          "Pagpunit ng sedula at pagpapahayag ng pag-aalsa noong Agosto 1896.",
      },
    ],
  },

  "lesson-3": {
    activityId: "ch5",
    objective:
      "Balikan ang mga pangunahing katangian ng pamamahalang Kastila sa Pilipinas mula 1565 hanggang 1898.",
    sections: [
      {
        heading: "Pamamahala",
        paragraphs: [
          "Ang gobernador-heneral ang pinakamataas na opisyal ng pamahalaang kolonyal. Tinulungan siya ng Real Audiencia sa mga usaping panghukuman at ng mga alcalde mayor sa mga lalawigan.",
          "Sa patakarang reduccion, pinagsama-sama ang mga tao sa iisang pueblo upang mas madaling bantayan, buwisan, at turuan ng relihiyon.",
        ],
      },
      {
        heading: "Ekonomiya",
        paragraphs: [
          "Mula 1565 hanggang 1815, ang Kalakalang Galyon ang nag-uugnay sa Maynila at Acapulco, Mexico. Dito dumaan ang kalakal ng Pilipinas patungong Europa.",
          "Noong 1782, itinatag ang monopolyo ng tabako. Naging malaking kita ito ng pamahalaan, ngunit nagpahirap sa mga magsasaka.",
        ],
      },
      {
        heading: "Lipunan at edukasyon",
        paragraphs: [
          "Hinati ng sistemang kolonyal ang lipunan: peninsulares, insulares, ilustrados, at mga indio. Nakabatay sa lahi at kapanganakan ang mga karapatan.",
          "Kontrolado ng mga orden ng prayle ang karamihan ng paaralan. Iilan lamang ang nakapag-aral sa mas mataas na antas, at nakarating sa Europa ang mga ilustrado.",
        ],
      },
    ],
    keyTerms: [
      {
        word: "reduccion",
        meaning: "Patakarang pinagsama-sama ang mga tao sa isang pueblo.",
      },
      {
        word: "encomienda",
        meaning:
          "Lupang ibinigay ng hari ng Espanya sa isang encomendero kapalit ng pangangasiwa sa mga tao roon.",
      },
      {
        word: "Kalakalang Galyon",
        meaning: "Kalakalan sa pagitan ng Maynila at Acapulco gamit ang malalaking barko.",
      },
      {
        word: "ilustrado",
        meaning:
          "Pilipinong nakapag-aral, kadalasan sa Europa, na nanguna sa paghingi ng reporma.",
      },
    ],
  },

  "lesson-3-3": {
    activityId: "ch2",
    objective:
      "Makilala ang mga pangunahing tauhan ng rebolusyon at ang kanilang ambag.",
    sections: [
      {
        heading: "Mga repormista",
        paragraphs: [
          "Sumulat sina Jose Rizal, Marcelo H. del Pilar, at Graciano Lopez Jaena upang ipakita ang mga pang-aabuso at humingi ng reporma. Ang Noli Me Tangere at El Filibusterismo ni Rizal ang pinakabantog na halimbawa.",
        ],
      },
      {
        heading: "Mga rebolusyonaryo",
        paragraphs: [
          "Pinamunuan ni Andres Bonifacio ang Katipunan. Naging kalihim nito si Emilio Jacinto, ang utak ng Katipunan at may-akda ng Kartilya.",
          "Si Emilio Aguinaldo ang naging pangulo ng rebolusyonaryong pamahalaan at nagpahayag ng kalayaan sa Kawit. Si Apolinario Mabini ang nagsilbing tagapayo nito, at si Antonio Luna ang namuno sa mga hukbo.",
        ],
      },
      {
        heading: "Kababaihan ng rebolusyon",
        paragraphs: [
          "Si Gregoria de Jesus ang Lakambini ng Katipunan. Si Melchora Aquino, ang Tandang Sora, ang nagpakain at nag-aliw sa mga sugatang Katipunero.",
          "Si Trinidad Tecson, ang Ina ng Biak-na-Bato, ay nagsilbing nars sa mga labanan.",
        ],
      },
    ],
    keyTerms: [
      {
        word: "Lakambini",
        meaning: "Tawag sa pinakamataas na kababaihan ng Katipunan.",
      },
      {
        word: "Dakilang Paralitiko",
        meaning: "Palayaw ni Apolinario Mabini, na may kapansanan ngunit matalas ang isip.",
      },
      {
        word: "Tandang Sora",
        meaning: "Palayaw ni Melchora Aquino, na tumulong sa mga Katipunero.",
      },
    ],
  },

  "lesson-1-1": {
    activityId: "ch3",
    objective:
      "Ilarawan ang Labanan sa Look ng Maynila at ang epekto nito sa rebolusyon.",
    sections: [
      {
        heading: "Pagsiklab ng Digmaang Espanyol-Amerikano",
        paragraphs: [
          "Pagkatapos sumabog ang barkong USS Maine sa Havana, Cuba, noong Pebrero 1898, nagdeklara ng digmaan ang Estados Unidos laban sa Espanya noong Abril 1898.",
          "Dahil kolonya rin ng Espanya ang Pilipinas, naging pangunahing lugar ng labanan ang Maynila.",
        ],
      },
      {
        heading: "Ang labanan",
        paragraphs: [
          "Noong Mayo 1, 1898, sinalakay ng hukbong dagat ng Estados Unidos sa pamumuno ni Commodore George Dewey ang hukbong dagat ng Espanya sa ilalim ni Admiral Patricio Montojo.",
          "Mabilis na natalo ang hukbong dagat ng Espanya sa Look ng Maynila. Kaunti lamang ang naging sakripisyo sa panig ng Estados Unidos.",
        ],
      },
      {
        heading: "Epekto",
        paragraphs: [
          "Dahil sa pagkatalo ng Espanya, nakabalik si Emilio Aguinaldo mula sa Hong Kong at muling pinamunuan ang rebolusyon. Dito humantong ang pagpapahayag ng kalayaan noong Hunyo 12, 1898.",
          "Sa Kasunduan sa Paris noong Disyembre 1898, ipinasa ng Espanya ang Pilipinas sa Estados Unidos kapalit ng bayad na 20 milyong dolyar.",
        ],
      },
    ],
    keyTerms: [
      {
        word: "USS Maine",
        meaning: "Barkong pandigma ng Estados Unidos na sumabog sa Cuba noong 1898.",
      },
      {
        word: "Kasunduan sa Paris",
        meaning:
          "Kasunduang nagtapos ng Digmaang Espanyol-Amerikano noong 1898.",
      },
      {
        word: "Commodore George Dewey",
        meaning: "Pinuno ng hukbong dagat ng Estados Unidos sa Labanan sa Look ng Maynila.",
      },
    ],
  },

  "lesson-3-5": {
    activityId: "ch4",
    objective:
      "Ibigay ang mga mahalagang detalye ng pagpapahayag ng kalayaan noong Hunyo 12, 1898.",
    sections: [
      {
        heading: "Ang araw ng pagpapahayag",
        paragraphs: [
          "Ipinahayag ang kalayaan ng Pilipinas noong Hunyo 12, 1898 sa Kawit, Cavite, sa tahanan ni Emilio Aguinaldo.",
          "Binasa ni Ambrosio Rianzares Bautista ang Acta de la Proclamación de Independencia del Pueblo Filipino. Iwinagayway ang watawat na ginawa nina Marcela Agoncillo, Lorenza Agoncillo, at Delfina Herboza sa Hong Kong.",
        ],
      },
      {
        heading: "Musika at sagisag",
        paragraphs: [
          "Tumugtog ang Marcha Nacional Filipina, na ngayon ay kilala bilang Lupang Hinirang. Si Julian Felipe ang kompositor nito.",
          "Ang watawat ay may asul, pula, at puting bahagi, isang araw na may walong sinag, at tatlong bituin para sa Luzon, Visayas, at Mindanao.",
        ],
      },
      {
        heading: "Makasaysayang bisa",
        paragraphs: [
          "Hindi agad kinilala ng Espanya at ng Estados Unidos ang pagpapahayag. Nagpatuloy ang labanan at sumunod ang Republika ng Malolos noong 1899.",
          "Noong panahon ng mga Amerikano, ipinagdiriwang ang kalayaan tuwing Hulyo 4. Noong 1962, inilipat ni Pangulong Diosdado Macapagal ang pagdiriwang sa Hunyo 12.",
        ],
      },
    ],
    keyTerms: [
      {
        word: "Acta de la Proclamación",
        meaning: "Dokumento ng pagpapahayag ng kalayaan na binasa sa Kawit.",
      },
      {
        word: "Lupang Hinirang",
        meaning: "Pambansang awit ng Pilipinas na dating Marcha Nacional Filipina.",
      },
      {
        word: "Ambisyon ng Malolos",
        meaning: "Ang pagtatatag ng unang Republika ng Pilipinas noong 1899.",
      },
    ],
  },
};

export function getLessonContent(lessonId) {
  return LESSON_CONTENT[lessonId] ?? null;
}
