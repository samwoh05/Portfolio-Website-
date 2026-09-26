/* LEARNING — the marketing side, stated in the open.

   This is the section that carries the career change, so it has to be true.
   Every card below is a DRAFT: it renders with a dashed edge and a "To fill
   in" chip so it can never be mistaken for a real credential. Replace the
   fields and delete `draft` and the card becomes a real one.

   Fields
     issuer   required. Who ran it — Google, Meta, HubSpot Academy, NYP, a book.
     title    required. The course as it is actually named on the certificate.
     done     the month you finished it, e.g. "August 2026".
     href     link to the certificate. Leave it out and no link is shown.
     took     THE IMPORTANT ONE. Not what the syllabus covered — one sentence
              on what it changed about how you read a shop window, an ad, a
              menu, a checkout. A list of course names proves attendance.
              This line is the only part that proves thinking.
     draft    true while the card is a placeholder. Delete it when it's real.

   Order them newest first; the section shows them in the order given.
*/
window.LEARNING_DATA = {
  "items": [
    {
      "draft": true,
      "issuer": "Issuer",
      "title": "Course name",
      "done": "Month 2026",
      "took": "One sentence on what this changed about the way you look at something ordinary — a shop window, an ad before a video, a menu, a checkout queue."
    },
    {
      "draft": true,
      "issuer": "Issuer",
      "title": "Course name",
      "done": "Month 2026",
      "took": "Not the syllabus. The thing you now notice that you walked past before."
    },
    {
      "draft": true,
      "issuer": "Issuer",
      "title": "Course name",
      "done": "Month 2026",
      "took": "If a course didn't change anything, leave it off. Three that changed something beat six that didn't."
    }
  ]
};
