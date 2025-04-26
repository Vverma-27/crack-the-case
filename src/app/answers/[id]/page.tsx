"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AnswersPage() {
  const params = useParams();
  const id = params?.id as string;

  const [selectedObjective, setSelectedObjective] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // Only handle case ID 1 for now
  if (id !== "1") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-detective mb-4">Case Not Found</h1>
          <p className="text-muted-foreground">
            This case doesn't exist or has been archived.
          </p>
        </Card>
      </div>
    );
  }

  const objectives = [
    { value: "1", label: "Objective 1: Who isn't who they claim to be?" },
    {
      value: "2",
      label: "Objective 2: Who was Victor Mercer having an affair with?",
    },
    { value: "3", label: "Objective 3: Who hired the assassins?" },
    { value: "4", label: "Objective 4: Who actually killed Victor Mercer?" },
    { value: "5", label: "Bonus Objective: What happened to Leonard Grayson?" },
  ];

  const checkAnswer = () => {
    // Reset message state
    setMessage("");
    setMessageType("");

    if (!selectedObjective) {
      setMessage("Please select an objective first.");
      setMessageType("error");
      return;
    }

    // Normalize input by trimming, converting to lowercase
    const normalizedAnswer = answer.trim().toLowerCase();

    // Handle each objective based on the selected objective
    switch (selectedObjective) {
      case "1":
        handleObjective1(normalizedAnswer);
        break;
      case "2":
        handleObjective2(normalizedAnswer);
        break;
      case "3":
        handleObjective3(normalizedAnswer);
        break;
      case "4":
        handleObjective4(normalizedAnswer);
        break;
      case "5":
        // For bonus objective, just show the answer
        setMessage("Marcus Reid threw Leonard Grayson overboard");
        setMessageType("success");
        break;
      default:
        setMessage("Please select a valid objective.");
        setMessageType("error");
    }
  };

  // Handler for Objective 1 (who isn't who they claim to be)
  const handleObjective1 = (normalizedAnswer: string) => {
    // First, preprocess the input to standardize format
    // Replace commas without spaces with comma+space
    const preprocessedInput = normalizedAnswer
      .replace(/,([^\s])/g, ", $1") // Add space after comma if missing
      .toLowerCase()
      .trim();

    // Define correct suspects with all valid variations
    const correctSuspectVariations = {
      sophia: [
        "sophia",
        "sophia blackwood",
        "emerald widow",
        "the emerald widow",
      ],
      marcus: ["marcus", "marcus reid", "viper", "the viper"],
      elena: [
        "elena",
        "elena vasquez",
        "dr elena",
        "dr. elena",
        "dr elena vasquez",
        "dr. elena vasquez",
        "nightingale",
      ],
      laura: ["laura", "laura campbell", "rachel", "rachel harlow"],
    };

    // The wrong suspects with variations
    const wrongSuspectVariations = [
      "yvonne",
      "yvonne lambert",
      "leonard",
      "leonard grayson",
      "eleanor",
      "eleanor grayson",
    ];

    // Add spaces to start and end to help with word boundary detection
    const inputText = " " + preprocessedInput + " ";

    // Identify which correct suspects are mentioned
    const identifiedCorrect = {
      sophia: false,
      marcus: false,
      elena: false,
      laura: false,
    };

    // Check each suspect group with more flexible matching
    Object.entries(correctSuspectVariations).forEach(([key, variations]) => {
      for (const variation of variations) {
        // Different ways the name might appear in the input
        const patterns = [
          ` ${variation} `, // surrounded by spaces
          ` ${variation},`, // followed by a comma
          `,${variation} `, // preceded by a comma (with space)
          `, ${variation} `, // preceded by comma+space
          `, ${variation},`, // surrounded by commas
          `^${variation} `, // at start of string
          `^${variation},`, // at start, followed by comma
          ` ${variation}$`, // at end of string
          `,${variation}$`, // at end, preceded by comma
          `^${variation}$`, // exact match (whole string)
        ];

        // Test each pattern
        if (
          patterns.some((pattern) => {
            // Convert pattern to regex (escape special chars)
            const escapedPattern = pattern
              .replace(/\^/g, "^")
              .replace(/\$/g, "$")
              .replace(/\./g, "\\.");

            const regex = new RegExp(escapedPattern);
            return regex.test(inputText);
          })
        ) {
          identifiedCorrect[key as keyof typeof identifiedCorrect] = true;
          break;
        }
      }
    });

    // Check for wrong suspects with the same flexible matching
    let hasWrongSuspect = false;

    for (const suspect of wrongSuspectVariations) {
      // Different ways the name might appear
      const patterns = [
        ` ${suspect} `, // surrounded by spaces
        ` ${suspect},`, // followed by a comma
        `,${suspect} `, // preceded by a comma (with space)
        `, ${suspect} `, // preceded by comma+space
        `, ${suspect},`, // surrounded by commas
        `^${suspect} `, // at start of string
        `^${suspect},`, // at start, followed by comma
        ` ${suspect}$`, // at end of string
        `,${suspect}$`, // at end, preceded by comma
        `^${suspect}$`, // exact match (whole string)
      ];

      // Test each pattern
      if (
        patterns.some((pattern) => {
          // Convert pattern to regex (escape special chars)
          const escapedPattern = pattern
            .replace(/\^/g, "^")
            .replace(/\$/g, "$")
            .replace(/\./g, "\\.");

          const regex = new RegExp(escapedPattern);
          return regex.test(inputText);
        })
      ) {
        hasWrongSuspect = true;
        break;
      }
    }

    // Count how many correct suspects were identified
    const correctCount =
      Object.values(identifiedCorrect).filter(Boolean).length;

    // Perfect answer - all 4 correct suspects identified
    if (correctCount === 4 && !hasWrongSuspect) {
      setMessage(
        "Perfect! You identified all the impostors: Sophia Blackwood (Emerald Widow), Marcus Reid (The Viper), Dr. Elena Vasquez (Nightingale), and Laura Campbell (Rachel Harlow). Excellent work, Detective."
      );
      setMessageType("success");
      return;
    }

    // Include a wrong suspect
    if (hasWrongSuspect) {
      setMessage(
        "Not quite. That person is not faking their identity. Look again at the behavioral clues and hidden histories!"
      );
      setMessageType("error");
      return;
    }

    // Only some correct suspects identified (no wrong ones)
    if (correctCount > 0 && correctCount < 4) {
      let message = "";

      // Compose message based on which suspects were identified
      if (
        identifiedCorrect.sophia &&
        identifiedCorrect.marcus &&
        identifiedCorrect.elena
      ) {
        message =
          "Very close! You've found three out of four. One more impostor remains!";
      } else if (
        identifiedCorrect.sophia &&
        identifiedCorrect.marcus &&
        identifiedCorrect.laura
      ) {
        message =
          "Almost there! You found three of the four people hiding their real selves.";
      } else if (
        identifiedCorrect.marcus &&
        identifiedCorrect.elena &&
        identifiedCorrect.laura
      ) {
        message =
          "You're almost there! Three out of four impostors identified. One more to find.";
      } else if (
        identifiedCorrect.sophia &&
        identifiedCorrect.elena &&
        identifiedCorrect.laura
      ) {
        message =
          "Very close! Three of the four are correct — don't miss the last one.";
      } else if (identifiedCorrect.sophia && identifiedCorrect.marcus) {
        message =
          "Good job! Both Sophia Blackwood and Marcus Reid are using false identities. However, you are missing two more.";
      } else if (identifiedCorrect.sophia && identifiedCorrect.elena) {
        message =
          "You're halfway there! Sophia and Elena are both not who they seem. But there are others too.";
      } else if (identifiedCorrect.sophia && identifiedCorrect.laura) {
        message =
          "You're on the right track! Sophia and Laura both have hidden pasts. But that's not the full list.";
      } else if (identifiedCorrect.marcus && identifiedCorrect.elena) {
        message =
          "Both are correct, but there are still others hiding their real identities. Keep digging!";
      } else if (identifiedCorrect.marcus && identifiedCorrect.laura) {
        message =
          "Correct for both! But some others are still missing from your list.";
      } else if (identifiedCorrect.elena && identifiedCorrect.laura) {
        message =
          "Both correct! But not complete. There are more masks aboard this ship.";
      } else if (identifiedCorrect.sophia) {
        message =
          "Correct! Sophia Blackwood is indeed the Emerald Widow. However, there are other suspects who are also faking their identities. Keep looking!";
      } else if (identifiedCorrect.marcus) {
        message =
          "Yes, Marcus Reid is secretly The Viper. But there are more individuals hiding their true selves. Try again!";
      } else if (identifiedCorrect.elena) {
        message =
          "Correct, Dr. Elena Vasquez is actually Nightingale. But you're missing a few others faking their profiles too.";
      } else if (identifiedCorrect.laura) {
        message =
          "You found one! Laura Campbell is actually Rachel Harlow. But others are also not who they claim to be.";
      }

      setMessage(message);
      setMessageType("error");
      return;
    }

    // Default fallback
    setMessage("Incorrect answer, try again.");
    setMessageType("error");
  };

  // Handler for Objective 2 (affair)
  const handleObjective2 = (normalizedAnswer: string) => {
    // Check if the answer contains multiple names (simple space or comma check)
    if (
      (normalizedAnswer.includes(" ") &&
        !normalizedAnswer.includes("eleanor grayson")) ||
      normalizedAnswer.includes(",")
    ) {
      setMessage("Please guess only one person for this objective.");
      setMessageType("error");
      return;
    }

    // Variations of names to accept
    const nameVariations = {
      "eleanor grayson": [
        "eleanor",
        "eleanor grayson",
        "mrs grayson",
        "mrs. grayson",
      ],
      "yvonne lambert": ["yvonne", "yvonne lambert"],
      "marcus reid": ["marcus", "marcus reid", "the viper", "viper"],
      "laura campbell": ["laura", "laura campbell", "rachel", "rachel harlow"],
      "elena vasquez": [
        "elena",
        "elena vasquez",
        "dr elena",
        "dr. elena",
        "dr elena vasquez",
        "dr. elena vasquez",
        "nightingale",
      ],
      "sophia blackwood": [
        "sophia",
        "sophia blackwood",
        "emerald widow",
        "the emerald widow",
      ],
      "leonard grayson": [
        "leonard",
        "leonard grayson",
        "mr grayson",
        "mr. grayson",
      ],
    };

    // Messages for each person
    const messages = {
      "eleanor grayson":
        "Correct! Victor Mercer was having a secret affair with Eleanor Grayson, the wife of Leonard Grayson. Well done uncovering the hidden relationship.",
      "yvonne lambert":
        "Incorrect. Yvonne had a relationship with Victor in the past, but it had ended before the cruise. Look for someone more recently involved.",
      "marcus reid":
        "Incorrect. Marcus Reid had no personal connection to Victor beyond the assassination plot.",
      "laura campbell":
        "Incorrect. Laura Campbell's motive was revenge, but she was not romantically involved with Victor.",
      "elena vasquez":
        "Incorrect. Dr. Elena Vasquez was a covert assassin, not romantically connected to Victor.",
      "sophia blackwood":
        "Incorrect. Sophia Blackwood had no personal relationship with Victor — her business was assassination, not affection.",
      "leonard grayson":
        "Incorrect. Leonard Grayson had a professional rivalry with Victor, but no romantic involvement.",
    };

    // Check each possible person
    for (const [person, variations] of Object.entries(nameVariations)) {
      if (variations.some((variation) => normalizedAnswer === variation)) {
        setMessage(messages[person as keyof typeof messages]);
        setMessageType(person === "eleanor grayson" ? "success" : "error");
        return;
      }
    }

    // Default response if no match
    setMessage("Incorrect answer, try again.");
    setMessageType("error");
  };

  // Handler for Objective 3 (who hired the assassins)
  const handleObjective3 = (normalizedAnswer: string) => {
    // Check if the answer contains multiple names
    if (
      (normalizedAnswer.includes(" ") &&
        !normalizedAnswer.includes("yvonne lambert")) ||
      normalizedAnswer.includes(",")
    ) {
      setMessage("Please guess only one person for this objective.");
      setMessageType("error");
      return;
    }

    // Variations of names to accept
    const nameVariations = {
      "yvonne lambert": ["yvonne", "yvonne lambert"],
      "eleanor grayson": [
        "eleanor",
        "eleanor grayson",
        "mrs grayson",
        "mrs. grayson",
      ],
      "marcus reid": ["marcus", "marcus reid", "the viper", "viper"],
      "laura campbell": ["laura", "laura campbell", "rachel", "rachel harlow"],
      "elena vasquez": [
        "elena",
        "elena vasquez",
        "dr elena",
        "dr. elena",
        "dr elena vasquez",
        "dr. elena vasquez",
        "nightingale",
      ],
      "sophia blackwood": [
        "sophia",
        "sophia blackwood",
        "emerald widow",
        "the emerald widow",
      ],
      "leonard grayson": [
        "leonard",
        "leonard grayson",
        "mr grayson",
        "mr. grayson",
      ],
    };

    // Messages for each person
    const messages = {
      "yvonne lambert":
        "Correct! Yvonne Lambert, fearing Victor's whistleblowing against the Chimera Consortium, hired the assassins to eliminate him. Well spotted, Detective.",
      "eleanor grayson":
        "Incorrect. Eleanor had emotional motives, but she did not orchestrate the assassination.",
      "marcus reid":
        "Incorrect. Marcus was one of the hired assassins, not the one who ordered the hit.",
      "laura campbell":
        "Incorrect. Laura Campbell had her own personal vendetta against Victor, but she did not hire any assassins.",
      "elena vasquez":
        "Incorrect. Dr. Elena Vasquez was part of the assassin team but not the employer.",
      "sophia blackwood":
        "Incorrect. Sophia Blackwood was a contracted killer, not the mastermind.",
      "leonard grayson":
        "Incorrect. Leonard had business issues with Victor, but no evidence connects him to hiring assassins.",
    };

    // Check each possible person
    for (const [person, variations] of Object.entries(nameVariations)) {
      if (variations.some((variation) => normalizedAnswer === variation)) {
        setMessage(messages[person as keyof typeof messages]);
        setMessageType(person === "yvonne lambert" ? "success" : "error");
        return;
      }
    }

    // Default response if no match
    setMessage("Incorrect answer, try again.");
    setMessageType("error");
  };

  // Handler for Objective 4 (who killed Victor)
  const handleObjective4 = (normalizedAnswer: string) => {
    // Check if the answer contains multiple names
    if (
      (normalizedAnswer.includes(" ") &&
        !normalizedAnswer.includes("laura campbell") &&
        !normalizedAnswer.includes("rachel harlow")) ||
      normalizedAnswer.includes(",")
    ) {
      setMessage("Please guess only one person for this objective.");
      setMessageType("error");
      return;
    }

    // Variations of names to accept
    const nameVariations = {
      "laura campbell": ["laura", "laura campbell", "rachel", "rachel harlow"],
      "sophia blackwood": [
        "sophia",
        "sophia blackwood",
        "emerald widow",
        "the emerald widow",
      ],
      "marcus reid": ["marcus", "marcus reid", "the viper", "viper"],
      "elena vasquez": [
        "elena",
        "elena vasquez",
        "dr elena",
        "dr. elena",
        "dr elena vasquez",
        "dr. elena vasquez",
        "nightingale",
      ],
      "yvonne lambert": ["yvonne", "yvonne lambert"],
      "eleanor grayson": [
        "eleanor",
        "eleanor grayson",
        "mrs grayson",
        "mrs. grayson",
      ],
      "leonard grayson": [
        "leonard",
        "leonard grayson",
        "mr grayson",
        "mr. grayson",
      ],
    };

    // Messages for each person
    const messages = {
      "laura campbell":
        "Correct! Laura Campbell (Rachel Harlow) used the maintenance tunnels, a stolen needle, and her lethal marine toxin to kill Victor Mercer. Outstanding work solving the final mystery.",
      "sophia blackwood":
        "Not quite. Sophia Blackwood intended to kill Victor, but she never reached him in time due to her confrontation with Dr. Elena Vasquez.",
      "marcus reid":
        "Incorrect. Marcus Reid was involved in another altercation that night but did not kill Victor.",
      "elena vasquez":
        "Incorrect. Dr. Elena Vasquez was incapacitated after her fight with Sophia Blackwood and could not reach Victor.",
      "yvonne lambert":
        "Incorrect. Yvonne orchestrated the assassination plot but did not personally kill Victor.",
      "eleanor grayson":
        "Incorrect. Eleanor's relationship with Victor was emotional, not violent.",
      "leonard grayson":
        "Incorrect. Leonard was thrown overboard before Victor was killed.",
    };

    // Check each possible person
    for (const [person, variations] of Object.entries(nameVariations)) {
      if (variations.some((variation) => normalizedAnswer === variation)) {
        setMessage(messages[person as keyof typeof messages]);
        setMessageType(person === "laura campbell" ? "success" : "error");
        return;
      }
    }

    // Default response if no match
    setMessage("Incorrect answer, try again.");
    setMessageType("error");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-detective mb-6">Murder at High Seas</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Objective
            </label>
            <Select
              value={selectedObjective}
              onValueChange={(value) => {
                setSelectedObjective(value);
                setAnswer("");
                setMessage("");
                setMessageType("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an objective..." />
              </SelectTrigger>
              <SelectContent>
                {objectives.map((objective) => (
                  <SelectItem key={objective.value} value={objective.value}>
                    {objective.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedObjective && selectedObjective !== "5" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Answer
              </label>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="mb-4"
              />
            </div>
          )}

          {message && (
            <div
              className={cn(
                "p-3 rounded-md text-sm",
                messageType === "success"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : messageType === "error"
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : ""
              )}
            >
              {message}
            </div>
          )}

          <Button className="w-full" onClick={checkAnswer}>
            {selectedObjective === "5" ? "Show Answer" : "Check Answer"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
