"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import * as z from "zod";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterInterest() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(data: FormValues) {
    toast.success("Interest registered successfully!", {
      description: "We'll contact you soon with more details.",
    });
    console.log(data);
  }

  return (
    <section className="relative py-24 overflow-hidden" id="register">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-background z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container relative z-10"
      >
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-detective mb-4">
            Register Your Interest
          </h2>
          <p className="text-muted-foreground font-typewriter">
            Be the first to know when new cases are available and receive
            exclusive detective insights.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border/50 shadow-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detective Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="detective@email.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your detective experience or any specific interests..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg">
                <Mail className="mr-2" />
                Register Interest
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>

      {/* Ambient lighting effects */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl" />
    </section>
  );
}
