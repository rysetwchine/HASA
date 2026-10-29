import { demoQuestions } from "./demoData.js";

/**
 * Mga tanong para sa mga aktibidad sa Practice Arena.
 *
 * Lahat ng nilalaman ay halimbawa para sa prototype. Ang mga tanong ay
 * nakabatay sa mga paksang Araling Panlipunan (Philippine Revolution) at
 * ginagamit lamang ng lokal na activity player, hindi ng isang backend.
 *
 * Ang `reading-water` ay direktang gumagamit ng umiiral na `demoQuestions`
 * mula sa demo data, kaya hindi na ito dinoble.
 */
export const ACTIVITY_QUESTIONS = {
  "featured-hot-seat": [
    {
      id: "hot-seat-q1",
      prompt: "Which group fought for Philippine independence from Spain in 1896?",
      options: [
        "The Katipunan",
        "The Spanish Cortes",
        "The American colonial government",
        "The United Nations",
      ],
      correctIndex: 0,
      explanation:
        "The Katipunan, led by Andres Bonifacio, launched the Philippine Revolution against Spanish rule in 1896.",
    },
    {
      id: "hot-seat-q2",
      prompt: "Who is the national hero whose novels exposed abuses during Spanish rule?",
      options: [
        "Emilio Aguinaldo",
        "Jose Rizal",
        "Apolinario Mabini",
        "Andres Bonifacio",
      ],
      correctIndex: 1,
      explanation:
        "Jose Rizal wrote Noli Me Tangere and El Filibusterismo. He was executed in 1896.",
    },
    {
      id: "hot-seat-q3",
      prompt: "What did the Kartilya ng Katipunan teach its members?",
      options: [
        "How to trade with Spain",
        "The duties and values of a Katipunero",
        "How to become a Spanish official",
        "The rules of the American government",
      ],
      correctIndex: 1,
      explanation:
        "The Kartilya, written by Emilio Jacinto, explained the duties and moral values expected of Katipunan members.",
    },
    {
      id: "hot-seat-q4",
      prompt: "Where was Philippine independence declared on June 12, 1898?",
      options: [
        "Kawit, Cavite",
        "Malolos, Bulacan",
        "Balintawak, Quezon City",
        "Vigan, Ilocos Sur",
      ],
      correctIndex: 0,
      explanation:
        "Independence was proclaimed in Kawit, Cavite. The Malolos Congress came later.",
    },
    {
      id: "hot-seat-q5",
      prompt: "Which of these is a primary source about the revolution?",
      options: [
        "A 2024 textbook chapter",
        "A diary written by a Katipunero in 1897",
        "A modern encyclopedia entry",
        "A documentary film made in 2020",
      ],
      correctIndex: 1,
      explanation:
        "A diary written during the period is a primary source because it comes directly from a participant or witness.",
    },
  ],

  ch1: [
    {
      id: "ch1-q1",
      prompt: "Which event happened first?",
      options: [
        "The founding of the Katipunan",
        "The Cry of Pugad Lawin",
        "The declaration of Philippine independence",
        "The Battle of Manila Bay",
      ],
      correctIndex: 0,
      explanation:
        "The Katipunan was founded in 1892. The revolution began in 1896, and independence was declared in 1898.",
    },
    {
      id: "ch1-q2",
      prompt: "Which event happened last?",
      options: [
        "The founding of the Katipunan",
        "The declaration of Philippine independence",
        "The execution of Jose Rizal",
        "The start of the Philippine Revolution",
      ],
      correctIndex: 1,
      explanation:
        "Independence was declared on June 12, 1898, after the revolution had begun.",
    },
    {
      id: "ch1-q3",
      prompt: "In what year was the Katipunan founded?",
      options: ["1892", "1896", "1898", "1901"],
      correctIndex: 0,
      explanation:
        "Andres Bonifacio and other patriots founded the Katipunan in 1892.",
    },
    {
      id: "ch1-q4",
      prompt: "Which event took place in 1898?",
      options: [
        "The Battle of Manila Bay",
        "The Cry of Pugad Lawin",
        "The execution of Jose Rizal",
        "The founding of La Liga Filipina",
      ],
      correctIndex: 0,
      explanation:
        "The Battle of Manila Bay happened in 1898 during the Spanish-American War.",
    },
    {
      id: "ch1-q5",
      prompt: "Which sequence is in the correct order?",
      options: [
        "Founding of the Katipunan → Cry of Pugad Lawin → Declaration of Independence",
        "Declaration of Independence → Founding of the Katipunan → Cry of Pugad Lawin",
        "Cry of Pugad Lawin → Declaration of Independence → Founding of the Katipunan",
        "Declaration of Independence → Cry of Pugad Lawin → Founding of the Katipunan",
      ],
      correctIndex: 0,
      explanation:
        "The Katipunan was founded in 1892, the revolution began in 1896, and independence was declared in 1898.",
    },
  ],

  ch2: [
    {
      id: "ch2-q1",
      prompt: "Who led the Katipunan and is known as the Supremo?",
      options: [
        "Andres Bonifacio",
        "Jose Rizal",
        "Emilio Aguinaldo",
        "Graciano Lopez Jaena",
      ],
      correctIndex: 0,
      explanation:
        "Andres Bonifacio was the leader of the Katipunan and is remembered as the Supremo.",
    },
    {
      id: "ch2-q2",
      prompt: "Who wrote Noli Me Tangere and El Filibusterismo?",
      options: [
        "Jose Rizal",
        "Emilio Jacinto",
        "Apolinario Mabini",
        "Marcelo H. del Pilar",
      ],
      correctIndex: 0,
      explanation:
        "Jose Rizal wrote both novels, which exposed abuses and encouraged reform.",
    },
    {
      id: "ch2-q3",
      prompt: "Who became the first President of the Philippine Republic?",
      options: [
        "Emilio Aguinaldo",
        "Andres Bonifacio",
        "Apolinario Mabini",
        "Antonio Luna",
      ],
      correctIndex: 0,
      explanation:
        "Emilio Aguinaldo led the revolutionary government and became the first President of the Philippine Republic.",
    },
    {
      id: "ch2-q4",
      prompt: "Who was known as the Sublime Paralytic and served as an adviser to the revolution?",
      options: [
        "Apolinario Mabini",
        "Emilio Jacinto",
        "Gregorio del Pilar",
        "Melchora Aquino",
      ],
      correctIndex: 0,
      explanation:
        "Apolinario Mabini was called the Sublime Paralytic and became a key adviser to the revolutionary government.",
    },
    {
      id: "ch2-q5",
      prompt: "Who was known as the Lakambini and helped organize the women of the Katipunan?",
      options: [
        "Gregoria de Jesus",
        "Melchora Aquino",
        "Josefa Llanes Escoda",
        "Trinidad Tecson",
      ],
      correctIndex: 0,
      explanation:
        "Gregoria de Jesus, wife of Andres Bonifacio, was called Lakambini and helped organize the Katipunan's women.",
    },
  ],

  ch3: [
    {
      id: "ch3-q1",
      prompt: "Which of these is a primary source about the revolution?",
      options: [
        "A diary written by a Katipunero in 1896",
        "A textbook chapter written in 2024",
        "A modern encyclopedia entry",
        "A documentary film made in 2021",
      ],
      correctIndex: 0,
      explanation:
        "Primary sources come from the time of the event and are created by participants or witnesses.",
    },
    {
      id: "ch3-q2",
      prompt: "A history textbook written in 2020 is an example of what kind of source?",
      options: [
        "A primary source",
        "A secondary source",
        "An artifact",
        "An oral tradition",
      ],
      correctIndex: 1,
      explanation:
        "A textbook interprets earlier evidence, so it is a secondary source.",
    },
    {
      id: "ch3-q3",
      prompt: "Why should historians compare two accounts of the same event?",
      options: [
        "To check their reliability and identify bias",
        "To make the story longer",
        "To choose the more exciting version",
        "To avoid using any evidence",
      ],
      correctIndex: 0,
      explanation:
        "Comparing accounts helps historians check facts, spot differences, and understand each writer's perspective.",
    },
    {
      id: "ch3-q4",
      prompt: "Why might a letter from a Spanish official show bias?",
      options: [
        "It reflects the writer's own perspective and interests",
        "Letters are never useful as evidence",
        "It was written in Spanish",
        "It is always completely false",
      ],
      correctIndex: 0,
      explanation:
        "All sources reflect a point of view. A Spanish official's letter may protect Spanish interests or describe Filipinos unfairly.",
    },
    {
      id: "ch3-q5",
      prompt: "Which question best helps you evaluate a source?",
      options: [
        "Who wrote it, when, and why?",
        "Is the title short?",
        "Does it have a colorful cover?",
        "Is it the most popular post online?",
      ],
      correctIndex: 0,
      explanation:
        "The author, date, and purpose help you judge whether a source is credible and useful.",
    },
  ],

  ch4: [
    {
      id: "ch4-q1",
      prompt: "I led the Katipunan and was born in Tondo. Who am I?",
      options: ["Andres Bonifacio", "Jose Rizal", "Emilio Aguinaldo", "Emilio Jacinto"],
      correctIndex: 0,
      explanation:
        "Andres Bonifacio was born in Tondo, Manila, and led the Katipunan.",
    },
    {
      id: "ch4-q2",
      prompt: "I wrote novels that exposed abuses and was executed in 1896. Who am I?",
      options: ["Jose Rizal", "Andres Bonifacio", "Apolinario Mabini", "Antonio Luna"],
      correctIndex: 0,
      explanation:
        "Jose Rizal wrote Noli Me Tangere and El Filibusterismo and was executed on December 30, 1896.",
    },
    {
      id: "ch4-q3",
      prompt: "I became president of the revolutionary government and declared independence in Kawit. Who am I?",
      options: [
        "Emilio Aguinaldo",
        "Andres Bonifacio",
        "Emilio Jacinto",
        "Gregorio del Pilar",
      ],
      correctIndex: 0,
      explanation:
        "Emilio Aguinaldo proclaimed Philippine independence in Kawit, Cavite, on June 12, 1898.",
    },
    {
      id: "ch4-q4",
      prompt: "I advised the revolutionary government and was called the Sublime Paralytic. Who am I?",
      options: [
        "Apolinario Mabini",
        "Jose Rizal",
        "Marcelo H. del Pilar",
        "Graciano Lopez Jaena",
      ],
      correctIndex: 0,
      explanation:
        "Apolinario Mabini was a political thinker and adviser known as the Sublime Paralytic.",
    },
    {
      id: "ch4-q5",
      prompt: "I organized the women's section of the Katipunan. Who am I?",
      options: [
        "Gregoria de Jesus",
        "Melchora Aquino",
        "Trinidad Tecson",
        "Josefa Llanes Escoda",
      ],
      correctIndex: 0,
      explanation:
        "Gregoria de Jesus, the Lakambini, helped organize the women of the Katipunan.",
    },
  ],

  ch5: [
    {
      id: "ch5-q1",
      prompt: "The Katipunan was founded by Andres Bonifacio in 1892.",
      options: ["Fact", "Fiction"],
      correctIndex: 0,
      explanation:
        "This is a fact. The Katipunan was founded in 1892, and Bonifacio was one of its leaders.",
    },
    {
      id: "ch5-q2",
      prompt: "Jose Rizal led the armed revolution as the Supremo.",
      options: ["Fact", "Fiction"],
      correctIndex: 1,
      explanation:
        "This is fiction. Andres Bonifacio was the Supremo. Rizal was a reformist and novelist.",
    },
    {
      id: "ch5-q3",
      prompt: "The Cry of Pugad Lawin is remembered as the start of the Philippine Revolution.",
      options: ["Fact", "Fiction"],
      correctIndex: 0,
      explanation:
        "This is a fact. The Cry of Pugad Lawin in 1896 marked the open revolt against Spain.",
    },
    {
      id: "ch5-q4",
      prompt: "Philippine independence was declared on June 12, 1898, in Kawit, Cavite.",
      options: ["Fact", "Fiction"],
      correctIndex: 0,
      explanation:
        "This is a fact. The declaration took place in Kawit, Cavite, on June 12, 1898.",
    },
    {
      id: "ch5-q5",
      prompt: "The Spanish colonial government supported the Katipunan.",
      options: ["Fact", "Fiction"],
      correctIndex: 1,
      explanation:
        "This is fiction. The Katipunan was a secret society that opposed Spanish rule.",
    },
  ],

  ch6: [
    {
      id: "ch6-q1",
      prompt: "What does the name Katipunan stand for?",
      options: [
        "Kataastaasan, Kagalanggalangang Katipunan ng mga Anak ng Bayan",
        "Kilusang Kabataan ng Bayan",
        "Kapisanan ng mga Kawani ng Bayan",
        "Katipunan ng mga Guro at Mag-aaral",
      ],
      correctIndex: 0,
      explanation:
        "The full name is Kataastaasan, Kagalanggalangang Katipunan ng mga Anak ng Bayan.",
    },
    {
      id: "ch6-q2",
      prompt: "What was the main goal of the Katipunan?",
      options: [
        "Independence from Spain",
        "Friendship with the Spanish government",
        "Free trade with China",
        "Making Manila the capital of Spain",
      ],
      correctIndex: 0,
      explanation:
        "The Katipunan aimed to end Spanish rule and gain independence for the Philippines.",
    },
    {
      id: "ch6-q3",
      prompt: "Who wrote the Kartilya ng Katipunan?",
      options: [
        "Emilio Jacinto",
        "Andres Bonifacio",
        "Jose Rizal",
        "Emilio Aguinaldo",
      ],
      correctIndex: 0,
      explanation:
        "Emilio Jacinto wrote the Kartilya, which explained the duties and values of Katipunan members.",
    },
    {
      id: "ch6-q4",
      prompt: "Who was the Supremo of the Katipunan?",
      options: [
        "Andres Bonifacio",
        "Emilio Jacinto",
        "Jose Rizal",
        "Antonio Luna",
      ],
      correctIndex: 0,
      explanation:
        "Andres Bonifacio served as the Supremo of the Katipunan.",
    },
    {
      id: "ch6-q5",
      prompt: "What is remembered at the Cry of Pugad Lawin?",
      options: [
        "Katipuneros tore their cedulas and declared revolt",
        "Spain signed a peace treaty with the Philippines",
        "The first Philippine Republic was founded",
        "Jose Rizal returned from Europe",
      ],
      correctIndex: 0,
      explanation:
        "The Cry of Pugad Lawin is remembered as the moment Katipuneros tore their cedulas and began the revolution.",
    },
  ],

  "reading-water": demoQuestions,
};
