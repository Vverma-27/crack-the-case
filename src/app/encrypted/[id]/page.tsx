"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function EncryptedPage() {
  const params = useParams();
  const id = params?.id as string;
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const decrypted = localStorage.getItem("decrypted");
    if (decrypted === "true") {
      setIsDecrypted(true);
    }
  }, []);

  if (id !== "1") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-4xl font-detective font-bold text-primary">
            Restricted Access
          </h1>
          <p className="text-muted-foreground">
            This encrypted file does not exist or has been removed from the
            system.
          </p>
          <div className="border border-border/50 rounded-lg p-6 bg-card/50 shadow-md">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-medium mb-2">Encrypted File #{id}</h2>
            <p className="text-sm text-muted-foreground">
              Access denied. Return to authorized files only.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/encrypted/1">Access Known File</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDecrypt = () => {
    if (password.toLowerCase() === "hello") {
      setIsDecrypted(true);
      toast({
        title: "Decryption Successful",
        description: "Journal entry has been decrypted.",
      });
      localStorage.setItem("decrypted", "true");
    } else {
      setIsShaking(true);
      toast({
        title: "Decryption Failed",
        description: "Invalid password. Try again.",
        variant: "destructive",
      });
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-detective font-bold text-primary">
            Encrypted Notebook
          </h1>
          <p className="text-muted-foreground mt-2">
            Journal pages found in Deck 7 maintenance tunnel
          </p>
        </div>

        <div
          className="case-file p-6 py-12 shadow-lg mb-8 relative overflow-hidden"
          style={{
            backgroundImage: `url("/parchment.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {isDecrypted ? (
            <div className="prose prose-stone max-w-none font-typewriter leading-relaxed text-black font-bold">
              <p>
                Fifteen years I've waited. Victor Mercer destroyed everything my
                parents worked for, contaminated the waters they sought to
                protect, and buried the evidence when they got too close. The
                authorities called it an accident. The Chimera Consortium is
                just another of his masks for corruption.
              </p>
              <p>
                Now I have the resources and connections to ensure justice. I've
                discovered someone else is moving against him - multiple
                professionals hired for the same task. I can use this to my
                advantage.
              </p>
              <p>
                The deep-sea toxin extract is undetectable to standard tests. If
                they fail, I won't. Nobody suspects the quiet scientist.
                Vengeance runs deep like the ocean currents.
              </p>
            </div>
          ) : (
            <div className="prose prose-stone max-w-none font-typewriter select-none leading-relaxed text-black font-bold">
              <p>
                Rmrxiir cievw M'zi aemxih. Zmgxsv Qivgiv hiwxvscih izivdxlmrk qc
                tevirxw asvoih jsv, gsrxeqmrexih xli aexivw xlic wsyklx xs
                tvsxigx, erh fyvmih xli izmhirgi alir xlic ksx xss gpswi. Xli
                eyxlsvmxmiw geppih mx er eggmhirx. Xli Glmqeve Gsrwsvxmyq mw
                nywx ersxliv sj lmw qewow jsv gsvvytxmsr.
              </p>
              <p>
                Rsa M lezi xli viwsyvgiw erh gsrrigxmsrw xs irwyvi nywxmgi. M'zi
                hmwgszivih wsqisri ipwi mw qszmrk ekemrwx lmq - qypxmtpi
                tvsjiwwmsrepw lmvih jsv xli weqi xewo. M ger ywi xlmw xs qc
                ehzerxeki.
              </p>
              <p>
                Xli hiit-wie xsbmr ibxvegx mw yrhixigxefpi xs wxerhevh xiwxw. Mj
                xlic jemp, M asr'x. Rsfshc wywtgxw xli uymix wgmirxmwx.
                Zirkiergi vyrw hiit pmoi xli sgier gyvvirxw.
              </p>
            </div>
          )}
        </div>
        {!isDecrypted && (
          <div className="mt-6 pt-4 border-t border-primary/20">
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Enter decryption key:
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-primary/20 bg-transparent"
                placeholder="Password"
              />
            </div>
            <motion.div
              animate={{ x: isShaking ? [-10, 10, -10, 10, 0] : 0 }}
              transition={{ duration: 0.4 }}
            >
              <Button onClick={handleDecrypt} className="w-full">
                Decrypt Journal
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
