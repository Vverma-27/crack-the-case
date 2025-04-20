"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface CaseCardProps {
  title: string;
  description: string;
  image: string;
  comingSoon?: boolean;
  onClick: () => void;
}

function CaseCard({
  title,
  description,
  image,
  comingSoon = false,
  onClick,
}: CaseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`evidence-card relative overflow-hidden ${
        comingSoon ? "grayscale" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Card image with overlay */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
          style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-primary/90 px-4 py-2 rounded-md text-primary-foreground font-bold transform -rotate-12 text-lg shadow-lg">
              Coming Soon
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-6 relative z-10">
        <h3 className="text-2xl font-bold font-detective mb-2 text-card-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground/90">{description}</p>

        {!comingSoon && (
          <motion.div
            className="mt-4 inline-flex items-center gap-1 text-primary font-medium group"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            whileHover={{ x: 5 }}
          >
            <span>View cases</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transform transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M1 8H15M15 8L8 1M15 8L8 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}

        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-20 h-20 border-t border-r border-border/30 opacity-50" />
        <div className="absolute bottom-2 left-2 w-20 h-20 border-b border-l border-border/30 opacity-50" />
      </div>
    </motion.div>
  );
}

export default function CaseSelection() {
  const handleCaseClick = (caseType: string) => {
    alert(`You selected: ${caseType}`);
    // Could implement navigation to case details page here
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20 opacity-70 z-0" />
      <div className="detective-light w-[600px] h-[600px] top-0 left-1/2 -translate-x-1/2 opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold font-detective mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Choose Your Case
          </motion.h2>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Each case file contains meticulously crafted evidence that will
            challenge your detective skills. Select a category to begin your
            investigation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CaseCard
            title="Murder Mysteries"
            description="Investigate suspicious deaths, examine evidence, and interrogate suspects to uncover dark motives and elusive killers."
            comingSoon={true}
            image="/placeholder.svg"
            onClick={() => handleCaseClick("murder")}
          />

          <CaseCard
            title="Heists & Robberies"
            description="Crack complex security systems, follow money trails, and piece together elaborate schemes to catch master thieves."
            image="/placeholder.svg"
            comingSoon={true}
            onClick={() => handleCaseClick("heist")}
          />

          <CaseCard
            title="Paranormal Cases"
            description="Explore unexplained phenomena, decode cryptic symbols, and venture into the unknown realms of supernatural mysteries."
            image="/placeholder.svg"
            comingSoon={true}
            onClick={() => handleCaseClick("paranormal")}
          />
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-muted-foreground text-sm">
            Custom cases and private events also available.{" "}
            <a href="#" className="text-primary underline">
              Contact us
            </a>{" "}
            for more information.
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -right-12 top-1/4 w-48 h-48 border border-primary/20 rounded-full" />
      <div className="absolute -left-24 bottom-1/3 w-64 h-64 border border-primary/10 rounded-full" />
    </section>
  );
}
