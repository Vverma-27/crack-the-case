"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CluesPage() {
  const params = useParams();
  const id = params?.id as string;
  const [selectedObjective, setSelectedObjective] = useState<string>("");
  const [isHiddenRevealed, setIsHiddenRevealed] = useState(false);

  // Only handle case ID 1 for now
  if (id !== "1") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-6">
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
      label: "Objective 2: Who did Victor Mercer have an affair with?",
    },
    { value: "3", label: "Objective 3: Who hired the assassins?" },
    { value: "4", label: "Objective 4: Who actually killed Victor Mercer?" },
    { value: "5", label: "Bonus Objective: What happened to Leonard Grayson?" },
  ];

  const clues = {
    "1": [
      "Look for discrepancies in identity documents and compare the suspect profiles against professional criminal records. Some people aboard may have telltale signs of false identities.",
      'Interpol\'s records mention specific assassins with distinctive traits. The "Emerald Widow" leaves behind emerald jewelry, while "The Viper" has a very specific tattoo. Look for these markers among your suspects.',
      "Cross-reference the hospital birth records with the suspect profiles. Do the birth records match what's claimed in their profiles? The article about Rachel Harlow's death may contain clues about someone using a false identity.",
      'Review the employment history and professional qualifications of medical personnel aboard. Look for inconsistencies that might reveal someone with specialized skills matching the profile of the assassin known as "Nightingale." There are three professional assassins aboard under false identities.',
    ],
    "2": [
      "Examine who could have sent the text messages to Victor Mercer. Try connecting these communications with other evidence provided, such as hotel records, photos, or personal items found in Victor's suite.",
      "The deleted voicemail specifies that the female caller was already married and wanted to leave her husband. Review the passenger information to identify which married woman might have been involved with Victor.",
      "Determine who wore the lipstick found at the crime scene as detailed in the incident report. Where else is this same brand of lipstick mentioned in the evidence? Check personal items, correspondence, and other documents that might connect someone to this specific cosmetic product.",
      "Who was wearing a black gown at the Athens Gala? Victor was complimenting someone about their black dress in his messages. Could this be the same person? Check the social event photos and blog entries for connections.",
    ],
    "3": [
      'Follow the money trail in the bank statements. Look for unusual transactions, especially large deposits that might be payment for "services" around January 2025. Also check the email correspondence regarding assassination plans.',
      'Several suspects received large "signing bonuses" from seemingly legitimate companies around the same time. Check the ownership of these companies - are they connected? The email thread mentions hiring three assassins with a "10% signing fee."',
      "Four UK companies appear in the bank statements: Apex Ventures, Triton Consulting, Pinnacle Solutions, and Oceanic Research Ltd. Two are owned by Nathaniel Bryce, one by Amelia Holt, and one by Amelia Foster.",
      "Match the company owners' names with the names provided in the consortium document. Find their common link to identify who orchestrated the assassination plot. Look for recurring patterns in communication styles, financial flows, or naming conventions across these different entities.",
    ],
    "4": [
      "Analyze the medical evidence about Victor's death - the injection mark, discoloration, and unusual toxin. Consider the timing of events using witness statements, and review the deck plan to understand who could access Victor's suite.",
      'Eliminate suspects by determining their exact whereabouts during the time of the murder. Review witness statements for confirmed alibis and monitor their movements and actions during that critical timeframe. The maintenance worker overheard two women arguing about "the same target" in the service corridor.',
      "Has any toxin been mentioned in the documents that could be lethal enough to kill Victor in the manner described? Examine research papers or specialized knowledge that might connect a suspect to such a substance.",
      "Examine witness testimonies to determine who was not fully occupied during the time of the murder. Consult the cruise blueprint for alternative entry points to Victor’s suite, such as a service corridor or a connecting door. Trace a possible route an intruder could have taken, and carefully cross-reference with physical evidence collected — perhaps even the diary notes discovered in the tunnels — to uncover who might have had the access and knowledge to move unnoticed.",
    ],
    "5": [
      "Track Leonard's movements on the night of the murder. What do the witness statements tell us about his whereabouts and behavior? Consider the unusual splash heard from the deck.",
      "Leonard was last seen by Eleanor Hart at 10:30 PM exiting his cabin (722) in an agitated state, heading toward the main stairwell. Later, Martin Wells heard an unusual splash around 11:30-11:40 PM. What might connect these events?",
      "Leonard disappeared after witnessing something connected to the murder. The deck officer heard a physical altercation near Victor's suite. Eleanor Hart later saw someone with a fresh cut near his eye. Could Leonard have confronted the assassins and met with foul play?",
      "Leonard was seen exiting his room going towards the stairwell. Who lives next to the stairwell? Who could have been involved in the altercations and who was not preoccupied elsewhere during this timeframe?",
    ],
  };

  const renderHiddenBox = () => {
    if (selectedObjective === "3") {
      return (
        <div className="mt-6 mb-6">
          <h3 className="text-lg font-detective mb-2">
            Password for Consortium Document
          </h3>
          <div
            className={`border-2 border-dashed border-primary rounded-md p-6 text-center cursor-pointer relative overflow-hidden ${
              isHiddenRevealed
                ? "bg-primary/10"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
            onClick={() => setIsHiddenRevealed(true)}
          >
            {!isHiddenRevealed && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <p className="text-muted-foreground">
                  Click to reveal password
                </p>
              </div>
            )}
            <p
              className={`text-2xl font-bold text-primary ${
                isHiddenRevealed ? "visible" : "invisible"
              }`}
            >
              CHIMERA
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-3xl mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-detective mb-4">
          SS Celestial Investigation: Progressive Clue Sheet
        </h1>
        <p className="text-muted-foreground mb-6">
          These are progressive clues that build upon each other, revealing more
          information to help solve the case. Select an objective to view its
          clues.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Select Objective
          </label>
          <Select
            value={selectedObjective}
            onValueChange={(value) => {
              setSelectedObjective(value);
              setIsHiddenRevealed(false); // Reset hidden box when changing objectives
            }}
          >
            <SelectTrigger className="w-full">
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

        {selectedObjective && (
          <div className="mt-6">
            <h2 className="text-xl font-detective mb-4">
              {objectives.find((o) => o.value === selectedObjective)?.label}
            </h2>

            {renderHiddenBox()}

            <Accordion type="single" collapsible className="space-y-2">
              {clues[selectedObjective as keyof typeof clues].map(
                (clue, index) => (
                  <AccordionItem
                    key={index}
                    value={`clue-${index}`}
                    className="border rounded-md"
                  >
                    <AccordionTrigger className="px-4 py-2">
                      Clue {index + 1}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2 text-muted-foreground">
                      {clue}
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </div>
        )}
      </Card>
    </div>
  );
}
