/* PROJECTS
   Add or edit projects here. The projects page rebuilds itself from this list.

   Fields
     slug    required. Becomes the detail-page address: project.html?p=<slug>
     blurb   the one-liner shown on the projects list
     detail  array of paragraphs for the detail page. Omit it and the row
             links straight out to `href` instead of opening a detail page.
     shots   photos for the detail page: { src, alt, caption? }
     links   outbound buttons on the detail page: { label, href }
     cover   the image that follows the cursor on the projects list
*/
window.PROJECTS_DATA = {
  "items": [
    {
      "slug": "sonic",
      "title": "S.O.N.I.C",
      "year": "2024",
      "role": "Lighting, Systems & Game Logic",
      "org": "Nanyang Polytechnic",
      "blurb": "A game station that tests your directional hearing — three targets, audio cues and shurikens. Built with two groupmates on Raspberry Pi, grandMA3 and OSC.",
      "tags": [
        "grandMA3",
        "Raspberry Pi",
        "OSC",
        "L-ISA Studio",
        "Reaper DAW",
        "Game Logic"
      ],
      "href": "https://www.linkedin.com/in/samuel-yee-573164284/",
      "cover": "assets/img/covers/sonic.svg",
      "detail": [
        "Game Station 1 of Project S.O.N.I.C is an interactive target practice game, built with two groupmates. There are three boards — left, right and centre — and players throw shurikens at them. The only thing telling you which board to hit is where the sound is coming from: a cue plays from one direction, and that target becomes yours. It runs over three rounds, each one giving you less time than the last.",
        "Everything talks over OSC — OpenSoundControl, a protocol for passing messages between music software and hardware. A Raspberry Pi sits in the middle of it, running the game logic while keeping the lighting and the audio in step with each other at the same time: grandMA3 for the lights, L-ISA Studio and Reaper DAW for the sound.",
        "My part was the lighting and the plumbing between the two. I programmed the lightshow in grandMA3 so the lighting reacted to the game rather than just running alongside it, and I wrote the Pi's side of that communication — the bridge that kept grandMA3, L-ISA Studio and Reaper in sync while the game ran. I also helped program the game logic, and helped configure the sensors into the cardboard target boards that let the Pi know when a target had been hit. The shuriken were designed and 3D printed by our lecturer, Mr Fu Yong Wei; we built a Styrofoam placeholder to work against while they were being made."
      ],
      "shots": [
        {
          "src": "assets/img/projects/sonic-1-shuriken-placeholder.webp",
          "title": "Shuriken placeholder",
          "caption": "A Styrofoam placeholder we built for the shuriken. The 3D shuriken themselves were designed, 3D printed and kindly provided by our lecturer, Mr Fu Yong Wei.",
          "alt": "A black-taped Styrofoam block holding red and black 3D-printed shuriken"
        },
        {
          "src": "assets/img/projects/sonic-2-raspberry-pi.webp",
          "title": "Raspberry Pi configuration",
          "caption": "The Pi and breadboard that ran the game logic and carried the messages between the lighting and the audio.",
          "alt": "A Raspberry Pi and breadboard wired up inside a foam-lined box"
        },
        {
          "src": "assets/img/projects/sonic-3-target-boards.webp",
          "title": "Sensory target boards",
          "caption": "The boards are cardboard with sensors on the back, wired down to the Raspberry Pi hidden in the black box below. Hit the right target and its lightshow and audio fire; hit the wrong one and you get the opposite.",
          "alt": "Three cardboard target boards with ninja prints, wired to a black box"
        }
      ],
      "links": [
        {
          "label": "Watch the reel on Instagram",
          "href": "https://www.instagram.com/reel/C-329N1CH8-/"
        },
        {
          "label": "Read it on LinkedIn",
          "href": "https://www.linkedin.com/in/samuel-yee-573164284/"
        }
      ],
      "beats": [
        [
          "Brief",
          "A game station that tests directional hearing. Three boards — left, right and centre — hit with shurikens, with nothing but where the sound comes from telling you which one is yours. Three rounds, each shorter than the last."
        ],
        [
          "My part",
          "The grandMA3 lightshow, the Raspberry Pi bridge between the lighting and the audio, part of the game logic, and the sensors that turned three plain boards into targets that know when they have been hit."
        ],
        [
          "The call",
          "Everything runs over OSC. One Pi keeps grandMA3, L-ISA Studio and Reaper in step while the game is running, so the lighting reacts to the game rather than playing alongside it."
        ]
      ],
      "expansion": "Sensory Observation Ninja Immersive Challenge",
      "reel": "https://www.instagram.com/reel/C-329N1CH8-/"
    },
    {
      "slug": "nyp-open-house",
      "title": "Nanyang Polytechnic Open House",
      "year": "2024",
      "role": "LED Tunnel Design & Lighting",
      "org": "Nanyang Polytechnic",
      "blurb": "An LED tunnel leading visitors towards the lecture theatre hosting the drone show — designed, built and programmed with two others.",
      "tags": [
        "Lighting Design",
        "LED Tunnel",
        "Event Production",
        "Rigging & Patching"
      ],
      "href": "https://www.linkedin.com/in/samuel-yee-573164284/",
      "cover": "assets/img/covers/open-house.svg",
      "detail": [
        "For the 2024 Nanyang Polytechnic Open House, three of us designed and built an LED tunnel leading towards the lecture theatre that was hosting the drone show. It was the approach to the main event — the thing every visitor walked through on the way in.",
        "I designed the tunnel, then helped build it: putting up the structure, patching the LED tubes onto it, laying black cloth over the whole thing so the effects still read in daylight, and setting the printed foam board cutout our lecturer produced at the entrance. There were also the haze and smoke machines to patch, and the power and DMX runs to re-organise around the setup we had planned.",
        "Of the two light shows displayed over the Open House, I programmed one. I also patched the lights in the lecture theatre itself for the drone show."
      ],
      "shots": [
        {
          "src": "assets/img/projects/openhouse-1-end-product.webp",
          "title": "End product",
          "caption": "One of the two light shows displayed at the 2024 Nanyang Polytechnic Open House — this is the one I programmed.",
          "alt": "The finished LED tunnel lit in magenta and cyan, looking towards the entrance"
        },
        {
          "src": "assets/img/projects/openhouse-2-tunnel-entrance.webp",
          "title": "Tunnel entrance",
          "caption": "Setting up the printed foam board cutout, produced by our lecturer, at the entrance.",
          "alt": "The ENGIMAGICA archway at the tunnel entrance being rigged from a ladder"
        },
        {
          "src": "assets/img/projects/openhouse-3-patching-led-tubes.webp",
          "title": "Patching the LED tubes",
          "caption": "Patching the LED tubes and fixing them to the tunnel structure according to the design we had.",
          "alt": "LED tubes lit in colour, laid out in flight cases during patching"
        },
        {
          "src": "assets/img/projects/openhouse-4-black-cloth.webp",
          "title": "Laying black cloth over the structure",
          "caption": "Blocking out the daylight so the lighting effects still read properly while the tunnel ran during the day.",
          "alt": "Two people draping black cloth over the tunnel frame from a scaffold"
        },
        {
          "src": "assets/img/projects/openhouse-5-building-structure.webp",
          "title": "Building the LED tunnel",
          "caption": "Putting up the structure the whole tunnel hangs off.",
          "alt": "The bare metal pipe structure of the tunnel, taped off with caution tape"
        },
        {
          "src": "assets/img/projects/openhouse-6-power-dmx-cables.webp",
          "title": "Managing power and DMX",
          "caption": "Re-organising the power and DMX runs to fit the lighting setup we had planned.",
          "alt": "Running power and DMX cable along a lighting truss"
        },
        {
          "src": "assets/img/projects/openhouse-7-teardown-fixtures.webp",
          "title": "Tearing down from the classroom",
          "caption": "Taking the lighting fixtures down from our classroom to bring to the venue.",
          "alt": "A moving-head lighting fixture packed onto its flight case"
        }
      ],
      "links": [
        {
          "label": "Read it on LinkedIn",
          "href": "https://www.linkedin.com/in/samuel-yee-573164284/"
        }
      ],
      "beats": [
        [
          "Brief",
          "An LED tunnel leading visitors towards the lecture theatre hosting the drone show — the approach to the main event, and the first thing anyone walked through."
        ],
        [
          "My part",
          "Designed the tunnel and helped build it: the structure, patching the LED tubes, the haze and smoke machines, the power and DMX runs. Programmed one of the two light shows, and patched the lecture theatre rig for the drone show."
        ],
        [
          "The call",
          "Black cloth over the whole structure. Without it the effects washed out in daylight, and the tunnel ran through the day."
        ]
      ]
    },
    {
      "slug": "mini-python-games",
      "title": "Mini Python Games",
      "year": "2025",
      "role": "",
      "org": "",
      "blurb": "A small arcade of games built in Python over free evenings — game loops, state handling and input, one self-contained script at a time.",
      "tags": [
        "Python",
        "Game Logic",
        "Open Source",
        "MIT"
      ],
      "href": "https://github.com/samwoh05/Mini-Python-Games",
      "cover": "assets/img/covers/python.svg"
    },
    {
      "slug": "this-portfolio",
      "title": "This Portfolio",
      "year": "2026",
      "role": "",
      "org": "",
      "blurb": "A hand-built portfolio — poster-led layout, scroll-driven parallax, a mosaic pixel cursor, and a gallery that rebuilds itself from one data file. No frameworks, no build step.",
      "tags": [
        "HTML",
        "CSS",
        "JavaScript",
        "No Build Step"
      ],
      "href": "https://github.com/samwoh05/Portfolio-Website-",
      "cover": "assets/img/covers/portfolio.svg"
    }
  ]
};
