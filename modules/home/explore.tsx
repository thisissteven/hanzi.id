import { CustomRouteButton, Divider } from "@/components";
import { cn } from "@/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const books = [
  {
    title: "Their Side",
    description: "Conversations with the most tragically misunderstood people of our time.",
    image: {
      smallUrl:
        "https://res.cloudinary.com/drjgq6umm/image/upload/c_limit,h_92,w_92/dpr_2.0/v1718698982/uploads/focus-web-app/poster_rm1k6w.png",
      mediumUrl:
        "https://res.cloudinary.com/drjgq6umm/image/upload/c_limit,h_184,w_184/dpr_2.0/v1718698982/uploads/focus-web-app/poster_rm1k6w.png",
      source:
        "https://res.cloudinary.com/drjgq6umm/image/upload/c_limit,w_430/dpr_2.0/v1718698982/uploads/focus-web-app/poster_rm1k6w.png",
      width: 960,
      height: 960,
    },
    chapters: [
      {
        title: "Skeletor",
        content:
          "You know him as an evil supervillain, but his closest friends call him Jeff, and he's just doing his best to find his way in a world that doesn't know what to do with a talking skeleton.",
      },
      {
        title: "Hank Scorpio",
        content:
          "What looks to outsiders like a malicious plan to conquer the east coast, was actually a story of liberation and freedom if you get it straight from the source.",
      },
      {
        title: "The Wet Bandits",
        content:
          "The Christmas of 1989 wasn't the first time Harry and Marv crossed paths with the McCallisters. The real story starts in 1973, when Peter tripped Marv in the highschool locker room.",
      },
    ],
  },
  {
    title: "Unseen Heroes",
    description: "Exploring the unknown backstories of infamous characters.",
    image: null,
    chapters: [
      {
        title: "The Wicked Witch",
        content:
          "Before the green skin and flying monkeys, Elphaba was just a misunderstood girl with big dreams and a kind heart.",
      },
      {
        title: "Darth Vader",
        content: "Behind the mask, Anakin Skywalker struggled with loss, love, and the heavy burden of prophecy.",
      },
      {
        title: "Jaws",
        content:
          "More than a man-eating shark, Bruce had a tale of survival and a misunderstood role in the ocean's ecosystem.",
      },
    ],
  },
  {
    title: "Villainous Voices",
    description: "A deep dive into the lives of the most notorious villains.",
    image: null,
    chapters: [
      {
        title: "The Joker",
        content:
          "From failed comedian to the Clown Prince of Crime, Arthur Fleck's story is one of tragic irony and lost sanity.",
      },
      {
        title: "Maleficent",
        content:
          "Once a guardian of the Moors, her path to becoming a dark fairy was paved with betrayal and heartache.",
      },
      {
        title: "Hannibal Lecter",
        content:
          "A brilliant psychiatrist with a dark secret, his journey from orphan to infamous cannibal is a haunting tale.",
      },
    ],
  },
  {
    title: "In Their Shoes",
    description: "Walking a mile in the shoes of history's most reviled figures.",
    image: null,
    chapters: [
      {
        title: "Medusa",
        content:
          "Once a beautiful maiden, Medusa's transformation into a Gorgon is a tale of divine jealousy and cruel punishment.",
      },
      {
        title: "Captain Hook",
        content: "James Hook's vendetta against Peter Pan hides a deeper story of lost love and a broken friendship.",
      },
      {
        title: "Dracula",
        content:
          "Vlad the Impaler's evolution into the legendary vampire Dracula is steeped in history, war, and a quest for immortality.",
      },
    ],
  },
  {
    title: "Twisted Tales",
    description: "Reimagining the narratives of famous antagonists.",
    image: null,
    chapters: [
      {
        title: "Ursula",
        content:
          "The sea witch's rise to power in the underwater kingdom is a story of ambition, betrayal, and resilience.",
      },
      {
        title: "Voldemort",
        content:
          "Tom Riddle's transformation into the Dark Lord is a tragic tale of a boy's quest for identity and acceptance.",
      },
      {
        title: "The Terminator",
        content:
          "Originally sent to destroy, this machine's journey is one of learning, adaptation, and an unexpected alliance with humanity.",
      },
    ],
  },
];

export function Explore() {
  return (
    <div className="mt-4">
      <ul className="flex-1 rounded-xl">
        {books.map((book, index) => {
          return (
            <li key={index}>
              <CustomRouteButton
                path="/read/id"
                className="text-left py-4 max-md:px-4 md:w-full md:hover:bg-hovered active:bg-hovered md:rounded-md duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-4 max-md:hidden -ml-6 grid place-items-center">{index + 1}</div>
                  <div className="md:ml-2.5 relative w-20 md:w-32 aspect-[9/12] shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={book?.image?.source || "/placeholder.png"}
                      alt={`Cover Image: ${book.title}`}
                      className="object-cover w-full h-full"
                      width={92}
                      height={92}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h3 className="text-lg md:text-2xl font-semibold line-clamp-1">{book.title}</h3>
                    <p className="max-md:text-sm text-secondary line-clamp-2 md:line-clamp-3">{book.description}</p>
                    <div className="max-md:mt-4 mt-3 inline-flex text-xs items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-2 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20 w-fit">
                      {book.chapters.length} {book.chapters.length > 1 ? "chapters" : "chapter"}
                    </div>
                  </div>
                  <div className="max-md:hidden grid place-items-center pr-4">
                    <ChevronRight className="text-secondary" />
                  </div>
                </div>
              </CustomRouteButton>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
